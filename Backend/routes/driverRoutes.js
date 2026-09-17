const express = require("express");

const {
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
} = require("../controllers/driverController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// Driver self profile
router.get(
    "/me",
    authMiddleware,
    authorizeRoles("driver"),
    getMyDriverProfile
);
router.get(
    "/my-assignment",
    authMiddleware,
    authorizeRoles("driver"),
    getMyAssignment
);
router.post(
    "/my-trip/start",
    authMiddleware,
    authorizeRoles("driver"),
    startMyTrip
);

router.post(
    "/my-trip/end",
    authMiddleware,
    authorizeRoles("driver"),
    endMyTrip
);
router.put(
    "/my-bus/status",
    authMiddleware,
    authorizeRoles("driver"),
    updateMyBusStatus
);
router.put(
    "/my-bus/location",
    authMiddleware,
    authorizeRoles("driver"),
    updateMyBusLocation
);


// Admin routes
router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.post("/", createDriver);
router.get("/", getAllDrivers);
router.get("/:id", getDriverById);
router.put("/:id", updateDriver);
router.delete("/:id", deactivateDriver);

module.exports = router;