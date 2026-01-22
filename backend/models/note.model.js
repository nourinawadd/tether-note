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
                return value > new Date();
            },
            message: 'Date to unlock the note must be in the future'
        }
    },

    reminderAt: {
        type: Date,
        required: false,
        default: function() {
            return new Date(this.openAt.getTime() - 24 * 60 * 60 * 1000);
        }, // Default to 24 hours before openAt
        validate: {
            validator: function(value) {
                return value < this.openAt;
            },
            message: 'Reminder date must be before the open date'
        }
    },

    userId: {

        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, { timestamps: true });

const Note = mongoose.model('Note', noteSchema);

export default Note;