const Trip = require("../models/Trip");
const Bus = require("../models/Bus");
const Driver = require("../models/Driver");
const Route = require("../models/Route");


// Create Trip
const createTrip = async (req, res) => {
    try {
        const { busId, driverId, routeId } = req.body;

        if (!busId || !driverId || !routeId) {
            return res.status(400).json({
                message: "Bus ID, driver ID and route ID are required"
            });
        }

        const bus = await Bus.findById(busId);

        if (!bus || !bus.isActive) {
            return res.status(404).json({
                message: "Active bus not found"
            });
        }

        const driver = await Driver.findById(driverId);

        if (!driver || !driver.isActive) {
            return res.status(404).json({
                message: "Active driver not found"
            });
        }

        const route = await Route.findById(routeId);

        if (!route || !route.isActive) {
            return res.status(404).json({
                message: "Active route not found"
            });
        }

        // Check assignment
        if (
            driver.assignedBus?.toString() !== busId ||
            driver.assignedRoute?.toString() !== routeId
        ) {
            return res.status(400).json({
                message: "Driver, bus and route are not assigned together"
            });
        }

        const trip = await Trip.create({
            bus: busId,
            driver: driver.user,
            route: routeId,
            status: "Scheduled"
        });

        const populatedTrip = await Trip.findById(trip._id)
            .populate("bus", "busNumber registrationNumber status")
            .populate("driver", "name email phone")
            .populate("route", "name routeNumber");

        res.status(201).json({
            message: "Trip created successfully",
            trip: populatedTrip
        });

    } catch (error) {
        console.error("Create trip error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get All Trips
const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate("bus", "busNumber registrationNumber status")
            .populate("driver", "name email phone")
            .populate("route", "name routeNumber")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: trips.length,
            trips
        });

    } catch (error) {
        console.error("Get trips error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get Trip By ID
const getTripById = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate("bus", "busNumber registrationNumber status")
            .populate("driver", "name email phone")
            .populate("route", "name routeNumber");

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        res.status(200).json({
            trip
        });

    } catch (error) {
        console.error("Get trip error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update Trip
const updateTrip = async (req, res) => {
    try {
        const { status, startTime, endTime } = req.body;

        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        if (status !== undefined) {
            trip.status = status;
        }

        if (startTime !== undefined) {
            trip.startTime = startTime;
        }

        if (endTime !== undefined) {
            trip.endTime = endTime;
        }

        await trip.save();

        const updatedTrip = await Trip.findById(trip._id)
            .populate("bus", "busNumber registrationNumber status")
            .populate("driver", "name email phone")
            .populate("route", "name routeNumber");

        res.status(200).json({
            message: "Trip updated successfully",
            trip: updatedTrip
        });

    } catch (error) {
        console.error("Update trip error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Delete / Cancel Trip
const cancelTrip = async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({
                message: "Trip not found"
            });
        }

        if (trip.status === "Completed") {
            return res.status(400).json({
                message: "Completed trip cannot be cancelled"
            });
        }

        trip.status = "Cancelled";
        trip.endTime = new Date();

        await trip.save();

        res.status(200).json({
            message: "Trip cancelled successfully",
            trip
        });

    } catch (error) {
        console.error("Cancel trip error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    cancelTrip
};