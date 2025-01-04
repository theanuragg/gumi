const express = require('express'); 
const router = express.Router();
const { body } = require("express-validator")
const captainController = require('../Controllers/captain.controller') 


router.post ('/register',[
    body('email').isEmail().withMessage('Invalid Email'),
    body('fullname.firstname').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('vechile.color').isLength({ min: 3 }).withMessage('colour must be at least 3 characters long'),
    body('vechile.plate').isLength({ min: 3 }).withMessage('plate must be at least 3 characters long'),         
    body('vechile.capacity').isLength({ min: 1 }).withMessage('capacity must be at least 1 person'),
    body('vechile.vehicleType').isLength({ min: 3 }).withMessage('vehicleType must be at least 3 characters long'),
],
    captainController.registerCaptain     
)


module.exports =router; 

