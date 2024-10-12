const express = require("express");
const router = express.Router();

const { signupControllers, verifyOTP } = require("../controllers/signupControllers");

router.post("/signup", signupControllers);

router.post("/signup/verify-otp", verifyOTP);


module.exports = router;