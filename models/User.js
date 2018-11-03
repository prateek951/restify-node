const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email : {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required:true
    }
});

const User = mongoose.model("User",UserSchema);
module.exports = User;