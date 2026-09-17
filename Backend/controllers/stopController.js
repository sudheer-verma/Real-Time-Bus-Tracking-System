const Stop = require("../models/Stop");

const createStop = async (req, res) => {
    try {
        const {
            name,
            latitude,
            longitude,
            sequence,
            estimatedArrivalMinutes
        } = req.body;

        if (
            !name ||
            latitude === undefined ||
            longitude === undefined ||
            sequence === undefined
        ) {
            return res.status(400).json({
                message: "Name, latitude, longitude and sequence are required"
            });
        }

        const stop = await Stop.create({
            name,
            latitude,
            longitude,
            sequence,
            estimatedArrivalMinutes:
                estimatedArrivalMinutes || 0
        });

        res.status(201).json({
            message: "Stop created successfully",
            stop
        });

    } catch (error) {
        console.error("Create stop error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getAllStops = async (req, res) => {
    try {
        const stops = await Stop.find()
            .sort({ sequence: 1 });

        res.status(200).json({
            count: stops.length,
            stops
        });

    } catch (error) {
        console.error("Get stops error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getStopById = async (req, res) => {
    try {
        const stop = await Stop.findById(req.params.id);

        if (!stop) {
            return res.status(404).json({
                message: "Stop not found"
            });
        }

        res.status(200).json({
            stop
        });

    } catch (error) {
        console.error("Get stop error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const updateStop = async (req, res) => {
    try {
        const stop = await Stop.findById(req.params.id);

        if (!stop) {
            return res.status(404).json({
                message: "Stop not found"
            });
        }

        const {
            name,
            latitude,
            longitude,
            sequence,
            estimatedArrivalMinutes,
            isActive
        } = req.body;

        if (name !== undefined) {
            stop.name = name;
        }

        if (latitude !== undefined) {
            stop.latitude = latitude;
        }

        if (longitude !== undefined) {
            stop.longitude = longitude;
        }

        if (sequence !== undefined) {
            stop.sequence = sequence;
        }

        if (estimatedArrivalMinutes !== undefined) {
            stop.estimatedArrivalMinutes =
                estimatedArrivalMinutes;
        }

        if (isActive !== undefined) {
            stop.isActive = isActive;
        }

        await stop.save();

        res.status(200).json({
            message: "Stop updated successfully",
            stop
        });

    } catch (error) {
        console.error("Update stop error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const deleteStop = async (req, res) => {
    try {
        const stop = await Stop.findById(req.params.id);

        if (!stop) {
            return res.status(404).json({
                message: "Stop not found"
            });
        }

        stop.isActive = false;

        await stop.save();

        res.status(200).json({
            message: "Stop deactivated successfully"
        });

    } catch (error) {
        console.error("Delete stop error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createStop,
    getAllStops,
    getStopById,
    updateStop,
    deleteStop
};