const Bus = require("../models/Bus");

const createBus = async (req, res) => {
    try {
        const {
            busNumber,
            registrationNumber,
            capacity
        } = req.body;

        if (!busNumber || !registrationNumber || !capacity) {
            return res.status(400).json({
                message: "Bus number, registration number and capacity are required"
            });
        }

        const existingBus = await Bus.findOne({
            $or: [
                { busNumber },
                { registrationNumber }
            ]
        });

        if (existingBus) {
            return res.status(400).json({
                message: "Bus number or registration number already exists"
            });
        }

        const bus = await Bus.create({
            busNumber,
            registrationNumber,
            capacity
        });

        res.status(201).json({
            message: "Bus created successfully",
            bus
        });

    } catch (error) {
        console.error("Create bus error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find()
            .populate("driver", "name email phone role")
            .populate("route", "name routeNumber");

        res.status(200).json({
            count: buses.length,
            buses
        });

    } catch (error) {
        console.error("Get buses error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getBusById = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id)
            .populate("driver", "name email phone role")
            .populate("route", "name routeNumber");

        if (!bus) {
            return res.status(404).json({
                message: "Bus not found"
            });
        }

        res.status(200).json({
            bus
        });

    } catch (error) {
        console.error("Get bus error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateBus = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);

        if (!bus) {
            return res.status(404).json({
                message: "Bus not found"
            });
        }

        const {
            busNumber,
            registrationNumber,
            capacity,
            status,
            isActive
        } = req.body;

        if (busNumber !== undefined) {
            bus.busNumber = busNumber;
        }

        if (registrationNumber !== undefined) {
            bus.registrationNumber = registrationNumber;
        }

        if (capacity !== undefined) {
            bus.capacity = capacity;
        }

        if (status !== undefined) {
            bus.status = status;
        }

        if (isActive !== undefined) {
            bus.isActive = isActive;
        }

        await bus.save();

        res.status(200).json({
            message: "Bus updated successfully",
            bus
        });

    } catch (error) {
        console.error("Update bus error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const deleteBus = async (req, res) => {
    try {
        const bus = await Bus.findById(req.params.id);

        if (!bus) {
            return res.status(404).json({
                message: "Bus not found"
            });
        }

        bus.isActive = false;
        bus.status = "Inactive";

        await bus.save();

        res.status(200).json({
            message: "Bus deactivated successfully"
        });

    } catch (error) {
        console.error("Delete bus error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createBus,
    getAllBuses,
    getBusById,
    updateBus,
    deleteBus
};