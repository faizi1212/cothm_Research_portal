require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcryptjs'); // <--- USING THE STABLE LIBRARY

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DATABASE CONNECTION
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing!");
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ DB Error:", err));

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
    role: { type: String, default: "student" },
    // New Fields
    course: { type: String, default: "N/A" },
    batchNumber: { type: String, default: "N/A" }
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

const ProjectSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    course: { type: String, default: "N/A" },
    batchNumber: { type: String, default: "N/A" },
    status: { type: String, default: 'Pending Review' },
    submissions: [Object]
}, { timestamps: true });

const Project = mongoose.model('Project', ProjectSchema);

// --- ROUTES ---

// 1. LOGIN (Universal Fix)
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Check Password (Supports BOTH Plain Text and Encrypted)
        let isMatch = false;
        if (user.password === password) {
            isMatch = true; // Plain text match (Old Admin/Users)
        } else {
            isMatch = await bcrypt.compare(password, user.password); // Encrypted match (New Users)
        }

        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        // Auto-Fix Admin Role
        if (user.email === "admin@cothm.edu.pk" && user.role !== "supervisor") {
            user.role = "supervisor";
            await user.save();
        }

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
        console.error("Login Error:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

// 2. REGISTER (For Students)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, course, batchNumber } = req.body;
        
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        // Encrypt Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            firstName, lastName, email,
            password: hashedPassword,
            course: course || "N/A",
            batchNumber: batchNumber || "N/A",
            role: "student"
        });

        await newUser.save();
        res.status(200).json({ message: "Registration Successful" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// 3. ADMIN FIX (Reset Admin Account)
app.get('/api/fix-admin', async (req, res) => {
    try {
        await User.deleteOne({ email: "admin@cothm.edu.pk" });
        await User.create({
            firstName: "System", lastName: "Admin",
            email: "admin@cothm.edu.pk",
            password: "admin123", // Plain text for guaranteed access
            role: "supervisor",
            course: "Admin", batchNumber: "000"
        });
        res.send("Admin Reset. Login with: admin@cothm.edu.pk / admin123");
    } catch (err) { res.send(err.message); }
});

// 4. PROJECT DATA
app.get('/api/projects/all', async (req, res) => {
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.json(projects);
});

app.get('/api/projects/my-projects', async (req, res) => {
    const p = await Project.findOne({ studentEmail: req.query.email });
    res.json(p ? [p] : []);
});

app.post('/api/submit', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file" });
        const { studentEmail, studentName, stage, course, batchNumber } = req.body;

        let project = await Project.findOne({ studentEmail });
        if (!project) project = new Project({ studentEmail, studentName, course, batchNumber });

        project.submissions.push({
            stage, fileName: req.file.originalname, fileUrl: req.file.path, date: new Date()
        });
        project.status = "Pending Review";
        await project.save();
        res.json({ message: "Uploaded" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));