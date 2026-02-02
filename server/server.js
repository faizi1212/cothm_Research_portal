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

// LOGGING (Check Render Logs to see these)
app.use((req, res, next) => {
    console.log(`➡️  ${req.method} ${req.url}`);
    next();
});

// CORS: Allow All Origins (Fixes connection issues)
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
    password: { type: String, required: true }, // Can be hash OR plain text
    course: { type: String, default: "N/A" },
    batchNumber: { type: String, default: "N/A" },
    role: { type: String, default: "student" },
}, { timestamps: true });
const User = mongoose.model('User', UserSchema);

const ProjectSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    course: { type: String, default: "N/A" },
    batchNumber: { type: String, default: "N/A" },
    status: { type: String, default: 'Pending Review' }, 
    feedback: { type: String, default: "" }, 
    submissions: [Object]
}, { timestamps: true });
const Project = mongoose.model('Project', ProjectSchema);

// --- ROUTES ---

// 1. LOGIN HANDLER (The "Master Key" Fix)
const handleLogin = async (req, res) => {
    console.log(`🔐 Login Attempt: ${req.body.email}`);
    
    try {
        const { email, password } = req.body;
        
        // --- MASTER KEY FOR ADMIN (Bypasses DB Check) ---
        if (email === "admin@cothm.edu.pk" && password === "admin123") {
            console.log("🔑 MASTER KEY USED: Force Login Admin");
            let admin = await User.findOne({ email: "admin@cothm.edu.pk" });
            
            // If admin doesn't exist, create it instantly
            if (!admin) {
                admin = await User.create({
                    firstName: "System", lastName: "Admin",
                    email: "admin@cothm.edu.pk", password: "admin123",
                    role: "supervisor", course: "Admin", batchNumber: "000"
                });
            } else if (admin.role !== "supervisor") {
                admin.role = "supervisor";
                await admin.save();
            }

            return res.json({
                message: "Login Success (Master Key)",
                user: { ...admin._doc, role: "supervisor" }
            });
        }
        // ------------------------------------------------

        // Normal Student Login
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Check Password (Try Plain Text first, then Bcrypt)
        let isMatch = false;
        if (user.password === password) {
            isMatch = true; // Old account
        } else {
            try {
                isMatch = await bcrypt.compare(password, user.password); // New account
            } catch (e) {
                isMatch = false;
            }
        }

        if (!isMatch) return res.status(400).json({ message: "Wrong Password" });

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
        console.error("🔥 LOGIN ERROR:", err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
};

// LISTEN ON BOTH ROUTES (To fix "Not Found" errors)
app.post('/api/auth/login', handleLogin);
app.post('/api/login', handleLogin);

// 2. REGISTER
app.post('/api/auth/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, course, batchNumber } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        await User.create({
            firstName, lastName, email,
            password: hashedPassword,
            course: course || "N/A",
            batchNumber: batchNumber || "N/A",
            role: "student"
        });
        res.status(200).json({ message: "Registered" });
    } catch (err) { res.status(500).json({ message: err.message }); }
});

// 3. ADMIN UPDATE (Feedback Fix)
app.post('/api/admin/update', async (req, res) => {
    try {
        const { email, status, comment } = req.body;
        if (!email || !status) return res.status(400).json({ error: "Missing fields" });

        const updateData = { status, updatedAt: new Date() };
        if (comment) updateData.feedback = comment;

        const project = await Project.findOneAndUpdate({ studentEmail: email }, updateData, { new: true });
        if (!project) return res.status(404).json({ error: "Project not found" });

        res.json({ message: "Updated", project });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// 4. DATA ROUTES
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
        project.status = "Pending Review";
        await project.save();
        res.json({ message: "Uploaded" });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// FORCE ADMIN RESET URL (Use this if you get stuck)
app.get('/api/fix-admin', async (req, res) => {
    await User.deleteOne({ email: "admin@cothm.edu.pk" });
    await User.create({
        firstName: "System", lastName: "Admin",
        email: "admin@cothm.edu.pk", password: "admin123", role: "supervisor",
        course: "Admin", batchNumber: "000"
    });
    res.send("Admin Reset. Login: admin@cothm.edu.pk / admin123");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));