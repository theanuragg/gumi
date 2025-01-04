const CaptainModel = require("../models/Captain.model")
const captainService = require('../Services/captain.service')
const { validationResult } = require('express-validator')


module.exports.registerCaptain = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, fullname, password, vechile } = req.body;


    const iscaptainexists = await captainService.createCaptain.findOne({ email });

    if (iscaptainexists) {
        return res.status(400).json({ error: 'Captain already exists' });
    }

    const hashedPassword = await CaptainModel.hashpassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,  
        password: hashedPassword,
        vechile: {
            color: vechile.color,
            plate: vechile.plate,
            capacity: vechile.capacity,
            vehicleType: vechile.vehicleType,
            lat: vechile.lat,
            long: vechile.long
        }
    })

    const token = captain.generateAuthToken();

    res.status(201).json({ token });
}