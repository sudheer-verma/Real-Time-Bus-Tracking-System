const mongoose = require("mongoose");

const tripSchema = new mongoose.Schema(
    {
        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
            required: true
        },

        driver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        route: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Route",
            required: true
        },

        status: {
            type: String,
            enum: [
                "Scheduled",
                "Running",
                "Completed",
                "Cancelled"
            ],
            default: "Scheduled"
        },

        startTime: {
            type: Date,
            default: null
        },

        endTime: {
            type: Date,
            default: null
        },

        startLocation: {
            latitude: {
                type: Number,
                default: null
            },

            longitude: {
                type: Number,
                default: null
            }
        },

        endLocation: {
            latitude: {
                type: Number,
                default: null
            },

            longitude: {
                type: Number,
                default: null
            }
        },

        totalDistance: {
            type: Number,
            default: 0
        },

        duration: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Trip", tripSchema);