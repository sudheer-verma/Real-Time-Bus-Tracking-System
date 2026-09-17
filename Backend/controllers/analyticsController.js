const User = require("../models/User");
const Driver = require("../models/Driver");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const Trip = require("../models/Trip");
const Complaint = require("../models/Complaint");

const getDashboardAnalytics = async (req, res) => {
    try {

        const [
            totalUsers,
            totalDrivers,
            totalBuses,
            runningBuses,
            delayedBuses,
            stoppedBuses,
            breakdownBuses,
            emergencyBuses,
            activeRoutes,
            totalTrips,
            runningTrips,
            completedTrips,
            cancelledTrips,
            totalComplaints,
            pendingComplaints,
            inProgressComplaints,
            resolvedComplaints,
            rejectedComplaints
        ] = await Promise.all([

            User.countDocuments({
                role: "user",
                isActive: true
            }),

            Driver.countDocuments({
                isActive: true
            }),

            Bus.countDocuments({
                isActive: true
            }),

            Bus.countDocuments({
                status: "Running",
                isActive: true
            }),

            Bus.countDocuments({
                status: "Delayed",
                isActive: true
            }),

            Bus.countDocuments({
                status: "Stopped",
                isActive: true
            }),

            Bus.countDocuments({
                status: "Breakdown",
                isActive: true
            }),

            Bus.countDocuments({
                status: "Emergency",
                isActive: true
            }),

            Route.countDocuments({
                isActive: true
            }),

            Trip.countDocuments(),

            Trip.countDocuments({
                status: "Running"
            }),

            Trip.countDocuments({
                status: "Completed"
            }),

            Trip.countDocuments({
                status: "Cancelled"
            }),

            Complaint.countDocuments(),

            Complaint.countDocuments({
                status: "Pending"
            }),

            Complaint.countDocuments({
                status: "In Progress"
            }),

            Complaint.countDocuments({
                status: "Resolved"
            }),

            Complaint.countDocuments({
                status: "Rejected"
            })
        ]);


        res.status(200).json({

            message: "Dashboard analytics fetched successfully",

            users: {
                total: totalUsers
            },

            drivers: {
                total: totalDrivers
            },

            buses: {
                total: totalBuses,
                running: runningBuses,
                delayed: delayedBuses,
                stopped: stoppedBuses,
                breakdown: breakdownBuses,
                emergency: emergencyBuses
            },

            routes: {
                active: activeRoutes
            },

            trips: {
                total: totalTrips,
                running: runningTrips,
                completed: completedTrips,
                cancelled: cancelledTrips
            },

            complaints: {
                total: totalComplaints,
                pending: pendingComplaints,
                inProgress: inProgressComplaints,
                resolved: resolvedComplaints,
                rejected: rejectedComplaints
            }

        });

    } catch (error) {

        console.error(
            "Dashboard analytics error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getDashboardAnalytics
};