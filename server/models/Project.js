const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    studentEmail: { type: String, required: true },
    studentName: String,
    regNumber: String,
    program: String,
    submissions: [
        {
            stage: String,
            fileUrl: String,
            submittedAt: { type: Date, default: Date.now }
        }
    ],
    currentStage: { type: String, default: 'Proposal' },
    status: { type: String, default: 'Pending Review' }
});

module.exports = mongoose.model('Project', ProjectSchema);
