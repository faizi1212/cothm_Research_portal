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

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// DATABASE CONNECTION
// ============================================
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI missing!");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Error:", err);
        process.exit(1);
    });

// ============================================
// CLOUDINARY CONFIGURATION
// ============================================
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'thesis-submissions',
        allowed_formats: ['pdf', 'doc', 'docx', 'txt', 'zip', 'rar'],
        resource_type: 'auto'
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }
});

// ============================================
// MODELS
// ============================================
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, default: "student" },
    regNumber: { type: String },
    program: { type: String },
    course: { type: String },
    batch: { type: String },
    batchNumber: { type: String }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const ProjectSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true, lowercase: true },
    studentName: { type: String, required: true },
    regNumber: { type: String, default: "N/A" },
    program: { type: String, default: "N/A" },
    batch: { type: String, default: "N/A" },
    currentStage: { type: String, default: "Not Started" },
    status: { type: String, default: 'Pending Review' },
    submissions: [{
        stage: String,
        fileUrl: String,
        submittedAt: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

// ============================================
// ROUTES
// ============================================

// Health Check
app.get('/', (req, res) => {
    res.json({
        status: "✅ COTHM Research Portal API Running",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { email, firstName, lastName, regNumber, program } = req.body;
        
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({ msg: "User already exists" });
        }

        // Simple password for now (no hashing for simplicity)
        const user = new User({
            email: email.toLowerCase(),
            firstName,
            lastName,
            password: req.body.password || 'password123', // Default password
            regNumber: regNumber || "N/A",
            program: program || "N/A",
            role: "student"
        });

        await user.save();
        console.log("✅ User registered:", email);
        
        res.json({ msg: "Success" });
    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// LOGIN
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ error: "User not found" });
        }

        // Simple password check (plain text for now)
        // If password starts with $2, it's bcrypt hashed
        let passwordMatch = false;
        
        if (user.password.startsWith('$2')) {
            // Bcrypt hashed
            passwordMatch = await bcrypt.compare(password, user.password);
        } else {
            // Plain text
            passwordMatch = (user.password === password);
        }

        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid password" });
        }

        // Check if admin
        let role = user.role;
        if (email.toLowerCase() === "admin@cothm.edu.pk") {
            role = "admin";
            if (user.role !== "admin") {
                user.role = "admin";
                await user.save();
            }
        }

        res.json({
            message: "Login Success",
            user: {
                _id: user._id,
                email: user.email,
                name: `${user.firstName} ${user.lastName}`,
                firstName: user.firstName,
                lastName: user.lastName,
                regNumber: user.regNumber,
                program: user.program,
                batch: user.program,
                role: role
            }
        });
    } catch (err) {
        console.error("Login Error:", err);
        res.status(500).json({ error: "Server error: " + err.message });
    }
});

// CREATE ADMIN (Helper route)
app.get('/api/create-admin', async (req, res) => {
    try {
        await User.deleteOne({ email: "admin@cothm.edu.pk" });
        
        const admin = new User({
            firstName: "Admin",
            lastName: "COTHM",
            email: "admin@cothm.edu.pk",
            password: "admin123",
            role: "admin",
            regNumber: "ADMIN001",
            program: "Administration"
        });
        
        await admin.save();
        res.send("✅ Admin created! Login with: admin@cothm.edu.pk / admin123");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

// FILE UPLOAD
app.post('/api/submit', upload.single("file"), async (req, res) => {
    console.log("\n📥 Upload request");
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        console.log("✅ File:", req.file.originalname);
        console.log("🔗 Cloudinary URL:", req.file.path);

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
                program: studentDetails?.program || "N/A",
                batch: studentDetails?.program || "N/A"
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
        
        console.log("✅ Saved\n");
        
        res.json({
            message: "Upload successful!",
            fileUrl: fileUrl
        });
        
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: err.message });
    }
});

// USER UPLOAD (For PortalDashboard)
app.post('/api/user/upload', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file" });
        }

        const { email, studentName, regNumber, batch } = req.body;
        const fileUrl = req.file.path;

        let project = await Project.findOne({ studentEmail: email.toLowerCase() });
        
        if (!project) {
            project = new Project({
                studentEmail: email.toLowerCase(),
                studentName: studentName || "Unknown",
                regNumber: regNumber || "N/A",
                program: batch || "N/A",
                batch: batch || "N/A"
            });
        }

        project.submissions.push({ 
            stage: "Thesis", 
            fileUrl, 
            submittedAt: new Date() 
        });
        project.status = 'Pending Review';
        
        await project.save();
        
        res.json({ message: "Upload successful", fileUrl });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET USER PROJECT
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

// GET STATUS
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

// GET PROFILE
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

// ADMIN: GET ALL PROJECTS
app.get('/api/admin/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort({ updatedAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ADMIN: UPDATE STATUS
app.post('/api/admin/update', async (req, res) => {
    try {
        const { email, status } = req.body;
        
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
// START SERVER
// ============================================
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`☁️  Cloudinary: ${cloudinary.config().cloud_name}`);
    console.log(`📊 Database: ${mongoose.connection.name}\n`);
});