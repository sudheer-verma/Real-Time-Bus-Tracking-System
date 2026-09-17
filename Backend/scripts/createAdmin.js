require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("../models/User");

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        console.log("MongoDB connected");

        const adminEmail = "admin@bustracking.com";

        const existingAdmin = await User.findOne({
            email: adminEmail
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@12345",
            10
        );

        const admin = await User.create({
            name: "System Admin",
            email: adminEmail,
            phone: "9999999999",
            password: hashedPassword,
            role: "admin",
            isActive: true
        });

        console.log("Admin created successfully");
        console.log("Email:", admin.email);
        console.log("Password: Admin@12345");

        process.exit(0);

    } catch (error) {
        console.error("Admin creation failed:", error.message);
        process.exit(1);
    }
};

createAdmin();