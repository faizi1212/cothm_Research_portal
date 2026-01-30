const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    firstName: String,
    lastName: String,
    regNumber: String,
    program: String,
    joinedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);