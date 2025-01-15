const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: no token' });
    }

    try {
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user data to the request object
        next();
    } catch (e) {
        return res.status(403).json({ message: 'Forbidden: invalid token' });
    }
};

module.exports = authenticate;