const express = require("express");

const {
    assignDriver
} = require("../controllers/assignmentController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware);
router.use(authorizeRoles("admin"));

router.post("/driver", assignDriver);

module.exports = router;