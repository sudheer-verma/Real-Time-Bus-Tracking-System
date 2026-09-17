const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Driver = require("../models/Driver");

const createDriver = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            licenseNumber,
            licenseExpiry,
            experienceYears
        } = req.body;

        if (
            !name ||
            !email ||
            !phone ||
            !password ||
            !licenseNumber ||
            !licenseExpiry
        ) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email or phone already registered"
            });
        }

        const existingDriver = await Driver.findOne({
            licenseNumber
        });

        if (existingDriver) {
            return res.status(400).json({
                message: "License number already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            phone,
            password: hashedPassword,
            role: "driver"
        });

        const driver = await Driver.create({
            user: user._id,
            licenseNumber,
            licenseExpiry,
            experienceYears: experienceYears || 0
        });

        res.status(201).json({
            message: "Driver created successfully",
            driver: {
                id: driver._id,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role
                },
                licenseNumber: driver.licenseNumber,
                licenseExpiry: driver.licenseExpiry,
                experienceYears: driver.experienceYears
            }
        });

    } catch (error) {
        console.error("Create driver error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getAllDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find()
            .populate("user", "name email phone role isActive")
            .populate("assignedBus", "busNumber registrationNumber status")
            .populate("assignedRoute", "name routeNumber");

        res.status(200).json({
            count: drivers.length,
            drivers
        });

    } catch (error) {
        console.error("Get drivers error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getDriverById = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id)
            .populate("user", "name email phone role isActive")
            .populate("assignedBus", "busNumber registrationNumber status")
            .populate("assignedRoute", "name routeNumber");

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        res.status(200).json({
            driver
        });

    } catch (error) {
        console.error("Get driver error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        const {
            licenseNumber,
            licenseExpiry,
            experienceYears,
            isAvailable
        } = req.body;

        if (licenseNumber !== undefined) {
            driver.licenseNumber = licenseNumber;
        }

        if (licenseExpiry !== undefined) {
            driver.licenseExpiry = licenseExpiry;
        }

        if (experienceYears !== undefined) {
            driver.experienceYears = experienceYears;
        }

        if (isAvailable !== undefined) {
            driver.isAvailable = isAvailable;
        }

        await driver.save();

        res.status(200).json({
            message: "Driver updated successfully",
            driver
        });

    } catch (error) {
        console.error("Update driver error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const deactivateDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        const user = await User.findById(driver.user);

        if (!user) {
            return res.status(404).json({
                message: "Driver user account not found"
            });
        }

        user.isActive = false;
        driver.isActive = false;
        driver.isAvailable = false;

        await user.save();
        await driver.save();

        res.status(200).json({
            message: "Driver deactivated successfully"
        });

    } catch (error) {
        console.error("Deactivate driver error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// Get Logged-in Driver Profile
const getMyDriverProfile = async (req, res) => {
    try {
        const driver = await Driver.findOne({
            user: req.user._id
        })
            .populate("user", "name email phone role isActive")
            .populate("assignedBus", "busNumber registrationNumber capacity status")
            .populate(
                "assignedRoute",
                "name routeNumber startPoint endPoint stops estimatedDuration"
            );

        if (!driver) {
            return res.status(404).json({
                message: "Driver profile not found"
            });
        }

        res.status(200).json({
            driver
        });

    } catch (error) {
        console.error("Get driver profile error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// Get My Assignment
const getMyAssignment = async (req, res) => {
    try {
        const driver = await Driver.findOne({
            user: req.user._id
        })
            .populate(
                "assignedBus",
                "busNumber registrationNumber capacity status currentLocation"
            )
            .populate({
                path: "assignedRoute",
                select: "name routeNumber startPoint endPoint stops estimatedDuration",
                populate: {
                    path: "stops",
                    select: "name latitude longitude sequence estimatedArrivalMinutes"
                }
            });

        if (!driver) {
            return res.status(404).json({
                message: "Driver profile not found"
            });
        }

        if (!driver.assignedBus || !driver.assignedRoute) {
            return res.status(404).json({
                message: "No bus or route assigned"
            });
        }

        res.status(200).json({
            bus: driver.assignedBus,
            route: driver.assignedRoute
        });

    } catch (error) {
        console.error("Get assignment error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// Start My Trip
const startMyTrip = async (req, res) => {
    try {
        const Trip = require("../models/Trip");
        const Bus = require("../models/Bus");
        const Driver = require("../models/Driver");

        const driver = await Driver.findOne({
            user: req.user._id
        });

        if (!driver) {
            return res.status(404).json({
                message: "Driver profile not found"
            });
        }

        if (!driver.assignedBus || !driver.assignedRoute) {
            return res.status(400).json({
                message: "Bus or route is not assigned"
            });
        }

        const trip = await Trip.findOne({
            driver: req.user._id,
            bus: driver.assignedBus,
            route: driver.assignedRoute,
            status: "Scheduled"
        }).sort({ createdAt: -1 });

        if (!trip) {
            return res.status(404).json({
                message: "No scheduled trip found"
            });
        }

        trip.status = "Running";
        trip.startTime = new Date();

        await trip.save();

        await Bus.findByIdAndUpdate(
            driver.assignedBus,
            {
                status: "Running"
            }
        );

        const updatedTrip = await Trip.findById(trip._id)
            .populate("bus", "busNumber registrationNumber status")
            .populate("driver", "name email phone")
            .populate("route", "name routeNumber");

        res.status(200).json({
            message: "Trip started successfully",
            trip: updatedTrip
        });

    } catch (error) {
        console.error("Start trip error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// End My Trip
const endMyTrip = async (req, res) => {
    try {
        const Trip = require("../models/Trip");
        const Bus = require("../models/Bus");
        const Driver = require("../models/Driver");

        const driver = await Driver.findOne({
            user: req.user._id
        });

        if (!driver) {
            return res.status(404).json({
                message: "Driver profile not found"
            });
        }

        const trip = await Trip.findOne({
            driver: req.user._id,
            bus: driver.assignedBus,
            route: driver.assignedRoute,
            status: "Running"
        }).sort({ createdAt: -1 });

        if (!trip) {
            return res.status(404).json({
                message: "No running trip found"
            });
        }

        trip.status = "Completed";
        trip.endTime = new Date();

        await trip.save();

        await Bus.findByIdAndUpdate(
            driver.assignedBus,
            {
                status: "Inactive"
            }
        );

        const updatedTrip = await Trip.findById(trip._id)
            .populate("bus", "busNumber registrationNumber status")
            .populate("driver", "name email phone")
            .populate("route", "name routeNumber");

        res.status(200).json({
            message: "Trip completed successfully",
            trip: updatedTrip
        });

    } catch (error) {
        console.error("End trip error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// Update My Bus Status
const updateMyBusStatus = async (req, res) => {
    try {
        const Bus = require("../models/Bus");
        const Driver = require("../models/Driver");

        const { status } = req.body;

        const allowedStatuses = [
            "Running",
            "Delayed",
            "Stopped",
            "Breakdown",
            "Emergency",
            "Inactive"
        ];

        if (!status) {
            return res.status(400).json({
                message: "Bus status is required"
            });
        }

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                message: "Invalid bus status"
            });
        }

        const driver = await Driver.findOne({
            user: req.user._id
        });

        if (!driver) {
            return res.status(404).json({
                message: "Driver profile not found"
            });
        }

        if (!driver.assignedBus) {
            return res.status(400).json({
                message: "No bus assigned to this driver"
            });
        }

        const bus = await Bus.findById(driver.assignedBus);

        if (!bus) {
            return res.status(404).json({
                message: "Assigned bus not found"
            });
        }

        bus.status = status;

        await bus.save();

        res.status(200).json({
            message: "Bus status updated successfully",
            bus: {
                id: bus._id,
                busNumber: bus.busNumber,
                status: bus.status
            }
        });

    } catch (error) {
        console.error("Update bus status error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};
// Update My Bus Location
const updateMyBusLocation = async (req, res) => {
    try {
        const Bus = require("../models/Bus");
        const Driver = require("../models/Driver");

        const { latitude, longitude } = req.body;

        if (latitude === undefined || longitude === undefined) {
            return res.status(400).json({
                message: "Latitude and longitude are required"
            });
        }

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {
            return res.status(400).json({
                message: "Latitude and longitude must be numbers"
            });
        }

        if (latitude < -90 || latitude > 90) {
            return res.status(400).json({
                message: "Invalid latitude"
            });
        }

        if (longitude < -180 || longitude > 180) {
            return res.status(400).json({
                message: "Invalid longitude"
            });
        }

        const driver = await Driver.findOne({
            user: req.user._id
        });

        if (!driver) {
            return res.status(404).json({
                message: "Driver profile not found"
            });
        }

        if (!driver.assignedBus) {
            return res.status(400).json({
                message: "No bus assigned to this driver"
            });
        }

        const bus = await Bus.findById(driver.assignedBus);

        if (!bus) {
            return res.status(404).json({
                message: "Assigned bus not found"
            });
        }

        bus.currentLocation = {
            latitude,
            longitude,
            updatedAt: new Date()
        };

        await bus.save();

        res.status(200).json({
            message: "Bus location updated successfully",
            location: bus.currentLocation
        });

    } catch (error) {
        console.error("Update bus location error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createDriver,
    getAllDrivers,
    getDriverById,
    updateDriver,
    deactivateDriver,
    getMyDriverProfile,
    getMyAssignment,
    startMyTrip,
    endMyTrip,
    updateMyBusStatus,
    updateMyBusLocation
}