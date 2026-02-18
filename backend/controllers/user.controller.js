import User from '../models/user.model.js';

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export const getUser = async (req, res, next) => {
    try {
        const user = req.user;

        if (!user) {
            const error = new Error('User not found!');
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({
            success: true,
            data: user
        });
    }
    catch (e) {
        next(e);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const { name, email, currentPassword, newPassword, confirmNewPassword } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            const error = new Error('User not found!');
            error.statusCode = 404;
            throw error;
        }

        const normalizedName = typeof name === 'string' ? name.trim() : undefined;
        const normalizedEmail = typeof email === 'string' ? email.trim().toLowerCase() : undefined;

        const wantsNameChange = normalizedName !== undefined && normalizedName !== user.name;
        const wantsEmailChange = normalizedEmail !== undefined && normalizedEmail !== user.email;
        const wantsPasswordChange = Boolean(newPassword || confirmNewPassword);

        if (!wantsNameChange && !wantsEmailChange && !wantsPasswordChange) {
            const error = new Error('No profile changes were provided.');
            error.statusCode = 400;
            throw error;
        }

        if (wantsNameChange) {
            if (normalizedName.length < 2 || normalizedName.length > 50) {
                const error = new Error('Name must be between 2 and 50 characters.');
                error.statusCode = 400;
                throw error;
            }
            user.name = normalizedName;
        }

        if (wantsEmailChange || wantsPasswordChange) {
            if (!currentPassword) {
                const error = new Error('Current password is required to update email or password.');
                error.statusCode = 400;
                throw error;
            }

            const isCurrentPasswordValid = await user.comparePassword(currentPassword);
            if (!isCurrentPasswordValid) {
                const error = new Error('Current password is incorrect.');
                error.statusCode = 401;
                throw error;
            }
        }

        if (wantsEmailChange) {
            if (!EMAIL_REGEX.test(normalizedEmail)) {
                const error = new Error('Please use a valid email address.');
                error.statusCode = 400;
                throw error;
            }

            const existingUser = await User.findOne({ email: normalizedEmail, _id: { $ne: user._id } });
            if (existingUser) {
                const error = new Error('Another account already uses this email.');
                error.statusCode = 409;
                throw error;
            }

            user.email = normalizedEmail;
        }

        if (wantsPasswordChange) {
            if (!newPassword || !confirmNewPassword) {
                const error = new Error('Both new password fields are required.');
                error.statusCode = 400;
                throw error;
            }

            if (newPassword !== confirmNewPassword) {
                const error = new Error('New password and confirmation do not match.');
                error.statusCode = 400;
                throw error;
            }

            if (!PASSWORD_REGEX.test(newPassword)) {
                const error = new Error('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
                error.statusCode = 400;
                throw error;
            }

            const isSamePassword = await user.comparePassword(newPassword);
            if (isSamePassword) {
                const error = new Error('New password must be different from your current password.');
                error.statusCode = 400;
                throw error;
            }

            user.passwordHash = newPassword;
        }

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.passwordHash;

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully!',
            data: userResponse
        });
    }
    catch (e) {
        next(e);
    }
};
