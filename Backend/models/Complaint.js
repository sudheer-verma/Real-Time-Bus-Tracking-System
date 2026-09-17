const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        bus: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Bus",
            default: null
        },

        trip: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Trip",
            default: null
        },

        category: {
            type: String,
            enum: [
                "Delay",
                "Breakdown",
                "Driver",
                "Overcrowding",
                "Route",
                "Bus Condition",
                "Safety",
                "Other"
            ],
            default: "Other"
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        priority: {
            type: String,
            enum: [
                "Low",
                "Medium",
                "High",
                "Critical"
            ],
            default: "Medium"
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "In Progress",
                "Resolved",
                "Rejected"
            ],
            default: "Pending"
        },

        adminResponse: {
            type: String,
            default: null,
            trim: true
        },

        aiAnalysis: {
            category: {
                type: String,
                default: null
            },

            priority: {
                type: String,
                default: null
            },

            confidence: {
                type: Number,
                default: null
            },

            isDuplicate: {
                type: Boolean,
                default: false
            },

            analyzedAt: {
                type: Date,
                default: null
            }
        },

        resolvedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Complaint", complaintSchema);