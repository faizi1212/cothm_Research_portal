require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// IMPORT MODELS
const User = require('./models/User'); 
const Project = require('./models/Project'); 

const app = express();

// 1. ALLOW REQUESTS FROM ANYWHERE (Crucial for Remote Access)
app.use(cors({ 
    origin: true, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
})); 
app.use(express.json());

// 2. CONFIGURE CLOUDINARY (Using your .env keys)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. SETUP STORAGE ENGINE
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'thesis-portal', // This folder will appear in your Cloudinary Dashboard
        allowed_formats: ['pdf', 'doc', 'docx'],
        resource_type: 'auto'
    }
});

const upload = multer({ storage: storage });

// DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB Atlas Connected"))
    .catch(err => console.error("❌ DB Error:", err));

// --- ROUTES ---

app.get('/', (req, res) => res.send("✅ COTHM Cloud Server is Online"));

// REGISTER
app.post('/api/register', async (req, res) => {
    try {
        const { email, firstName, lastName, regNumber, program } = req.body;
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User exists" });
        user = new User({ email, firstName, lastName, regNumber, program });
        await user.save();
        res.json({ msg: "Success" });
    } catch (err) { res.status(500).send("Server Error"); }
});

// SUBMIT (Saves to Cloudinary)
app.post('/api/submit', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        // Cloudinary returns a secure HTTPs link automatically
        const fileUrl = req.file.path; 
        console.log("✅ File Uploaded to Cloud:", fileUrl);

        const { studentEmail, studentName, stage } = req.body;

        let project = await Project.findOne({ studentEmail });
        if (!project) {
            const studentDetails = await User.findOne({ email: studentEmail });
            project = new Project({ 
                studentEmail, 
                studentName,
                regNumber: studentDetails ? studentDetails.regNumber : "N/A",
                program: studentDetails ? studentDetails.program : "N/A"
            });
        }
        
        project.submissions.push({ stage, fileUrl });
        project.currentStage = stage;
        project.status = 'Pending Review';
        
        await project.save();
        res.json({ message: "Upload Successful", fileUrl });
        
    } catch (err) {
        console.error("Upload Error:", err);
        res.status(500).json({ error: "Server Error" });
    }
});

// STATUS & PROFILE
app.get('/api/status/:email', async (req, res) => {
    const project = await Project.findOne({ studentEmail: req.params.email });
    res.json(project || { status: "Not Started", currentStage: "None" });
});

app.get('/api/profile/:email', async (req, res) => {
    const user = await User.findOne({ email: req.params.email });
    res.json(user || {});
});

// ADMIN
app.get('/api/admin/projects', async (req, res) => {
    const projects = await Project.find();
    res.json(projects);
});

app.post('/api/admin/update', async (req, res) => {
    await Project.findOneAndUpdate({ studentEmail: req.body.email }, { status: req.body.status });
    res.json({ message: "Updated" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));