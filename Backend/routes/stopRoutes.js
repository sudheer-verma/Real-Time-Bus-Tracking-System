const express = require("express");

const {
    createStop,
    getAllStops,
    getStopById,
    updateStop,
    deleteStop
} = require("../controllers/stopController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.post("/", createStop);

router.get("/", getAllStops);

router.get("/:id", getStopById);

router.put("/:id", updateStop);

router.delete("/:id", deleteStop);

module.exports = router;