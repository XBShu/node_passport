const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    apellidos: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    access: {
        type: Boolean,
        default: false,
    }
})

const User = mongoose.model('User',UserSchema);

module.exports = User;