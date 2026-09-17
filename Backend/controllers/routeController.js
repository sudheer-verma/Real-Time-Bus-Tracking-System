const Route = require("../models/Route");

const createRoute = async (req, res) => {
    try {
        const {
            name,
            routeNumber,
            startPoint,
            endPoint,
            stops,
            estimatedDuration
        } = req.body;

        if (
            !name ||
            !routeNumber ||
            !startPoint ||
            !endPoint
        ) {
            return res.status(400).json({
                message: "Name, route number, start point and end point are required"
            });
        }

        const existingRoute = await Route.findOne({
            routeNumber
        });

        if (existingRoute) {
            return res.status(400).json({
                message: "Route number already exists"
            });
        }

        const route = await Route.create({
            name,
            routeNumber,
            startPoint,
            endPoint,
            stops: stops || [],
            estimatedDuration: estimatedDuration || 0
        });

        res.status(201).json({
            message: "Route created successfully",
            route
        });

    } catch (error) {
        console.error("Create route error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const getAllRoutes = async (req, res) => {
    try {
        const routes = await Route.find()
            .populate("stops", "name latitude longitude sequence");

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


const getRouteById = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id)
            .populate(
                "stops",
                "name latitude longitude sequence estimatedArrivalMinutes"
            );

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


const updateRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);

        if (!route) {
            return res.status(404).json({
                message: "Route not found"
            });
        }

        const {
            name,
            routeNumber,
            startPoint,
            endPoint,
            stops,
            estimatedDuration,
            isActive
        } = req.body;

        if (name !== undefined) {
            route.name = name;
        }

        if (routeNumber !== undefined) {
            route.routeNumber = routeNumber;
        }

        if (startPoint !== undefined) {
            route.startPoint = startPoint;
        }

        if (endPoint !== undefined) {
            route.endPoint = endPoint;
        }

        if (stops !== undefined) {
            route.stops = stops;
        }

        if (estimatedDuration !== undefined) {
            route.estimatedDuration = estimatedDuration;
        }

        if (isActive !== undefined) {
            route.isActive = isActive;
        }

        await route.save();

        res.status(200).json({
            message: "Route updated successfully",
            route
        });

    } catch (error) {
        console.error("Update route error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


const deleteRoute = async (req, res) => {
    try {
        const route = await Route.findById(req.params.id);

        if (!route) {
            return res.status(404).json({
                message: "Route not found"
            });
        }

        route.isActive = false;

        await route.save();

        res.status(200).json({
            message: "Route deactivated successfully"
        });

    } catch (error) {
        console.error("Delete route error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createRoute,
    getAllRoutes,
    getRouteById,
    updateRoute,
    deleteRoute
};