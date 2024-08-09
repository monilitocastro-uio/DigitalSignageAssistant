import jwt from 'jsonwebtoken';


export function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Bearer <token>

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.APP_SECRET); // Validate token
        req.user = decoded; // Attach user info to request object
        next(); // Move to the next middleware
    } catch (ex) {
        res.status(400).json({ message: 'Invalid token.' });
    }
}
 