const express = require("express");

const {
    createRoute,
    getAllRoutes,
    getRouteById,
    updateRoute,
    deleteRoute
} = require("../controllers/routeController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.post("/", createRoute);

router.get("/", getAllRoutes);

router.get("/:id", getRouteById);

router.put("/:id", updateRoute);

router.delete("/:id", deleteRoute);

module.exports = router;