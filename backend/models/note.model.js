import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        default: 'Untitled Note',
        trim: true,
    },

    content: {
        type: String,
        required: [true, 'Note content cannot be empty'],
        trim: true,
    },

    status: {
        type: String,
        enum: ['pending', 'opened', 'deleted'],
        default: 'pending'
    },

    openAt: {
        type: Date,
        required: [true, 'Date to unlock the note is required'],
        validate: {
            validator: function(value) {
                if (!this.isNew) return true;
                return value instanceof Date && value.getTime() > Date.now();
            },
            message: 'Date to unlock the note must be in the future'
        }
    },
    openedAt: {
        type: Date,
        default: null
    },

    reminderAt: {
        type: Date,
        required: false,
        set: function(value) {
            return value === '' || value === null ? undefined : value;
        },
        default: function() {
            if (!this.openAt) {
                return undefined;
            }
            return reminder.getTime() > Date.now() ? reminder : undefined;
        }, // Default to 24 hours before openAt

        validate: {
            validator: function(value) {
                if (!value) return true;

                if (!this.openAt) {
                    return false;
                }

                if (value >= this.openAt) {
                    return false;
                }

                if (this.isNew) {
                    return value.getTime() > Date.now();
                }

                return true;
            },
            message: 'Reminder date must be before the open date'
        }
    },

    userId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    unlockEmailSent: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

noteSchema.index({ reminderAt: 1, status: 1 });
noteSchema.index({ openAt: 1, status: 1 });

const Note = mongoose.model('Note', noteSchema);

export default Note;