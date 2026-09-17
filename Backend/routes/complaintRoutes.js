const express = require("express");

const {
    createComplaint,
    getMyComplaints,
    getMyComplaintById,
    getAllComplaints,
    getComplaintById,
    updateComplaint
} = require("../controllers/complaintController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();


// =========================
// USER ROUTES
// =========================

router.post(
    "/",
    authMiddleware,
    authorizeRoles("user"),
    createComplaint
);

router.get(
    "/my",
    authMiddleware,
    authorizeRoles("user"),
    getMyComplaints
);

router.get(
    "/my/:id",
    authMiddleware,
    authorizeRoles("user"),
    getMyComplaintById
);


// =========================
// ADMIN ROUTES
// =========================

router.get(
    "/",
    authMiddleware,
    authorizeRoles("admin"),
    getAllComplaints
);

router.get(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    getComplaintById
);

router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("admin"),
    updateComplaint
);


module.exports = router;