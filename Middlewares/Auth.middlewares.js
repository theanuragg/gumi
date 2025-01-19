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
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized3' });
        }

        let isBlacklisted;
        try {
            isBlacklisted = await blackListTokenModel.findOne({ token: token });
        } catch (dbError) {
            console.error("Error checking token blacklist:", dbError);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        console.log(isBlacklisted);

        if (isBlacklisted) {
            return res.status(401).json({ message: 'Unauthorized4' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let captain;
        try {
            captain = await captainModel.findById(decoded._id);
        } catch (dbError) {
            console.error("Error finding captain:", dbError);
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (!captain) {
            return res.status(404).json({ message: 'Captain not found' });
        }

        req.captain = captain;
        next();
    } catch (err) {
        console.error("Authorization Error:", err);
        return res.status(401).json({ message: 'Unauthorized5' });
    }
};
