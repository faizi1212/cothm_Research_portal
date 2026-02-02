require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcrypt'); 

const app = express();
const PORT = process.env.PORT || 5000;

// LOGGING
app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.url}`);
    next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DATABASE
if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is missing!");
    process.exit(1);
}
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected!"))
    .catch(err => console.error("❌ DB Error:", err.message));

// CLOUDINARY
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { folder: 'thesis-submissions', allowed_formats: ['pdf', 'doc', 'docx'], resource_type: 'auto' }
});
const upload = multer({ storage: storage });

// --- MODELS ---
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
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
    submissions: [Object],
    updatedAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);

// --- ROUTES ---

// 1. LOGIN ROUTE (The "Universal" Fix)
app.post('/api/auth/login', async (req, res) => {
    console.log(`🔐 Login Attempt: ${req.body.email}`);
    try {
        // Find user
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // --- PASSWORD CHECK LOGIC ---
        let isMatch = false;

        // CHECK 1: Is it a simple Plain Text password? (Like "admin123")
        if (user.password === req.body.password) {
            console.log("✅ Password Matched (Plain Text)");
            isMatch = true;
        } 
        // CHECK 2: Is it Encrypted? (Try bcrypt)
        else {
            try {
                isMatch = await bcrypt.compare(req.body.password, user.password);
                if (isMatch) console.log("✅ Password Matched (Encrypted)");
            } catch (err) {
                // Ignore error, just means it wasn't encrypted
            }
        }

        if (!isMatch) {
            console.log("❌ Wrong Password");
            return res.status(400).json({ message: "Invalid Password" });
        }

        // --- AUTO-FIX ADMIN ROLE ---
        if (user.email === "admin@cothm.edu.pk" && user.role !== "supervisor") {
            console.log("🔧 Fixing Admin Role to Supervisor...");
            user.role = "supervisor";
            await user.save();
        }

        // RETURN SUCCESS
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
        console.error("❌ SERVER ERROR:", err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

// 2. REGISTER (For Students)
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, course, batchNumber } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        // Hash password for security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            firstName, lastName, email,
            password: hashedPassword, // Store encrypted
            course: course || "N/A",
            batchNumber: batchNumber || "N/A",
            role: "student"
        });
        res.status(200).json({ message: "Registered!" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. FORCE ADMIN RESET (Run this via browser if locked out)
app.get('/api/fix-admin', async (req, res) => {
    try {
        console.log("🛠️ FORCING ADMIN RESET...");
        await User.deleteOne({ email: "admin@cothm.edu.pk" });
        
        await User.create({
            firstName: "System", lastName: "Admin",
            email: "admin@cothm.edu.pk", 
            password: "admin123", // Plain text guaranteed
            role: "supervisor", 
            course: "Admin", batchNumber: "000"
        });
        
        res.send("<h1>Admin Reset Success</h1><p>Login with: admin@cothm.edu.pk / admin123</p>");
    } catch(e) { res.send("Error: " + e.message); }
});

// 4. PROJECT ROUTES
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
        project.submissions.push({ stage, fileName: req.file.originalname, fileUrl: req.file.path, date: new Date() });
        project.status = 'Pending Review';
        await project.save();
        res.json({ message: "Uploaded!" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));