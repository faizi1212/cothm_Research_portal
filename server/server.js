require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcryptjs'); // Needed for password hashing

const app = express();

// 1. ALLOW REQUESTS FROM ANYWHERE (Crucial for Remote Access)
app.use(cors({ 
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})); 
app.use(express.json());

// 2. CONFIGURE CLOUDINARY
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. SETUP STORAGE ENGINE (Fixed for PDF/Docs)
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "thesis-portal",
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "docx", "doc"],
    resource_type: "auto", // <--- CRITICAL FIX for PDFs
  },
});

const upload = multer({ storage: storage });

// DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected"))
    .catch(err => console.error("❌ DB Error:", err));

// --- MODELS ---

// User Schema (UPDATED with RegNumber & Batch)
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "student" }, // "student" or "admin"
    regNumber: String, // <--- Added
    batch: String,     // <--- Added
    program: String    // <--- Added
});
const User = mongoose.model('User', UserSchema);

// Project Schema
const ProjectSchema = new mongoose.Schema({
    studentName: String,
    studentEmail: String,
    regNumber: String,  // <--- Added to Project for easy Admin view
    batch: String,      // <--- Added
    program: String,    // <--- Added
    submissions: [{
        fileUrl: String,
        submittedAt: { type: Date, default: Date.now }
    }],
    status: { type: String, default: "Pending Review" }, // Approved, Rejected, Pending
});
const Project = mongoose.model('Project', ProjectSchema);


// --- ROUTES ---

app.get('/', (req, res) => res.send("✅ COTHM Cloud Server is Online"));

// 1. REGISTER ROUTE (Saves Reg Number & Batch)
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, regNumber, batch, program } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ error: "User already exists" });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Save new user with ALL details
        user = new User({ 
            name, 
            email, 
            password: hashedPassword,
            regNumber, 
            batch, 
            program 
        });
        
        await user.save();
        res.json({ message: "Registration Successful" });

    } catch (err) {
        console.error("Register Error:", err);
        res.status(500).json({ error: "Server error" });
    }
});

// 2. LOGIN ROUTE
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check for Admin hardcoded login
        if(email === "admin@cothm.edu.pk" && password === "admin123") {
            return res.json({ 
                user: { name: "Administrator", email, role: "admin" },
                message: "Admin Login Success"
            });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid password" });

        // Return user info (including Reg Number) to Frontend
        res.json({ 
            user: { 
                name: user.name, 
                email: user.email, 
                role: user.role,
                regNumber: user.regNumber,
                batch: user.batch,
                program: user.program
            },
            message: "Login Success" 
        });

    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// 3. STUDENT UPLOAD ROUTE (Saves File + Updates Project)
app.post('/api/user/upload', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const { email, studentName, regNumber } = req.body;
        const fileUrl = req.file.path; // Cloudinary URL

        // Find or Create Project
        let project = await Project.findOne({ studentEmail: email });
        
        // If project doesn't exist, create it and pull details from User DB if needed
        if (!project) {
            const userDetails = await User.findOne({ email });
            project = new Project({
                studentEmail: email,
                studentName: studentName,
                // Use regNumber from request OR fetch from DB
                regNumber: regNumber || (userDetails ? userDetails.regNumber : "N/A"),
                batch: userDetails ? userDetails.batch : "N/A",
                program: userDetails ? userDetails.program : "N/A",
                submissions: [],
                status: "Pending Review"
            });
        }

        // Add new submission
        project.submissions.push({ fileUrl });
        project.status = "Pending Review"; // Reset status on new upload
        
        await project.save();
        res.json({ message: "Upload Successful", fileUrl });

    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// 4. STUDENT: GET MY PROJECT STATUS
app.get('/api/user/my-project', async (req, res) => {
    try {
        const { email } = req.query;
        const project = await Project.findOne({ studentEmail: email });
        res.json(project || null);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// 5. ADMIN: GET ALL PROJECTS
app.get('/api/admin/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

// 6. ADMIN: UPDATE STATUS (Approve/Reject)
app.post('/api/admin/update', async (req, res) => {
    try {
        const { email, status } = req.body;
        await Project.findOneAndUpdate(
            { studentEmail: email }, 
            { status: status }
        );
        res.json({ message: "Status Updated" });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));