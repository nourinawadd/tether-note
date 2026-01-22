import 'dotenv/config.js'
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const signUp = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if(existingUser) {
            const error = new Error('User already exists with this email.');
            error.status = 409;
            throw error;
        };

        const newUsers = await User.create([{ name, email, passwordHash: password }], { session });

        const token = jwt.sign({userId: newUsers[0]._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            data: {
                token,
                user: newUsers[0]
            }
        });
    }
    catch(e) {
        await session.abortTransaction();
        session.endSession();
        next(e);
    }
}