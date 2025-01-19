const CaptainModel = require("../models/Captain.model")
const captainService = require('../Services/captain.service')
const { validationResult } = require('express-validator')
const blacklistTokenModel = require('../models/blacklistToken.model')

module.exports.registerCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, username, password, phoneno, adharno, location } = req.body;

        const isCaptainExists = await CaptainModel.findOne({ email });

        if (isCaptainExists) {
            return res.status(400).json({ error: 'Captain already exists' });
        }

        const hashedPassword = await CaptainModel.hashpassword(password);

        const captain = await captainService.createCaptain({
            username,
            email,
            password: hashedPassword,
            phoneno,
            adharno,
            location
        })

        const token = captain.generateAuthToken();

        // Set cookie with token
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({ token, captain });
    } catch (error) {
        next(error);
    }
}


module.exports.loginCaptain = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const captain = await CaptainModel.findOne({ email }).select('+password');

        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        const isMatch = await captain.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = captain.generateAuthToken();

        res.cookie('token', token); // Save token as a cookie

        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
}


module.exports.logoutCaptain = async (req, res, next) => {

    const token = req.cookies.token || req.header.authorization.split(' ')[1];

    await blacklistTokenModel.create({ token });

    res.clearCookie('token');

    res.status(200).json({ message: 'Captain logged out' })
}



module.exports.getCaptainsByLocation = async (req, res, next) => {
    const { location } = req.query;

    try {
        const captains = await CaptainModel.find({ location });
        res.status(200).json(captains || []);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "server error" });
    }
}

module.exports.getCaptainProfile = async (req, res, next) => {
    try {
        // req.captain is already set by the authCaptain middleware
        res.status(200).json(req.captain);
    } catch (error) {
        next(error);
    }
}
