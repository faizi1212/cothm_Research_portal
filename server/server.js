require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();

// ============================================
// CLOUDINARY CONFIGURATION
// ============================================
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

console.log("☁️  Cloudinary:", process.env.CLOUDINARY_CLOUD_NAME || "Not configured");

// ============================================
// CORS - Allow all origins for production
// ============================================
app.use(cors({
    origin: true, // Allows all origins (needed for Vercel -> Render)
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// CLOUDINARY STORAGE
// ============================================
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'thesis-submissions',
        allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'zip', 'rar', 'png', 'jpg'],
        resource_type: 'auto',
        public_id: (req, file) => {
            const timestamp = Date.now();
            const safeName = file.originalname
                .replace(/\.[^/.]+$/, '')
                .replace(/[^a-zA-Z0-9]/g, '_');
            return `${timestamp}_${safeName}`;
        }
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

// ============================================
// MONGODB CONNECTION
// ============================================
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI not found!");
    process.exit(1);
}

console.log("🔄 Connecting to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected");
    })
    .catch((err) => {
        console.error("❌ MongoDB Error:", err.message);
        process.exit(1);
    });

// ============================================
// LOAD MODELS
// ============================================
const User = require('./models/User');
const Project = require('./models/Project');
console.log("✅ Models loaded");

// ============================================
// ROUTES
// ============================================

// Health Check
app.get('/', (req, res) => {
    res.json({
        status: "✅ COTHM Research Portal API is Running!",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        cloudinary: cloudinary.config().cloud_name || 'Not configured'
    });
});

// Register User
app.post('/api/register', async (req, res) => {
    try {
        const { email, firstName, lastName, regNumber, program } = req.body;
        
        if (!email || !firstName || !lastName || !regNumber || !program) {
            return res.status(400).json({ error: "All fields required" });
        }
        
        let user = await User.findOne({ email: email.toLowerCase() });
        if (user) {
            return res.status(400).json({ msg: "User already exists" });
        }
        
        user = new User({ 
            email: email.toLowerCase(), 
            firstName, 
            lastName, 
            regNumber, 
            program 
        });
        
        await user.save();
        console.log("✅ User registered:", email);
        
        res.json({ msg: "Success" });
        
    } catch (err) {
        console.error("❌ Register Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Check if admin
        const role = email.toLowerCase() === "admin@cothm.edu.pk" ? "admin" : "student";
        
        res.json({
            message: "Login Success",
            user: { 
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                regNumber: user.regNumber,
                batch: user.program,
                role 
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// File Upload
app.post('/api/submit', upload.single("file"), async (req, res) => {
    console.log("\n📥 Upload request received");
    
    try {
        if (!req.file) {
            console.error("❌ No file");
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("✅ File uploaded to Cloudinary:", req.file.path);

        const { studentEmail, studentName, stage } = req.body;
        
        if (!studentEmail || !stage) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const fileUrl = req.file.path;

        let project = await Project.findOne({ studentEmail: studentEmail.toLowerCase() });
        
        if (!project) {
            const studentDetails = await User.findOne({ email: studentEmail.toLowerCase() });
            project = new Project({
                studentEmail: studentEmail.toLowerCase(),
                studentName: studentName || "Unknown",
                regNumber: studentDetails?.regNumber || "N/A",
                program: studentDetails?.program || "N/A"
            });
        }

        project.submissions.push({ 
            stage, 
            fileUrl, 
            submittedAt: new Date() 
        });
        project.currentStage = stage;
        project.status = 'Pending Review';
        
        await project.save();
        
        console.log("✅ Saved to database\n");
        
        res.json({
            message: "Upload successful!",
            fileUrl: fileUrl,
            filename: req.file.originalname
        });
        
    } catch (err) {
        console.error("❌ Upload Error:", err);
        res.status(500).json({ 
            error: "Server error",
            message: err.message 
        });
    }
});

// User Upload Route (for PortalDashboard)
app.post('/api/user/upload', upload.single("file"), async (req, res) => {
    console.log("\n📥 User upload request");
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("✅ File uploaded:", req.file.path);

        const { email, studentName, regNumber, batch } = req.body;
        const fileUrl = req.file.path;

        let project = await Project.findOne({ studentEmail: email.toLowerCase() });
        
        if (!project) {
            project = new Project({
                studentEmail: email.toLowerCase(),
                studentName: studentName || "Unknown",
                regNumber: regNumber || "N/A",
                program: batch || "N/A"
            });
        }

        project.submissions.push({ 
            stage: "Thesis Submission", 
            fileUrl, 
            submittedAt: new Date() 
        });
        project.status = 'Pending Review';
        
        await project.save();
        
        res.json({ message: "Upload successful", fileUrl });
        
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// Get user project
app.get('/api/user/my-project', async (req, res) => {
    try {
        const { email } = req.query;
        const project = await Project.findOne({ studentEmail: email.toLowerCase() });
        
        if (!project) {
            return res.json({ submissions: [], status: "Not Started" });
        }
        
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Student Status
app.get('/api/status/:email', async (req, res) => {
    try {
        const project = await Project.findOne({ 
            studentEmail: req.params.email.toLowerCase() 
        });
        
        if (!project) {
            return res.json({ 
                status: "Not Started", 
                currentStage: "None" 
            });
        }
        
        res.json(project);
        
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Get Student Profile
app.get('/api/profile/:email', async (req, res) => {
    try {
        const user = await User.findOne({ 
            email: req.params.email.toLowerCase() 
        });
        res.json(user || {});
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Admin: Get All Projects
app.get('/api/admin/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ updatedAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Admin: Update Project Status
app.post('/api/admin/update', async (req, res) => {
    try {
        const { email, status } = req.body;
        
        if (!email || !status) {
            return res.status(400).json({ error: "Email and status required" });
        }
        
        const project = await Project.findOneAndUpdate(
            { studentEmail: email.toLowerCase() },
            { status: status, updatedAt: new Date() },
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        
        res.json({ message: "Updated successfully" });
        
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ============================================
// START SERVER (PRODUCTION READY)
// ============================================
const PORT = process.env.PORT || 5000;

// ✅ DO NOT specify HOST - let Render/Railway decide
app.listen(PORT, () => {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`🚀 SERVER RUNNING`);
    console.log(`${"=".repeat(50)}`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`☁️  Storage: Cloudinary (${cloudinary.config().cloud_name})`);
    console.log(`📊 Database: ${mongoose.connection.name || 'Connecting...'}`);
    console.log(`${"=".repeat(50)}\n`);
});