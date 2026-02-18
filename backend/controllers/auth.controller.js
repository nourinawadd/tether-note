import 'dotenv/config.js'
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const signUp = async(req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();

        const existingUser = await User.findOne({ email: normalizedEmail });
        if(existingUser) {
            const error = new Error('User already exists with this email.');
            error.statusCode = 409;
            throw error;
        };

        const newUsers = await User.create([{ name, email: normalizedEmail, passwordHash: password }], { session });

        const token = jwt.sign({user: newUsers[0]._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        const userResponse = newUsers[0].toObject();
        delete userResponse.passwordHash;

        res.status(201).json({
            success: true,
            message: 'User created successfully!',
            data: {
                token,
                user: userResponse
            }
        });
    }
    catch(e) {
        await session.abortTransaction();
        session.endSession();
        next(e);
    }
};

export const signIn = async(req, res, next) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email?.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            const error = new Error('User does not exist, please sign up.');
            error.statusCode = 401;
            throw error;
        }

        const isMatch = await user.comparePassword(password);
        if(!isMatch) {
            const error = new Error('Invalid credentials, please try again.');
            error.statusCode = 401;
            throw error;
        };

        const token = jwt.sign({ user: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        res.status(200).json({
            success: true,
            message: 'User signed in successfully!',
            data: {
                token,
                user: userResponse
            }
        });
    }
    catch(e) {
        next(e);
    }
};

export const signOut = (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'User signed out successfully!'
    });
};