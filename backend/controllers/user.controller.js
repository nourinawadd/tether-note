import User from '../models/user.model.js';

export const getUser = async (req, res, next) => {
    try {
        const user = req.user;
        
        if(!user) {
            const error = new Error('User not found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch(e) {
        next(e);
    }
}