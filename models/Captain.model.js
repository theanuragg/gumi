const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: [3, 'First name must be at least 3 characters long']
        
    },
    phoneno: {
        type: String,
        required: true,
        minlength: [10, 'Phone number must be at least 10 characters long']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    socketId: {
        type: String,
    },
    adharno: {
        type: String,   
        required: true,
        minlength: [3  , 'Adharno must be at least 3characters long']
    },
    phoneno: {      
        type: String,
        required: true,
        minlength: [10, 'Phone number must be at least 10 characters long']        
    },
    location: {
        type: String,
        required: true,
    }
    
});

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '100h' });
    return token;
}

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashpassword = async function (password) {
    return await bcrypt.hash(password, 10);
}

const CaptainModel = mongoose.model('Captain', captainSchema);

module.exports = CaptainModel;