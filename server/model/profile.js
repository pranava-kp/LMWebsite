const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
    dateOfBirth:{
        type: Date,
        default: null
    },
    phoneNumber:{
        type: Number,
        trim: true,
    },
    gender:{
        type: String,
        enum: ["Male", "Female"],
        default: null
    },
    department:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
    },
})

module.exports = mongoose.model("Profile", profileSchema);