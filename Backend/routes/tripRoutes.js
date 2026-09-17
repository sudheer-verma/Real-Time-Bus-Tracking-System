const express = require("express");

const {
    createTrip,
    getAllTrips,
    getTripById,
    updateTrip,
    cancelTrip
} = require("../controllers/tripController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.post("/", createTrip);
router.get("/", getAllTrips);
router.get("/:id", getTripById);
router.put("/:id", updateTrip);
router.delete("/:id", cancelTrip);

module.exports = router;