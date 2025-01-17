const userModel = require('../models/user.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blackListTokenModel = require('../models/blacklistToken.model');
const captainModel = require('../models/Captain.model');


module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized0' });
    }


    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized1' });
    }

    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded._id)

        req.user = user;

        return next();

    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized2' });
    }
}

module.exports.authCaptain = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[ 1 ];

    console.log(token);

    // if (!token) {
    //     return res.status(401).json({ message: 'Unauthorized3' });
    // }

    const isBlacklisted = await blackListTokenModel.findOne({ token: token });

    console.log(isBlacklisted);

    if (isBlacklisted) {
        return res.status(401).json({ message: 'Unauthorized4' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const captain = await captainModel.findById(decoded._id)
        req.captain = captain;

        return next()
    } catch (err) {
        console.log(err);

        res.status(401).json({ message: 'Unauthorized5' });
    }
}