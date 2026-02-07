console.log("🚀 STARTING SERVER...");

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

// --- 1. MIDDLEWARE ---
app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.url}`);
    next();
});
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. DATABASE CONNECTION ---
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing!");
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Error:", err.message));

// --- 3. CLOUDINARY CONFIGURATION ---
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage Engine (Handles PDF, DOC, Images, etc.)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { 
        folder: 'cothm-portal', 
        resource_type: 'auto', // Auto-detects if it's an image or raw file (pdf/doc)
        allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'png', 'zip'] 
    }
});
const upload = multer({ storage: storage });

// --- 4. DATABASE MODELS (SCHEMAS) ---

// User Model
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    course: { type: String, default: "N/A" },
    batchNumber: { type: String, default: "N/A" },
    role: { type: String, enum: ["student", "supervisor", "admin"], default: "student" },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// Project/Thesis Model
const ProjectSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    course: { type: String, default: "N/A" },
    batchNumber: { type: String, default: "N/A" },
    status: { type: String, default: 'Pending Review' },
    feedback: { type: String, default: "" },
    submissions: [{
        stage: String,
        fileName: String,
        fileUrl: String,
        date: { type: Date, default: Date.now }
    }],
    updatedAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// 
// 🆕 Announcement Model
const AnnouncementSchema = new mongoose.Schema({
    title: String,
    message: String,
    date: { type: Date, default: Date.now }
});
const Announcement = mongoose.model('Announcement', AnnouncementSchema);

// 🆕 Resource/Library Model
const ResourceSchema = new mongoose.Schema({
    title: String,
    category: String, // Guidelines, Templates, Samples
    fileUrl: String,
    date: { type: Date, default: Date.now }
});
const Resource = mongoose.model('Resource', ResourceSchema);

// 🆕 Settings Model (For Deadlines)
const SettingsSchema = new mongoose.Schema({
    deadline: Date
});
const Settings = mongoose.model('Settings', SettingsSchema);

// --- 5. ROUTES ---

// Health Check
app.get('/', (req, res) => {
    res.json({
        status: "✅ COTHM Research Portal API Running",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// --- AUTHENTICATION ROUTES ---

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Master Admin Check
        if (email === "admin@cothm.edu.pk" && password === "admin123") {
            let admin = await User.findOne({ email });
            if (!admin) {
                admin = await User.create({
                    firstName: "System", lastName: "Admin",
                    email, password: "admin123", role: "supervisor",
                    course: "Admin", batchNumber: "000"
                });
            }
            return res.json({ message: "Login Success", user: { ...admin._doc, role: "supervisor" } });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });

        let isMatch = (user.password === password) || await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({ message: "Login Success", user });
    } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, course, batchNumber } = req.body;
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            firstName, lastName, email: email.toLowerCase(), password: hashedPassword,
            course: course || "N/A", batchNumber: batchNumber || "N/A", role: "student"
        });
        res.status(200).json({ message: "Account created successfully" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// Forgot Password (Direct Show)
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ error: "Email not found" });

        const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
        user.password = tempPassword; 
        await user.save();

        res.json({ 
            success: true, 
            message: "Password reset successful!", 
            temporaryPassword: tempPassword 
        });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- PROJECT ROUTES ---

// Submit File
app.post('/api/submit', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        const { studentEmail, studentName, stage, course, batchNumber } = req.body;
        
        let project = await Project.findOne({ studentEmail: studentEmail.toLowerCase() });
        if (!project) {
            project = new Project({ 
                studentEmail: studentEmail.toLowerCase(), studentName, 
                course: course || "N/A", batchNumber: batchNumber || "N/A" 
            });
        }
        
        project.submissions.push({ 
            stage: stage || "Submission", 
            fileName: req.file.originalname, 
            fileUrl: req.file.path, 
            date: new Date() 
        });
        project.status = "Pending Review";
        await project.save();
        res.json({ message: "File uploaded successfully" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// Get Projects (All & Individual)
app.get('/api/projects/all', async (req, res) => {
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.json(projects);
});

app.get('/api/projects/my-projects', async (req, res) => {
    const project = await Project.find({ studentEmail: req.query.email?.toLowerCase() });
    res.json(project);
});

// Admin Update
app.post('/api/admin/update', async (req, res) => {
    try {
        const { email, status, comment } = req.body;
        const updateData = { status, updatedAt: new Date() };
        if (comment) updateData.feedback = comment;
        
        await Project.findOneAndUpdate({ studentEmail: email.toLowerCase() }, updateData);
        res.json({ message: "Project updated" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// --- 🆕 NEW FEATURE ROUTES ---

// 1. ANNOUNCEMENTS
app.get('/api/announcements', async (req, res) => {
    const data = await Announcement.find().sort({ date: -1 });
    res.json(data);
});
app.post('/api/announcements', async (req, res) => {
    await Announcement.create(req.body);
    res.json({ message: "Posted" });
});
app.delete('/api/announcements/:id', async (req, res) => {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// 2. RESOURCES (Library)
app.get('/api/resources', async (req, res) => {
    const data = await Resource.find().sort({ date: -1 });
    res.json(data);
});
app.post('/api/resources', upload.single("file"), async (req, res) => {
    try {
        await Resource.create({ 
            title: req.body.title, 
            category: req.body.category, 
            fileUrl: req.file.path 
        });
        res.json({ message: "Uploaded" });
    } catch(err) { res.status(500).json({ error: err.message }); }
});
app.delete('/api/resources/:id', async (req, res) => {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
});

// 3. SETTINGS (Deadline)
app.get('/api/settings', async (req, res) => {
    const settings = await Settings.findOne();
    res.json(settings || {});
});
app.post('/api/settings', async (req, res) => {
    let settings = await Settings.findOne();
    if (!settings) settings = new Settings();
    settings.deadline = req.body.deadline;
    await settings.save();
    res.json({ message: "Saved" });
});

// --- START ---
app.listen(PORT, () => {
    console.log(`\n🚀 SERVER RUNNING ON PORT ${PORT}\n`);
});