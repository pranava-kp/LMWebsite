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
            default: "Staff",
        },
        // image: {
        //     type: String,
        //     required: true,
        // },
        hiringDate:{
            type: Date,
            default: Date.now,
        },
        department:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
        },
        token: {
            type: String,
        },
        expiryTime: {
            type: Date,
        },
        phone: {
            type: String,
            default: null
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other","Prefer not to say"],
            default: null
        },
        employeeId: {
            type: String,
            default: null
        },
      // ---  LEAVE BALANCE TRACKER  ---
        leaveBalances: {
            casualLeave: {
                takenThisYear: { type: Number, default: 0 }, 
            },
            earnedLeave: {
                balance: { type: Number, default: 10 }, // Starts with 10, carries forward
                takenThisYear: { type: Number, default: 0 }
            },
            maternityLeave: {
                takenInDays: { type: Number, default: 0 }, 
                isApprovedByOfficer: { type: Boolean, default: false }
            },
            restrictedHoliday: {
                takenThisYear: { type: Number, default: 0 }
            }
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);