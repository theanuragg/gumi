const mongoose = require('mongoose');
const UserModel = require('../models/user.models');
const CaptainModel = require('../models/Captain.model');
require('dotenv').config();

const demoUser = {
    username: "Demo User",
    email: "demo@user.com",
    password: "password123"
};

const demoCaptain = {
    username: "Demo Captain",
    email: "demo@captain.com",
    password: "password123",
    phoneno: "1234567890",
    adharno: "123456789012",
    location: "Mumbai"
};

async function seedDemo() {
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        
        // Clear existing demo accounts
        await UserModel.deleteOne({ email: demoUser.email });
        await CaptainModel.deleteOne({ email: demoCaptain.email });

        // Create new demo user
        const hashedUserPassword = await UserModel.hashPassword(demoUser.password);
        await UserModel.create({
            ...demoUser,
            password: hashedUserPassword
        });

        // Create new demo captain
        const hashedCaptainPassword = await CaptainModel.hashpassword(demoCaptain.password);
        await CaptainModel.create({
            ...demoCaptain,
            password: hashedCaptainPassword
        });

        console.log('Demo credentials created successfully!');
        console.log('Demo User:', { email: demoUser.email, password: demoUser.password });
        console.log('Demo Captain:', { email: demoCaptain.email, password: demoCaptain.password });

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error seeding demo data:', error);
        process.exit(1);
    }
}

seedDemo();
