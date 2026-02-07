console.log("🚀 STARTING SERVER WITH BREVO EMAIL...");

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

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

// --- EMAIL TRANSPORTER (BREVO) ---
const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_EMAIL,  // Your Brevo login email
        pass: process.env.BREVO_API_KEY  // Your Brevo API key (starts with xkeysib-)
    }
});

// Verify Email Connection
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ Brevo Email Connection Failed:", error);
    } else {
        console.log("✅ Email Server Ready (Brevo)");
    }
});

// --- MODELS ---
const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    course: { type: String, default: "N/A" },
    batchNumber: { type: String, default: "N/A" },
    role: { type: String, enum: ["student", "supervisor", "admin"], default: "student" },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
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

// FORGOT PASSWORD
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        console.log("📧 Forgot password request:", req.body);
        
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "No account found with this email" });
        }

        // Generate Token
        const token = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        console.log("🔑 Token generated for:", email);

        // Create Reset Link
        const resetUrl = `${process.env.FRONTEND_URL || 'https://cothm-research-portal.vercel.app'}/reset-password/${token}`;

        const mailOptions = {
            from: `"COTHM Research Portal" <${process.env.BREVO_EMAIL}>`,
            to: email,
            subject: 'COTHM Research Portal - Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #667eea;">Password Reset Request</h2>
                    <p>Hello ${user.firstName},</p>
                    <p>You requested a password reset for your COTHM Research Portal account.</p>
                    <p>Click the button below to reset your password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
                    </div>
                    <p style="color: #666; font-size: 14px;">Or copy and paste this link in your browser:</p>
                    <p style="color: #667eea; word-break: break-all;">${resetUrl}</p>
                    <p style="color: #999; font-size: 13px; margin-top: 30px;">This link will expire in 1 hour.</p>
                    <p style="color: #999; font-size: 13px;">If you did not request this password reset, please ignore this email.</p>
                </div>
            `
        };

        console.log("📤 Attempting to send email to:", email);

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error("❌ Email Send Error:", err);
                return res.status(500).json({ 
                    message: "Failed to send email. Please try again later.",
                    error: err.message 
                });
            }
            console.log("✅ Email sent successfully:", info.messageId);
            res.json({ message: "Password reset link sent to your email" });
        });

    } catch (err) {
        console.error("❌ Forgot Password Error:", err);
        res.status(500).json({ message: "Server error: " + err.message });
    }
});

// RESET PASSWORD
app.post('/api/auth/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: "Password reset token is invalid or has expired" });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        
        console.log("✅ Password reset successful for:", user.email);
        res.json({ message: "Password has been reset successfully" });

    } catch (err) {
        console.error("❌ Reset Password Error:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// LOGIN
const handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(`🔐 Login Attempt: ${email}`);

        // Master Admin
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

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(404).json({ message: "User not found" });

        let isMatch = false;
        if (user.password === password) {
            isMatch = true;
        } else {
            isMatch = await bcrypt.compare(password, user.password);
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
app.post('/api/login', handleLogin);

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
        res.status(200).json({ message: "Account created successfully" });
    } catch (err) { 
        console.error("❌ Register Error:", err);
        res.status(500).json({ message: err.message }); 
    }
});

// ADMIN UPDATE
app.post('/api/admin/update', async (req, res) => {
    try {
        const { email, status, comment } = req.body;
        console.log(`📝 Admin Update: ${email} -> ${status}`);

        if (!email || !status) return res.status(400).json({ error: "Email and status required" });

        const updateData = { status, updatedAt: new Date() };
        if (comment) updateData.feedback = comment;

        const project = await Project.findOneAndUpdate(
            { studentEmail: email.toLowerCase() }, 
            updateData, 
            { new: true }
        );
        
        if (!project) return res.status(404).json({ error: "Project not found" });
        res.json({ message: "Project updated successfully", project });
    } catch (err) { 
        console.error("❌ Admin Update Error:", err);
        res.status(500).json({ error: err.message }); 
    }
});

// DATA ROUTES
app.get('/api/projects/all', async (req, res) => {
    const projects = await Project.find().sort({ updatedAt: -1 });
    res.json(projects);
});

app.get('/api/projects/my-projects', async (req, res) => {
    const p = await Project.findOne({ studentEmail: req.query.email?.toLowerCase() });
    res.json(p ? [p] : []);
});

app.post('/api/submit', upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });
        
        const { studentEmail, studentName, stage, course, batchNumber } = req.body;
        let project = await Project.findOne({ studentEmail: studentEmail.toLowerCase() });
        
        if (!project) {
            project = new Project({ 
                studentEmail: studentEmail.toLowerCase(), 
                studentName, 
                course, 
                batchNumber 
            });
        }
        
        project.submissions.push({ 
            stage, 
            fileName: req.file.originalname, 
            fileUrl: req.file.path, 
            date: new Date() 
        });
        project.status = "Pending Review";
        await project.save();
        
        console.log("✅ File uploaded:", stage, "by", studentEmail);
        res.json({ message: "File uploaded successfully" });
    } catch (err) { 
        console.error("❌ Submit Error:", err);
        res.status(500).json({ error: err.message }); 
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));