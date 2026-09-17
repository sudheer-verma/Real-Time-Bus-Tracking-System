const User = require("../models/User");
const Bus = require("../models/Bus");
const Route = require("../models/Route");
const {
    calculateDistance,
    calculateETA
} = require("../utils/etaCalculator");


// =========================
// GET MY PROFILE
// =========================
const getMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get profile error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// GET ACTIVE BUSES
// =========================
const getActiveBuses = async (req, res) => {
    try {

        const buses = await Bus.find({
            isActive: true
        })
        .populate("driver", "name email phone")
        .populate("route", "name routeNumber")
        .select("-__v");

        res.status(200).json({
            count: buses.length,
            buses
        });

    } catch (error) {
        console.error("Get active buses error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// GET RUNNING BUSES
// =========================
const getRunningBuses = async (req, res) => {
    try {

        const buses = await Bus.find({
            isActive: true,
            status: {
                $in: [
                    "Running",
                    "Delayed",
                    "Stopped",
                    "Breakdown",
                    "Emergency"
                ]
            }
        })
        .populate("route", "name routeNumber")
        .select("-__v");

        res.status(200).json({
            count: buses.length,
            buses
        });

    } catch (error) {
        console.error("Get running buses error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// GET BUS LIVE LOCATION
// =========================
const getBusLiveLocation = async (req, res) => {
    try {

        const { id } = req.params;

        const bus = await Bus.findOne({
            _id: id,
            isActive: true
        })
        .populate("route", "name routeNumber")
        .select(
            "busNumber registrationNumber status route currentLocation"
        );

        if (!bus) {
            return res.status(404).json({
                message: "Bus not found"
            });
        }

        res.status(200).json({
            bus
        });

    } catch (error) {
        console.error("Get live location error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// =========================
// GET BUS ETA
// =========================
const getBusETA = async (req, res) => {

    try {

        const { id } = req.params;

        const bus = await Bus.findOne({
            _id: id,
            isActive: true
        })
            .populate({
                path: "route",
                populate: {
                    path: "stops",
                    select:
                        "name latitude longitude sequence estimatedArrivalMinutes"
                }
            })
            .select(
                "busNumber status route currentLocation"
            );


        if (!bus) {
            return res.status(404).json({
                message: "Bus not found"
            });
        }


        // Bus must have current location
        if (
            !bus.currentLocation ||
            bus.currentLocation.latitude === null ||
            bus.currentLocation.longitude === null
        ) {
            return res.status(400).json({
                message:
                    "Live location is not available for this bus"
            });
        }


        if (!bus.route) {
            return res.status(400).json({
                message:
                    "No route assigned to this bus"
            });
        }


        const stops = [...(bus.route.stops || [])]
            .sort(
                (a, b) =>
                    a.sequence - b.sequence
            );


        if (stops.length === 0) {
            return res.status(400).json({
                message:
                    "No stops available for this route"
            });
        }


        // Find nearest stop
        let nearestStop = null;
        let nearestDistance = Infinity;


        for (const stop of stops) {

            const distance = calculateDistance(
                bus.currentLocation.latitude,
                bus.currentLocation.longitude,
                stop.latitude,
                stop.longitude
            );


            if (distance < nearestDistance) {

                nearestDistance = distance;
                nearestStop = stop;
            }
        }


        if (!nearestStop) {
            return res.status(404).json({
                message:
                    "Unable to determine next stop"
            });
        }


        // Average city bus speed
        const etaMinutes = calculateETA(
            nearestDistance,
            30
        );


        res.status(200).json({

            bus: {
                id: bus._id,
                busNumber: bus.busNumber,
                status: bus.status
            },

            route: {
                id: bus.route._id,
                name: bus.route.name,
                routeNumber:
                    bus.route.routeNumber
            },

            nextStop: {
                id: nearestStop._id,
                name: nearestStop.name,
                sequence:
                    nearestStop.sequence
            },

            distanceKm:
                Number(nearestDistance.toFixed(2)),

            etaMinutes,

            currentLocation:
                bus.currentLocation

        });

    } catch (error) {

        console.error(
            "Get bus ETA error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

// =========================
// GET ALL ACTIVE ROUTES
// =========================
const getActiveRoutes = async (req, res) => {
    try {

        const routes = await Route.find({
            isActive: true
        })
        .populate(
            "stops",
            "name latitude longitude sequence estimatedArrivalMinutes"
        )
        .select("-__v");

        res.status(200).json({
            count: routes.length,
            routes
        });

    } catch (error) {
        console.error("Get routes error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// GET ROUTE BY ID
// =========================
const getRouteById = async (req, res) => {
    try {

        const { id } = req.params;

        const route = await Route.findOne({
            _id: id,
            isActive: true
        })
        .populate(
            "stops",
            "name latitude longitude sequence estimatedArrivalMinutes"
        )
        .select("-__v");

        if (!route) {
            return res.status(404).json({
                message: "Route not found"
            });
        }

        res.status(200).json({
            route
        });

    } catch (error) {
        console.error("Get route error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getMyProfile,
    getActiveBuses,
    getRunningBuses,
    getBusLiveLocation,
    getActiveRoutes,
    getRouteById,
    getBusETA
};