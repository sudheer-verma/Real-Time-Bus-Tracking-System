const jwt = require("jsonwebtoken");
const Bus = require("../models/Bus");
const Driver = require("../models/Driver");
const User = require("../models/User");

const initializeSocket = (io) => {

    // =====================================================
    // SOCKET AUTHENTICATION
    // =====================================================
    io.use(async (socket, next) => {
        try {

            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error("Authentication required")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            // Verify user still exists and is active
            const user = await User.findById(decoded.userId)
                .select("-password");

            if (!user) {
                return next(
                    new Error("User not found")
                );
            }

            if (!user.isActive) {
                return next(
                    new Error("Account is inactive")
                );
            }

            // Store authenticated user
            socket.user = user;

            next();

        } catch (error) {

            console.error(
                "Socket authentication error:",
                error.message
            );

            next(
                new Error("Invalid or expired token")
            );
        }
    });


    // =====================================================
    // SOCKET CONNECTION
    // =====================================================
    io.on("connection", (socket) => {

        console.log(
            "Socket connected:",
            socket.id,
            "User:",
            socket.user.email,
            "Role:",
            socket.user.role
        );


        // =================================================
        // JOIN BUS ROOM
        // =================================================
        socket.on("join-bus-room", async (busId) => {

            try {

                if (!busId) {
                    socket.emit("socket-error", {
                        message: "Bus ID is required"
                    });

                    return;
                }

                const bus = await Bus.findById(busId);

                if (!bus) {
                    socket.emit("socket-error", {
                        message: "Bus not found"
                    });

                    return;
                }

                if (!bus.isActive) {
                    socket.emit("socket-error", {
                        message: "Bus is inactive"
                    });

                    return;
                }


                // -----------------------------------------
                // DRIVER ACCESS
                // Driver can only join assigned bus
                // -----------------------------------------
                if (socket.user.role === "driver") {

                    const driver = await Driver.findOne({
                        user: socket.user._id
                    });

                    if (!driver) {
                        socket.emit("socket-error", {
                            message: "Driver profile not found"
                        });

                        return;
                    }

                    if (
                        !driver.assignedBus ||
                        driver.assignedBus.toString() !== busId
                    ) {
                        socket.emit("socket-error", {
                            message:
                                "You are not assigned to this bus"
                        });

                        return;
                    }
                }


                // Join room
                const roomName = `bus:${busId}`;

                socket.join(roomName);

                console.log(
                    `${socket.id} joined ${roomName}`
                );


                socket.emit("bus-room-joined", {
                    message:
                        "Joined bus tracking room",

                    busId: bus._id,
                    busNumber: bus.busNumber,

                    status: bus.status,

                    currentLocation:
                        bus.currentLocation
                });

            } catch (error) {

                console.error(
                    "Join bus room error:",
                    error.message
                );

                socket.emit("socket-error", {
                    message:
                        "Unable to join bus room"
                });
            }
        });


        // =================================================
        // LEAVE BUS ROOM
        // =================================================
        socket.on("leave-bus-room", (busId) => {

            if (!busId) {
                return;
            }

            const roomName = `bus:${busId}`;

            socket.leave(roomName);

            console.log(
                `${socket.id} left ${roomName}`
            );

            socket.emit("bus-room-left", {
                message:
                    "Left bus tracking room",

                busId
            });
        });


        // =================================================
        // DRIVER LIVE GPS UPDATE
        // =================================================
        socket.on(
            "driver-location-update",
            async (data) => {

                try {

                    // Only driver can send GPS
                    if (socket.user.role !== "driver") {

                        socket.emit("socket-error", {
                            message:
                                "Only drivers can send location"
                        });

                        return;
                    }


                    const {
                        latitude,
                        longitude
                    } = data || {};


                    // -------------------------------------
                    // Validate GPS data
                    // -------------------------------------
                    if (
                        typeof latitude !== "number" ||
                        typeof longitude !== "number" ||
                        !Number.isFinite(latitude) ||
                        !Number.isFinite(longitude)
                    ) {

                        socket.emit("socket-error", {
                            message:
                                "Invalid latitude or longitude"
                        });

                        return;
                    }


                    // -------------------------------------
                    // Validate GPS range
                    // -------------------------------------
                    if (
                        latitude < -90 ||
                        latitude > 90 ||
                        longitude < -180 ||
                        longitude > 180
                    ) {

                        socket.emit("socket-error", {
                            message:
                                "Invalid GPS coordinates"
                        });

                        return;
                    }


                    // -------------------------------------
                    // Find driver
                    // -------------------------------------
                    const driver = await Driver.findOne({
                        user: socket.user._id
                    });

                    if (!driver) {

                        socket.emit("socket-error", {
                            message:
                                "Driver profile not found"
                        });

                        return;
                    }


                    // -------------------------------------
                    // Driver must have assigned bus
                    // -------------------------------------
                    if (!driver.assignedBus) {

                        socket.emit("socket-error", {
                            message:
                                "No bus assigned to driver"
                        });

                        return;
                    }


                    // -------------------------------------
                    // Find assigned bus
                    // -------------------------------------
                    const bus = await Bus.findById(
                        driver.assignedBus
                    );

                    if (!bus) {

                        socket.emit("socket-error", {
                            message:
                                "Assigned bus not found"
                        });

                        return;
                    }


                    if (!bus.isActive) {

                        socket.emit("socket-error", {
                            message:
                                "Assigned bus is inactive"
                        });

                        return;
                    }


                    // -------------------------------------
                    // Update location
                    // -------------------------------------
                    const updatedAt = new Date();

                    bus.currentLocation = {
                        latitude,
                        longitude,
                        updatedAt
                    };

                    await bus.save();


                    // -------------------------------------
                    // Broadcast GPS to bus room
                    // -------------------------------------
                    io.to(`bus:${bus._id}`).emit(
                        "bus-location-updated",
                        {
                            busId: bus._id,
                            busNumber: bus.busNumber,

                            latitude,
                            longitude,

                            updatedAt
                        }
                    );


                    // -------------------------------------
                    // Confirmation to driver
                    // -------------------------------------
                    socket.emit(
                        "location-update-success",
                        {
                            message:
                                "Location updated successfully",

                            busId: bus._id,
                            busNumber: bus.busNumber,

                            latitude,
                            longitude,

                            updatedAt
                        }
                    );

                } catch (error) {

                    console.error(
                        "Socket location error:",
                        error.message
                    );

                    socket.emit("socket-error", {
                        message:
                            "Unable to update location"
                    });
                }
            }
        );


        // =================================================
        // DRIVER BUS STATUS UPDATE
        // =================================================
        socket.on(
            "driver-bus-status-update",
            async (data) => {

                try {

                    // Only driver can update status
                    if (socket.user.role !== "driver") {

                        socket.emit("socket-error", {
                            message:
                                "Only drivers can update bus status"
                        });

                        return;
                    }


                    const { status } = data || {};


                    // Allowed statuses
                    const allowedStatuses = [
                        "Running",
                        "Delayed",
                        "Stopped",
                        "Breakdown",
                        "Emergency",
                        "Inactive"
                    ];


                    if (
                        !allowedStatuses.includes(status)
                    ) {

                        socket.emit("socket-error", {
                            message:
                                "Invalid bus status"
                        });

                        return;
                    }


                    // -------------------------------------
                    // Find driver
                    // -------------------------------------
                    const driver = await Driver.findOne({
                        user: socket.user._id
                    });

                    if (!driver) {

                        socket.emit("socket-error", {
                            message:
                                "Driver profile not found"
                        });

                        return;
                    }


                    // -------------------------------------
                    // Assigned bus check
                    // -------------------------------------
                    if (!driver.assignedBus) {

                        socket.emit("socket-error", {
                            message:
                                "No bus assigned to driver"
                        });

                        return;
                    }


                    // -------------------------------------
                    // Find bus
                    // -------------------------------------
                    const bus = await Bus.findById(
                        driver.assignedBus
                    );

                    if (!bus) {

                        socket.emit("socket-error", {
                            message:
                                "Assigned bus not found"
                        });

                        return;
                    }


                    if (!bus.isActive) {

                        socket.emit("socket-error", {
                            message:
                                "Assigned bus is inactive"
                        });

                        return;
                    }


                    // -------------------------------------
                    // Update status
                    // -------------------------------------
                    bus.status = status;

                    await bus.save();


                    // -------------------------------------
                    // Broadcast status
                    // -------------------------------------
                    io.to(`bus:${bus._id}`).emit(
                        "bus-status-updated",
                        {
                            busId: bus._id,
                            busNumber: bus.busNumber,

                            status: bus.status,

                            updatedAt: new Date()
                        }
                    );


                    // -------------------------------------
                    // Confirmation to driver
                    // -------------------------------------
                    socket.emit(
                        "bus-status-update-success",
                        {
                            message:
                                "Bus status updated successfully",

                            busId: bus._id,
                            busNumber: bus.busNumber,

                            status: bus.status
                        }
                    );

                } catch (error) {

                    console.error(
                        "Socket bus status error:",
                        error.message
                    );

                    socket.emit("socket-error", {
                        message:
                            "Unable to update bus status"
                    });
                }
            }
        );


        // =================================================
        // DISCONNECT
        // =================================================
        socket.on("disconnect", (reason) => {

            console.log(
                "Socket disconnected:",
                socket.id,
                "Reason:",
                reason
            );
        });

    });
};


module.exports = initializeSocket;