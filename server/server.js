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

// LOGGING
app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.url}`);
    next();
});

// CORS
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DATABASE
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing!");
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Error:", err.message));

// CLOUDINARY
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'thesis-portal', allowed_formats: ['pdf', 'doc', 'docx'] }
});
const upload = multer({ storage: storage });

// --- MODELS ---
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

const ProjectSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    course: { type: String, default: "N/A" },
    batchNumber: { type: String, default: "N/A" },
    status: { type: String, default: 'Pending Review' },
    feedback: { type: String, default: "" },
    submissions: [Object],
    updatedAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// --- ROUTES ---

// HEALTH CHECK
app.get('/', (req, res) => {
    res.json({
        status: "✅ COTHM Research Portal API Running",
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// FORGOT PASSWORD - SHOW PASSWORD DIRECTLY (NO EMAIL)
app.post('/api/auth/forgot-password', async (req, res) => {
    console.log("\n📧 Forgot password request:", req.body);
    
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        console.log("🔍 Looking for user:", email);

        // Find user
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ error: "Email not found in our system" });
        }

        console.log("✅ User found:", user.firstName, user.lastName);

        // Generate temporary password (8 characters, uppercase)
        const tempPassword = Math.random().toString(36).slice(-8).toUpperCase();
        console.log("🔑 Generated temp password:", tempPassword);

        // Save new password to database
        user.password = tempPassword;
        await user.save();
        console.log("💾 Password updated in database");

        // Return the password directly (NO EMAIL SENDING)
        console.log("✅ Sending password in response");
        res.json({ 
            success: true,
            message: "Password reset successful!",
            temporaryPassword: tempPassword,
            note: "Please copy this password and login immediately. Change it after logging in."
        });
        
    } catch (err) {
        console.error("❌ Forgot password error:", err);
        res.status(500).json({ 
            error: "Server error while resetting password",
            details: err.message
        });
    }
});

// LOGIN
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`🔐 Login Attempt: ${email}`);

        // Master Admin Check
        if (email === "admin@cothm.edu.pk" && password === "admin123") {
            let admin = await User.findOne({ email });
            if (!admin) {
                admin = await User.create({
                    firstName: "System", lastName: "Admin",
                    email, password: "admin123", role: "supervisor",
                    course: "Admin", batchNumber: "000"
                });
            } else if (admin.role !== "supervisor") {
                admin.role = "supervisor";
                await admin.save();
            }
            return res.json({
                message: "Login Success",
                user: { ...admin._doc, role: "supervisor" }
            });
        }

        // Normal User Login
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check password (plain text or bcrypt)
        let isMatch = false;
        if (user.password === password) {
            isMatch = true; // Plain text match
        } else {
            isMatch = await bcrypt.compare(password, user.password); // Bcrypt match
        }

        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({
            message: "Login Success",
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                course: user.course,
                batchNumber: user.batchNumber
            }
        });

    } catch (err) {
        console.error("❌ Login Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

app.post('/api/auth/login', handleLogin);
app.post('/login', handleLogin);

// REGISTER
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, course, batchNumber } = req.body;
        
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            firstName, lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            course: course || "N/A",
            batchNumber: batchNumber || "N/A",
            role: "student"
        });
        
        console.log("✅ User registered:", email);
        res.status(200).json({ message: "Account created successfully" });
        
    } catch (err) { 
        console.error("❌ Register Error:", err);
        res.status(500).json({ message: err.message }); 
    }
});

// ADMIN UPDATE PROJECT
app.post('/api/admin/update', async (req, res) => {
    try {
        const { email, status, comment } = req.body;
        console.log(`📝 Admin Update: ${email} -> ${status}`);

        if (!email || !status) {
            return res.status(400).json({ error: "Email and status required" });
        }

        const updateData = { status, updatedAt: new Date() };
        if (comment) updateData.feedback = comment;

        const project = await Project.findOneAndUpdate(
            { studentEmail: email.toLowerCase() }, 
            updateData, 
            { new: true }
        );
        
        if (!project) {
            return res.status(404).json({ error: "Project not found" });
        }
        
        console.log("✅ Project updated");
        res.json({ message: "Project updated successfully", project });
        
    } catch (err) { 
        console.error("❌ Admin Update Error:", err);
        res.status(500).json({ error: err.message }); 
    }
});

// GET ALL PROJECTS (ADMIN)
app.get('/api/projects/all', async (req, res) => {
    try {
        const projects = await Project.find().sort({ updatedAt: -1 });
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET MY PROJECTS (STUDENT)
app.get('/api/projects/my-projects', async (req, res) => {
    try {
        const project = await Project.findOne({ 
            studentEmail: req.query.email?.toLowerCase() 
        });
        res.json(project ? [project] : []);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// SUBMIT PROJECT FILE
app.post('/api/submit', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        
        const { studentEmail, studentName, stage, course, batchNumber } = req.body;
        
        let project = await Project.findOne({ 
            studentEmail: studentEmail.toLowerCase() 
        });
        
        if (!project) {
            project = new Project({ 
                studentEmail: studentEmail.toLowerCase(), 
                studentName, 
                course: course || "N/A", 
                batchNumber: batchNumber || "N/A" 
            });
        }
        
        project.submissions.push({ 
            stage: stage || "Thesis Submission", 
            fileName: req.file.originalname, 
            fileUrl: req.file.path, 
            date: new Date() 
        });
        project.status = "Pending Review";
        project.updatedAt = new Date();
        
        await project.save();
        
        console.log("✅ File uploaded:", req.file.originalname, "by", studentEmail);
        res.json({ 
            message: "File uploaded successfully",
            fileUrl: req.file.path
        });
        
    } catch (err) { 
        console.error("❌ Submit Error:", err);
        res.status(500).json({ error: err.message }); 
    }
});

// START SERVER
app.listen(PORT, () => {
    console.log(`\n${"=".repeat(50)}`);
    console.log(`🚀 SERVER RUNNING ON PORT ${PORT}`);
    console.log(`${"=".repeat(50)}\n`);
});