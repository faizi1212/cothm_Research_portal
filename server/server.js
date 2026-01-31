require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. LOGGING MIDDLEWARE (See every request)
app.use((req, res, next) => {
    console.log(`➡️  Received Request: ${req.method} ${req.url}`);
    next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. ROBUST DATABASE CONNECTION
console.log("⏳ Attempting to connect to MongoDB...");
if (!process.env.MONGO_URI) {
    console.error("❌ FATAL ERROR: MONGO_URI is missing from Environment Variables!");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => {
        console.error("❌ MongoDB Connection Failed:", err.message);
        // Do not exit, just log it so we see it in Render
    });

// CLOUDINARY
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'thesis-submissions', allowed_formats: ['pdf', 'doc', 'docx', 'jpg', 'png'], resource_type: 'auto' }
});
const upload = multer({ storage: storage });

// MODELS
const ProjectSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    regNumber: { type: String, default: "N/A" },
    program: { type: String, default: "N/A" },
    status: { type: String, default: 'Pending Review' }, 
    currentStage: { type: String, default: 'Proposal' },
    submissions: [Object],
    comments: [Object],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    regNumber: { type: String, required: true },
    program: { type: String, required: true },
    password: { type: String },
    role: { type: String, default: "student" },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// ROUTES

// LOGIN ROUTE (With Debug Logs)
app.post('/login', async (req, res) => {
    console.log(`🔐 Login Attempt for email: ${req.body.email}`);
    
    // Check DB State: 0=Disconnected, 1=Connected, 2=Connecting
    if (mongoose.connection.readyState !== 1) {
        console.error("❌ DATABASE IS NOT CONNECTED. Login Aborted.");
        return res.status(500).json({ error: "Database not connected. Check Server Logs." });
    }

    try {
        const { email, password } = req.body;
        
        // Find User
        console.log("🔍 Searching for user in DB...");
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("⚠️ User Not Found");
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        console.log("✅ User Found. Checking Password...");
        if (user.password !== password) {
            console.log("⚠️ Wrong Password");
            return res.status(400).json({ error: "Invalid Credentials" });
        }

        const role = email === "admin@cothm.edu.pk" ? "admin" : "student";
        console.log("🚀 Login Successful!");
        res.json({ message: "Login Success", user: { ...user._doc, role } });

    } catch (err) {
        console.error("❌ LOGIN ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

// ADMIN ROUTES (Required for Supervisor)
app.post('/api/admin/update', async (req, res) => {
    try {
        console.log("🔄 Updating Status:", req.body.email);
        const { email, status } = req.body;
        const updated = await Project.findOneAndUpdate({ studentEmail: email }, { status: status }, { new: true });
        res.json({ message: "Updated", project: updated });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.post('/api/admin/comment', async (req, res) => {
    try {
        console.log("💬 Adding Comment:", req.body.email);
        const { email, comment } = req.body;
        const project = await Project.findOne({ studentEmail: email });
        if(project) {
            project.comments.push({ text: comment, adminName: "Supervisor", date: new Date() });
            await project.save();
            res.json({ message: "Comment added" });
        } else {
            res.status(404).json({ error: "Project not found" });
        }
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/admin/projects', async (req, res) => {
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.json(projects);
});

// OTHER ROUTES
app.post('/api/register', async (req, res) => {
    try {
        await User.create(req.body);
        res.json({ msg: "Success" });
    } catch (err) { res.status(500).send("Error"); }
});

app.post('/api/submit', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file" });
        const { studentEmail, studentName, stage } = req.body;
        let project = await Project.findOne({ studentEmail });
        if (!project) {
            const u = await User.findOne({ email: studentEmail });
            project = new Project({ studentEmail, studentName, regNumber: u?.regNumber, program: u?.program });
        }
        project.submissions.push({ stage, fileUrl: req.file.path });
        project.status = 'Pending Review';
        await project.save();
        res.json({ message: "Uploaded" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/api/status/:email', async (req, res) => {
    const p = await Project.findOne({ studentEmail: req.params.email });
    res.json(p || { status: "Not Started", submissions: [], comments: [] });
});

// START SERVER
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));