import mongoose, { mongo } from 'mongoose'

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },

    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        index: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ['admin', 'user', 'owner'],
        default: 'user'
    },

    preferences: {
        theme: {type: String, enum: ['light', 'dark'], default: 'dark'},
        language: {type: String, default: 'en'},
        timezone: {type: String, default: 'AEST'} // App is AUS-based
    },

    lastLogin: {
        type: Date
    }
}, {timestamps: true})

export const User = mongoose.model('User', userSchema)