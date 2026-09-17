const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const busRoutes = require("./routes/busRoutes");
const driverRoutes = require("./routes/driverRoutes");
const routeRoutes = require("./routes/routeRoutes");
const stopRoutes = require("./routes/stopRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const tripRoutes = require("./routes/tripRoutes");
const passengerRoutes = require("./routes/passengerRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const connectDB = require("./config/db");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST"],
        credentials: true
    }
});

connectDB();

app.use(
    cors({
        origin: process.env.FRONTEND_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
        credentials: true
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/buses", busRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/stops", stopRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/passenger", passengerRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Real-Time Bus Tracking API is running"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Real-Time Bus Tracking API is healthy",
        timestamp: new Date()
    });
});

const initializeSocket = require("./socket/socketHandler");

initializeSocket(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});