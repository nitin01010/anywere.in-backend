const jwt = require('jsonwebtoken');

const tokenVerifyControllers = async (req, res) => {
    const token = req.headers['authorization'];

    // Check if the token is provided
    if (!token) {
        return res.status(401).json({ valid: false, message: 'No token provided.' });
    }

    try {
        // Verify the token (make sure to use your secret key)
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Adjust with your secret

        // If the token is valid, return a success message
        return res.json({ valid: true, user: decoded });
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ valid: false, message: 'Invalid token.' });
    }
};

module.exports = { tokenVerifyControllers };
