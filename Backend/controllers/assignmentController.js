const Driver = require("../models/Driver");
const Bus = require("../models/Bus");
const Route = require("../models/Route");

const assignDriver = async (req, res) => {
    try {
        const { driverId, busId, routeId } = req.body;

        if (!driverId || !busId || !routeId) {
            return res.status(400).json({
                message: "Driver ID, bus ID and route ID are required"
            });
        }

        const driver = await Driver.findById(driverId);

        if (!driver) {
            return res.status(404).json({
                message: "Driver not found"
            });
        }

        const bus = await Bus.findById(busId);

        if (!bus) {
            return res.status(404).json({
                message: "Bus not found"
            });
        }

        const route = await Route.findById(routeId);

        if (!route) {
            return res.status(404).json({
                message: "Route not found"
            });
        }

        if (!driver.isActive) {
            return res.status(400).json({
                message: "Driver is inactive"
            });
        }

        if (!bus.isActive) {
            return res.status(400).json({
                message: "Bus is inactive"
            });
        }

        if (!route.isActive) {
            return res.status(400).json({
                message: "Route is inactive"
            });
        }

        driver.assignedBus = bus._id;
        driver.assignedRoute = route._id;

        bus.driver = driver.user;
        bus.route = route._id;

        await driver.save();
        await bus.save();

        const updatedDriver = await Driver.findById(driver._id)
            .populate("user", "name email phone role")
            .populate("assignedBus", "busNumber registrationNumber status")
            .populate("assignedRoute", "name routeNumber");

        res.status(200).json({
            message: "Driver, bus and route assigned successfully",
            driver: updatedDriver
        });

    } catch (error) {
        console.error("Assignment error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    assignDriver
};