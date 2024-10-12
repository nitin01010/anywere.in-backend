const twilio = require("twilio");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");

const accountSid = process.env.AccountSID;
const authToken = process.env.AuthToken;

const client = twilio(accountSid, authToken);

// Function to generate a secure random 4-digit OTP
function generateOTP(length = 4) {
    return crypto.randomInt(0, Math.pow(10, length)).toString().padStart(length, '0');
}

// In-memory store for OTPs
const otpStore = {};

// Function to handle user signup and send OTP
function signupControllers(req, res) {
    const { phoneNumber } = req.body;

    // Basic validation for phone number
    if (!phoneNumber || typeof phoneNumber !== "string") {
        return res.status(400).json({ message: 'Invalid phone number.' });
    }

    const otp = generateOTP(); // Generate OTP
    otpStore[phoneNumber] = { otp, createdAt: Date.now() }; // Store OTP with timestamp

    // Send the OTP via Twilio
    client.messages
        .create({
            body: `Thank you for signing up! Your verification code is ${otp}`,
            from: '+17542276685', // Your Twilio phone number
            to: `+91${phoneNumber}` // User's phone number
        })
        .then(message => {
            console.log(`Message sent with SID: ${message.sid}`);
            return res.json({ message: 'Verification message sent successfully!' });
        })
        .catch(error => {
            console.error(`Error sending message: ${error.message}`);
            return res.status(500).json({ message: 'Failed to send verification message.', error });
        });
}

// Function to verify OTP
function verifyOTP(req, res) {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required.' });
    }

    const storedData = otpStore[phoneNumber];

    if (!storedData) {
        return res.status(400).json({ message: 'No OTP found for this phone number.' });
    }

    const { otp: storedOTP, createdAt } = storedData;
    const OTP_VALIDITY_DURATION = 5 * 60 * 1000; // 5 minutes

    if (storedOTP === otp && (Date.now() - createdAt) < OTP_VALIDITY_DURATION) {
        delete otpStore[phoneNumber]; // Clear OTP after verification
        const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: 'OTP verified successfully!', token });
    } else {
        return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
}

module.exports = {
    signupControllers,
    verifyOTP
};
