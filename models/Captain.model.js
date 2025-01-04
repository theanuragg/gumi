const mongoose = require('mongoose');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname:{
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long']
        },
        lastname:{
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long']
        }
    },
    phoneno: {
        type: Number,
        required: true,
        minlength: [10, 'Phone number must be at least 10 characters long']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be at least 5 characters long'],
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
    status :{
        type: String,
        enum: ['online', 'offline'],
        default: 'offline'
    },
    vechile: {
        color:{
            type: String,
            required: true,
            minlength: [3, 'colour must be at least 3 characters long'],
        },
        plate:{
            type: String,
            required: true,
            minlength: [3, 'plate must be at least 3 characters long'],
        },
        capacity:{
           type: Number,
           required: true, 
           min: [1, 'capacity must be at least 1 person'],
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ['car', 'bike', 'auto']
        },
        location:{
            lat:{
                type: Number,
                required: true
            },
            long:{
                type: Number,
                required: true
            }
        }       
    }
});

captainSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

captainSchema.methods.comparePassword =async function (password){
    return await bcrypt.compare (password, this.password)               
}

captainSchema.statics.hashpassword = async function (password){
    return await bcrypt.hash(password, 10);
}

const CaptainModel = mongoose.model('Captain', captainSchema);


module.exports = CaptainModel;