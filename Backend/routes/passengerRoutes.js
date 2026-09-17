const express = require("express");

const {
    getMyProfile,
    getActiveBuses,
    getRunningBuses,
    getBusLiveLocation,
    getActiveRoutes,
    getRouteById,
    getBusETA
} = require("../controllers/passengerController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =========================
// PASSENGER PROFILE
// =========================

router.get(
    "/me",
    authMiddleware,
    authorizeRoles("user"),
    getMyProfile
);


// =========================
// BUS APIs
// =========================

router.get(
    "/buses",
    authMiddleware,
    authorizeRoles("user"),
    getActiveBuses
);

router.get(
    "/buses/running",
    authMiddleware,
    authorizeRoles("user"),
    getRunningBuses
);

router.get(
    "/buses/:id/live",
    authMiddleware,
    authorizeRoles("user"),
    getBusLiveLocation
);


// =========================
// ROUTE APIs
// =========================

router.get(
    "/routes",
    authMiddleware,
    authorizeRoles("user"),
    getActiveRoutes
);

router.get(
    "/routes/:id",
    authMiddleware,
    authorizeRoles("user"),
    getRouteById
);
router.get(
    "/buses/:id/eta",
    authMiddleware,
    authorizeRoles("user"),
    getBusETA
);


module.exports = router;