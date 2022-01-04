const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth_controller');

const middleware = require('../middlewares/auth');

// Auth routes 
// This endpoints is for the Overall Auth system


//send Otp
router.post('/sendAuthOtp', authController.sendAuthOtp);


// refresh token

router.get('/refreshToken', middleware.refresh);

// refresh token using post method.
router.post('/refreshToken', middleware.refresh);

// verify otp
router.post('/VerifyAuthOtp', authController.verifyAuthOtp);

router.post('/savePassword', authController.savePassword);

router.post('/login', authController.login);

// user profile 
router.get("/getProfile", middleware.verify, authController.getUser);

router.get("/notifications", middleware.verify, authController.notifications);

// app pin
router.put("/changeAppPin", middleware.verify, authController.changeAppPin);

// create transactioPin
router.put("/createTransactionPin", middleware.verify, authController.createTransactionPin);

router.put('/addUser', middleware.verify, authController.addUser);

// POST method route
module.exports = router;