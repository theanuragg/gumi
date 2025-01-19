const captainController = require('../Controllers/captain.controller');
const express = require('express');
const router = express.Router();
const { body } = require("express-validator");
const authMiddleware = require('../Middlewares/Auth.middlewares');

router.post('/register', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('username').isLength({ min: 3 }).withMessage('First name must be at least 3 characters long'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('phoneno').isLength({ min: 10 }).withMessage('Phone number must be at least 10 characters long'),
    body('adharno').isLength({ min: 3 }).withMessage('Adhar number must be at least 3 characters long'),
    body('location').isLength({ min: 3 }).withMessage('location must be at least 3 characters long')
], async (req, res, next) => {
    try {
        await captainController.registerCaptain(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/login', [
    body('email').isEmail().withMessage('Invalid Email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
    captainController.loginCaptain
);

router.get('/profile', authMiddleware.authCaptain, captainController.getCaptainProfile);

router.post('/logout', authMiddleware.authCaptain, captainController.logoutCaptain);


router.get('/ride', authMiddleware.authCaptain, captainController.getCaptainsByLocation);

module.exports = router;