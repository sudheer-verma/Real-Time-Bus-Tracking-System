const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        routeNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        startPoint: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            latitude: {
                type: Number,
                required: true
            },

            longitude: {
                type: Number,
                required: true
            }
        },

        endPoint: {
            name: {
                type: String,
                required: true,
                trim: true
            },

            latitude: {
                type: Number,
                required: true
            },

            longitude: {
                type: Number,
                required: true
            }
        },

        stops: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Stop"
            }
        ],

        estimatedDuration: {
            type: Number,
            default: 0
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

module.exports = mongoose.model("Route", routeSchema);