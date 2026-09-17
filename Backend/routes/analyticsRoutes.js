const express = require("express");

const {
    getDashboardAnalytics
} = require("../controllers/analyticsController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/dashboard",
    authMiddleware,
    authorizeRoles("admin"),
    getDashboardAnalytics
);

module.exports = router;