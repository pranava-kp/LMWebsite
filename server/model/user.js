const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        additionalDetails: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Profile",
        },
        accountType: {
            type: String,
            enum: ["Admin", "Staff", "HOD", "Principal"],
        },
        // image: {
        //     type: String,
        //     required: true,
        // },
        token: {
            type: String,
        },
        expiryTime: {
            type: Date,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("User", userSchema);
