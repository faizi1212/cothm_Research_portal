console.log("🚀 STARTING ENTERPRISE SERVER...");

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Error:", err.message));

// --- CLOUDINARY ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'cothm-enterprise', resource_type: 'auto' }
});
const upload = multer({ storage: storage });

// --- SCHEMAS ---
const UserSchema = new mongoose.Schema({
    firstName: String, lastName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    course: String, batchNumber: String,
    avatar: { type: String, default: "" },
    role: { type: String, default: "student" },
    lastLogin: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const ProjectSchema = new mongoose.Schema({
    studentEmail: String, studentName: String,
    course: String, batchNumber: String,
    status: { type: String, default: 'Pending Review' },
    feedback: String,
    submissions: [{ stage: String, fileName: String, fileUrl: String, date: { type: Date, default: Date.now } }],
    updatedAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// 🆕 Kanban Task Schema
const TaskSchema = new mongoose.Schema({
    studentEmail: String,
    title: String,
    status: { type: String, default: "To Do" }, // To Do, In Progress, Done
    createdAt: { type: Date, default: Date.now }
});
const Task = mongoose.model('Task', TaskSchema);

const NotificationSchema = new mongoose.Schema({ recipient: String, message: String, type: String, read: { type: Boolean, default: false }, date: { type: Date, default: Date.now } });
const Notification = mongoose.model('Notification', NotificationSchema);

const AnnouncementSchema = new mongoose.Schema({ title: String, message: String, date: { type: Date, default: Date.now } });
const Announcement = mongoose.model('Announcement', AnnouncementSchema);

const ResourceSchema = new mongoose.Schema({ title: String, category: String, fileUrl: String, date: { type: Date, default: Date.now } });
const Resource = mongoose.model('Resource', ResourceSchema);

const SettingsSchema = new mongoose.Schema({ deadline: Date });
const Settings = mongoose.model('Settings', SettingsSchema);

// --- ROUTES ---

// 🆕 Kanban Routes
app.get('/api/tasks', async (req, res) => {
    res.json(await Task.find({ studentEmail: req.query.email }).sort({ createdAt: -1 }));
});
app.post('/api/tasks', async (req, res) => {
    const task = await Task.create(req.body);
    res.json(task);
});
app.put('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.json({ message: "Moved" });
});
app.delete('/api/tasks/:id', async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// Existing Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email === "admin@cothm.edu.pk" && password === "admin123") {
            let admin = await User.findOne({ email });
            if (!admin) admin = await User.create({ firstName: "System", lastName: "Admin", email, password: "admin123", role: "supervisor" });
            return res.json({ message: "Welcome Back", user: { ...admin._doc, role: "supervisor" } });
        }
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = (user.password === password) || await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
        user.lastLogin = new Date(); await user.save();
        res.json({ message: "Login Success", user });
    } catch (err) { res.status(500).json({ message: "Server error" }); }
});

app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, course, batchNumber } = req.body;
        const exists = await User.findOne({ email: email.toLowerCase() });
        if (exists) return res.status(400).json({ message: "Email exists" });
        const hash = await bcrypt.hash(password, 10);
        await User.create({ firstName, lastName, email: email.toLowerCase(), password: hash, course, batchNumber });
        res.json({ message: "Registered Successfully" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.put('/api/auth/update-profile', upload.single('avatar'), async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;
        const updateData = { firstName, lastName };
        if (password) updateData.password = await bcrypt.hash(password, 10);
        const user = await User.findOneAndUpdate({ email }, updateData, { new: true });
        res.json({ message: "Profile Updated", user });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/projects/all', async (req, res) => { res.json(await Project.find().sort({ updatedAt: -1 })); });
app.get('/api/projects/my-projects', async (req, res) => { res.json(await Project.find({ studentEmail: req.query.email?.toLowerCase() })); });
app.get('/api/announcements', async (req, res) => { res.json(await Announcement.find().sort({ date: -1 })); });
app.get('/api/resources', async (req, res) => { res.json(await Resource.find().sort({ date: -1 })); });
app.get('/api/settings', async (req, res) => { res.json(await Settings.findOne() || {}); });
app.get('/api/notifications', async (req, res) => {
    const { email } = req.query;
    const query = email === 'admin@cothm.edu.pk' ? { recipient: 'admin' } : { recipient: email };
    res.json(await Notification.find(query).sort({ date: -1 }).limit(10));
});

app.post('/api/submit', upload.single("file"), async (req, res) => {
    const { studentEmail, studentName, stage, batchNumber } = req.body;
    let project = await Project.findOne({ studentEmail });
    if (!project) project = new Project({ studentEmail, studentName, batchNumber });
    project.submissions.push({ stage, fileName: req.file.originalname, fileUrl: req.file.path });
    project.status = "Pending Review";
    await project.save();
    await Notification.create({ recipient: 'admin', message: `📄 New submission: ${studentName}`, type: 'info' });
    res.json({ message: "Submitted Successfully" });
});

app.post('/api/admin/update', async (req, res) => {
    const { email, status, comment } = req.body;
    await Project.findOneAndUpdate({ studentEmail: email }, { status, feedback: comment });
    await Notification.create({ recipient: email, message: `📝 Your project is ${status}`, type: status === 'Approved' ? 'success' : 'error' });
    res.json({ message: "Status Updated" });
});

app.post('/api/announcements', async (req, res) => { await Announcement.create(req.body); res.json({ message: "Published" }); });
app.post('/api/resources', upload.single("file"), async (req, res) => { await Resource.create({ title: req.body.title, category: req.body.category, fileUrl: req.file.path }); res.json({ message: "Uploaded" }); });
app.post('/api/settings', async (req, res) => { await Settings.findOneAndUpdate({}, { deadline: req.body.deadline }, { upsert: true }); res.json({ message: "Deadline Set" }); });

app.delete('/api/announcements/:id', async (req, res) => { await Announcement.findByIdAndDelete(req.params.id); res.json({msg: "Deleted"}); });
app.delete('/api/resources/:id', async (req, res) => { await Resource.findByIdAndDelete(req.params.id); res.json({msg: "Deleted"}); });

app.listen(PORT, () => console.log(`🚀 Server running on Port ${PORT}`));