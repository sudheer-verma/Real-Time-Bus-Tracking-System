const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },

        licenseNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        licenseExpiry: {
            type: Date,
            required: true
        },

        experienceYears: {
            type: Number,
            default: 0,
            min: 0
        },

        assignedBus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
            default: null
        },

        assignedRoute: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route",
            default: null
        },

        isAvailable: {
            type: Boolean,
            default: true
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Driver", driverSchema);