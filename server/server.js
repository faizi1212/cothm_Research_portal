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

// --- EMERGENCY ADMIN FIX ROUTE ---
// Visit https://YOUR-RENDER-URL.com/api/fix-admin to reset admin account
app.get('/api/fix-admin', async (req, res) => {
    try {
        const adminEmail = "admin@cothm.edu.pk";
        console.log("🛠️ Starting Admin Fix...");

        // 1. Delete old/broken admin
        await User.deleteOne({ email: adminEmail });
        console.log("🗑️ Deleted old admin (if any)");

        // 2. Create fresh admin
        const newAdmin = new User({
            firstName: "Cothm",
            lastName: "Admin",
            email: adminEmail,
            password: "admin123",
            regNumber: "ADMIN001",
            program: "Administration",
            role: "admin"
        });

        await newAdmin.save();
        console.log("✅ New Admin Created!");
        res.send("✅ ADMIN FIXED! You can now login with: <br>Email: <b>admin@cothm.edu.pk</b> <br>Password: <b>admin123</b>");
    } catch (err) {
        console.error("❌ Admin Fix Failed:", err);
        res.status(500).send("Error fixing admin: " + err.message);
    }
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {
    console.log(`🔐 Login Attempt for email: ${req.body.email}`);
    
    if (mongoose.connection.readyState !== 1) {
        return res.status(500).json({ error: "Database not connected." });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            console.log("⚠️ User Not Found");
            return res.status(400).json({ error: "Invalid Credentials" });
        }

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

// ADMIN ROUTES
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

// REGISTER ROUTE (Fixed Duplicate Check)
app.post('/api/register', async (req, res) => {
    console.log("📝 Registration Attempt:", req.body.email);
    try {
        const { email } = req.body;
        const existing = await User.findOne({ email });
        if (existing) {
            console.log("⚠️ User already exists");
            return res.status(400).json({ msg: "Account already exists! Please Login." });
        }
        await User.create(req.body);
        console.log("✅ User Created");
        res.json({ msg: "Success" });
    } catch (err) { 
        console.error("❌ Register Error:", err);
        res.status(500).send("Error: " + err.message); 
    }
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

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));