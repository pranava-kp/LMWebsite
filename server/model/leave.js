const mongoose = require("mongoose");

const leaveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: String,
        enum: ["Casual Leave", "Earned Leave", "Maternity Leave", "Restricted Holiday"],
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: [
            "Awaiting HOD Approval",
            "Awaiting Principal Approval",
            "Approved",
            "Rejected by HOD",
            "Rejected by Principal"
        ],
        default: "Awaiting HOD Approval",
    },
    startDate:{
        type: Date,
        required: true,
    },
    endDate:{
        type: Date,
        required: true,
    },
    substituteTeachers: {
        type: mongoose.Schema.Types.Mixed, 
        required: true,
    },
    documentUrl: {
        type: String, // Stores the Cloudinary secure_url
        default: "",
    },
    comments: [
        {
            role: { type: String },       // "HOD" or "Principal"
            name: { type: String },       // "John Doe"
            action: { type: String },     // "Approved" or "Rejected"
            commentText: { type: String },
            timestamp: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

// Assuming you export it at the bottom like this
module.exports = mongoose.model("Leave", leaveSchema);