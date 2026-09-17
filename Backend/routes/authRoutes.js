const express = require("express");

const {
    register,
    login,
    getMe
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authMiddleware, getMe);

router.get(
    "/admin-test",
    authMiddleware,
    authorizeRoles("admin"),
    (req, res) => {
        res.status(200).json({
            message: "Admin access granted"
        });
    }
);

module.exports = router;