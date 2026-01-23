import 'dotenv/config.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const authorize = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) {
            const error = new Error('No token provided, authorization denied.');
            error.statusCode = 401;
            throw error;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.user).select('-passwordHash');
        
        if(!user) {
            const error = new Error('User not found, authorization denied.');
            error.statusCode = 401;
            throw error;
        }

        req.user = user;
        next();
    }
    catch(e) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized!',
            error: e.message
        });
    }
}

export default authorize;