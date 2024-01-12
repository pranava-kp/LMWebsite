const mongoose = require("mongoose");
const fileSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    publicId:{
        type: String,
        default: null
    },
    url: {
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
});
module.exports = mongoose.model("File", fileSchema);
