require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcrypt'); // Added for password hashing

const app = express();
const PORT = process.env.PORT || 5000;

// 1. LOGGING MIDDLEWARE
app.use((req, res, next) => {
    console.log(`➡️  Received Request: ${req.method} ${req.url}`);
    next();
});

// CORS (Allow Frontend to talk to Backend)
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. DATABASE CONNECTION
console.log("⏳ Attempting to connect to MongoDB...");
if (!process.env.MONGO_URI) {
    console.error("❌ FATAL ERROR: MONGO_URI is missing!");
    process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected Successfully!"))
    .catch(err => console.error("❌ MongoDB Connection Failed:", err.message));

// CLOUDINARY CONFIG
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

// ================= MODELS ================= //

// Updated User Schema (Matches Frontend Fields)
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    
    // NEW FIELDS (Hospitality & Batch)
    course: { type: String, default: "N/A" },      // e.g. GDICA, DHTML
    batchNumber: { type: String, default: "N/A" }, // e.g. 22
    
    role: { type: String, enum: ["student", "supervisor", "admin"], default: "student" },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

// Updated Project Schema
const ProjectSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    studentName: { type: String, required: true },
    
    // Store these so Supervisors can see them easily
    course: { type: String, default: "N/A" },
    batchNumber: { type: String, default: "N/A" },

    status: { type: String, default: 'Pending Review' }, 
    submissions: [Object],
    comments: [Object],
    updatedAt: { type: Date, default: Date.now }
});
const Project = mongoose.model('Project', ProjectSchema);


// ================= ROUTES ================= //

// 1. REGISTER ROUTE (Matches /api/auth/register)
app.post('/api/auth/register', async (req, res) => {
    console.log("📝 Registering:", req.body.email);
    try {
        const { firstName, lastName, email, password, course, batchNumber } = req.body;

        // Check duplicate
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "Email already exists" });

        // Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create User
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            course: course || "N/A",
            batchNumber: batchNumber || "N/A",
            role: "student"
        });

        await newUser.save();
        console.log("✅ User Created Successfully!");
        res.status(200).json({ message: "User registered successfully!" });

    } catch (err) {
        console.error("❌ Register Error:", err);
        res.status(500).json({ message: "Server Error: " + err.message });
    }
});

// 2. LOGIN ROUTE (Matches /api/auth/login OR /login for safety)
// We add both paths just in case your frontend Login.js uses the old one.
const loginHandler = async (req, res) => {
    console.log(`🔐 Login Attempt: ${req.body.email}`);
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: "User not found" });

        // Compare Hashed Password
        const validPass = await bcrypt.compare(req.body.password, user.password);
        // Fallback for old plain text admin passwords (optional safety)
        const isMatch = validPass || user.password === req.body.password; 

        if (!isMatch) return res.status(400).json({ message: "Invalid Credentials" });

        console.log("🚀 Login Success:", user.email);
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
        res.status(500).json({ message: err.message });
    }
};

app.post('/api/auth/login', loginHandler); // New Standard Path
app.post('/login', loginHandler);          // Old Path (Backup)


// 3. FILE UPLOAD ROUTE
app.post('/api/submit', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        
        const { studentEmail, studentName, stage, course, batchNumber } = req.body;
        
        let project = await Project.findOne({ studentEmail });
        
        // If first upload, create project
        if (!project) {
            project = new Project({ 
                studentEmail, 
                studentName, 
                course: course || "N/A", 
                batchNumber: batchNumber || "N/A" 
            });
        }
        
        // Add submission
        project.submissions.push({ 
            stage, 
            fileName: req.file.originalname, 
            fileUrl: req.file.path, 
            date: new Date() 
        });
        project.status = 'Pending Review';
        
        await project.save();
        res.json({ message: "Thesis Uploaded Successfully!" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. ADMIN / SUPERVISOR ROUTES
app.get('/api/admin/projects', async (req, res) => {
    // Return all projects, sorted by newest
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.json(projects);
});

// 5. FETCH USER STATUS (For Dashboard)
app.get('/api/projects/my-projects', async (req, res) => {
    const p = await Project.findOne({ studentEmail: req.query.email });
    // Return array format for frontend map() compatibility
    res.json(p ? [p] : []); 
});

// 6. EMERGENCY FIX ADMIN
app.get('/api/fix-admin', async (req, res) => {
    try {
        await User.deleteOne({ email: "admin@cothm.edu.pk" });
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash("admin123", salt);
        
        await User.create({
            firstName: "System", lastName: "Admin",
            email: "admin@cothm.edu.pk", password: hash,
            role: "admin", course: "Admin", batchNumber: "000"
        });
        res.send("✅ Admin Reset. Login with admin@cothm.edu.pk / admin123");
    } catch(e) { res.send(e.message); }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));