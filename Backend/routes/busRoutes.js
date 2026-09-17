const express = require("express");

const {
    createBus,
    getAllBuses,
    getBusById,
    updateBus,
    deleteBus
} = require("../controllers/busController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.post("/", createBus);

router.get("/", getAllBuses);

router.get("/:id", getBusById);

router.put("/:id", updateBus);

router.delete("/:id", deleteBus);

module.exports = router;