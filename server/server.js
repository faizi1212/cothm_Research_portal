require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const nodemailer = require('nodemailer'); 
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DATABASE ---
if (!process.env.MONGO_URI) { console.error("❌ MONGO_URI missing"); process.exit(1); }
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Error:", err));

// --- CLOUDINARY ---
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

// --- MODELS ---
const SubmissionSchema = new mongoose.Schema({
    stage: String,
    fileUrl: String,
    submittedAt: { type: Date, default: Date.now }
});

// New: Comment Schema
const CommentSchema = new mongoose.Schema({
    text: String,
    adminName: String,
    date: { type: Date, default: Date.now }
});

const ProjectSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    regNumber: { type: String, default: "N/A" },
    program: { type: String, default: "N/A" },
    status: { type: String, default: 'Pending Review' }, 
    currentStage: { type: String, default: 'Proposal' },
    submissions: [SubmissionSchema],
    comments: [CommentSchema], // Stores comments
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

// --- ROUTES ---

// 1. UPDATE STATUS (This fixes the "Processing" stuck issue)
app.post('/api/admin/update', async (req, res) => {
    try {
        console.log("Updating status for:", req.body.email);
        const { email, status } = req.body;
        
        const updated = await Project.findOneAndUpdate(
            { studentEmail: email }, 
            { status: status },
            { new: true } // Return the updated doc
        );
        
        if(!updated) return res.status(404).json({ error: "Project not found" });
        
        console.log("✅ Status Updated:", status);
        res.json({ message: "Updated", project: updated });
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 2. ADD COMMENT (This fixes the comment feature)
app.post('/api/admin/comment', async (req, res) => {
    try {
        console.log("Adding comment for:", req.body.email);
        const { email, comment } = req.body;
        
        const project = await Project.findOne({ studentEmail: email });
        if (!project) return res.status(404).json({ error: "Project not found" });

        project.comments.push({ text: comment, adminName: "Supervisor" });
        await project.save();
        
        console.log("✅ Comment Added");
        res.json({ message: "Comment added" });
    } catch (err) {
        console.error("Comment Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// 3. GET PROJECTS
app.get('/api/admin/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ updatedAt: -1 });
        res.json(projects);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { email, firstName, lastName, regNumber, program, password } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User exists" });
        user = new User({ email, firstName, lastName, regNumber, program, password });
        await user.save();
        res.json({ msg: "Success" });
    } catch (err) { res.status(500).send("Server Error"); }
});

// 5. LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.password !== password) return res.status(400).json({ error: "Invalid Credentials" });
        const role = email === "admin@cothm.edu.pk" ? "admin" : "student";
        res.json({ message: "Login Success", user: { ...user._doc, role } });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 6. UPLOAD
app.post('/api/submit', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        const { studentEmail, studentName, stage } = req.body;
        let project = await Project.findOne({ studentEmail });
        if (!project) {
            const u = await User.findOne({ email: studentEmail });
            project = new Project({ studentEmail, studentName: studentName || "Unknown", regNumber: u?.regNumber, program: u?.program });
        }
        project.submissions.push({ stage, fileUrl: req.file.path });
        project.status = 'Pending Review';
        await project.save();
        res.json({ message: "Upload Successful" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 7. GET STUDENT STATUS
app.get('/api/status/:email', async (req, res) => {
    const p = await Project.findOne({ studentEmail: req.params.email });
    res.json(p || { status: "Not Started", submissions: [], comments: [] });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));