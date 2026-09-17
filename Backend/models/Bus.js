const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
    {
        busNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        registrationNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        capacity: {
            type: Number,
            required: true,
            min: 1
        },

        status: {
            type: String,
            enum: [
                "Running",
                "Delayed",
                "Stopped",
                "Breakdown",
                "Emergency",
                "Inactive"
            ],
            default: "Inactive"
        },

        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },

        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route",
            default: null
        },

        currentLocation: {
            latitude: {
                type: Number,
                default: null
            },

            longitude: {
                type: Number,
                default: null
            },

            updatedAt: {
                type: Date,
                default: null
            }
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

module.exports = mongoose.model("Bus", busSchema);