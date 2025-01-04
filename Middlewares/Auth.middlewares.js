const userModel = require('../models/user.models');
const brcypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split('')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' })
    }


    const isblacklisted = await userModel.findOne({token: token});
    if (isblacklisted) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id);

        req.user = user;
        return next();
    }
    catch (err) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}