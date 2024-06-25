const express = require("express");
const router = express.Router();

const { handleGetLogin, handleGetSignup, handlePostLogin, verifyOtp, checkEmail, checkUsername, submitSignupForm } = require("../controllers/auth");

router.get("/login", handleGetLogin);
router.get("/signup", handleGetSignup);

router.post("/login", handlePostLogin);

router.get('/check-username', checkUsername);
router.get('/check-email', checkEmail);
router.post('/submit-form', submitSignupForm);
router.post('/verify-otp', verifyOtp);

module.exports = router;
