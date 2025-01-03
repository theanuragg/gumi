const userModel = require('../models/user.models');
const userService = require('../Services/user.service')
const { validationResult } = require('express-validator');

module.exports.registerUser = async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword
    });

    const token = user.generateAuthToken();

    res.status(201).json({ token, user });


}

module.exports.loginUser = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    const {email, password} = req.body;

    
    const user = await userModel.findOne({email}).select('+password')


    if (!user){
        return res.status(404).json({message: 'User not found'})
    }

    const isMatch = await user.comparePassword(password)

    if (!isMatch){
        return res.status(401).json({message: 'Invalid credentials'})
    }


    const token = user.generateAuthToken();

    res.status(200).json({token, user})
}
