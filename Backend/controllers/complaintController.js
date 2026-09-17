const Complaint = require("../models/Complaint");
const Bus = require("../models/Bus");


// =========================
// CREATE COMPLAINT
// =========================
const createComplaint = async (req, res) => {
    try {
        const {
            bus,
            title,
            description,
            category,
            priority
        } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required"
            });
        }

        if (bus) {
            const existingBus = await Bus.findById(bus);

            if (!existingBus) {
                return res.status(404).json({
                    message: "Bus not found"
                });
            }
        }

        const complaint = await Complaint.create({
            createdBy: req.user._id,
            bus: bus || null,
            title,
            description,
            category: category || "Other",
            priority: priority || "Medium"
        });

        const populatedComplaint = await Complaint.findById(
            complaint._id
        )
            .populate("createdBy", "name email phone")
            .populate("bus", "busNumber registrationNumber status");

        res.status(201).json({
            message: "Complaint created successfully",
            complaint: populatedComplaint
        });

    } catch (error) {
        console.error("Create complaint error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// GET MY COMPLAINTS
// =========================
const getMyComplaints = async (req, res) => {
    try {

        const complaints = await Complaint.find({
            createdBy: req.user._id
        })
            .populate("bus", "busNumber registrationNumber status")
            .populate("trip", "status startTime endTime")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Get my complaints error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// GET MY COMPLAINT BY ID
// =========================
const getMyComplaintById = async (req, res) => {
    try {

        const complaint = await Complaint.findOne({
            _id: req.params.id,
            createdBy: req.user._id
        })
            .populate("bus", "busNumber registrationNumber status")
            .populate("trip", "status startTime endTime");

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            complaint
        });

    } catch (error) {
        console.error("Get complaint error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// ADMIN: GET ALL COMPLAINTS
// =========================
const getAllComplaints = async (req, res) => {
    try {

        const complaints = await Complaint.find()
            .populate("createdBy", "name email phone role")
            .populate("bus", "busNumber registrationNumber status")
            .populate("trip", "status startTime endTime")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: complaints.length,
            complaints
        });

    } catch (error) {
        console.error("Get all complaints error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// ADMIN: GET COMPLAINT BY ID
// =========================
const getComplaintById = async (req, res) => {
    try {

        const complaint = await Complaint.findById(req.params.id)
            .populate("createdBy", "name email phone role")
            .populate("bus", "busNumber registrationNumber status")
            .populate("trip", "status startTime endTime");

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        res.status(200).json({
            complaint
        });

    } catch (error) {
        console.error("Get complaint error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// =========================
// ADMIN: UPDATE COMPLAINT
// =========================
const updateComplaint = async (req, res) => {
    try {

        const {
            status,
            adminResponse,
            priority
        } = req.body;

        const complaint = await Complaint.findById(
            req.params.id
        );

        if (!complaint) {
            return res.status(404).json({
                message: "Complaint not found"
            });
        }

        const allowedStatuses = [
            "Pending",
            "In Progress",
            "Resolved",
            "Rejected"
        ];

        if (
            status &&
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid complaint status"
            });
        }

        const allowedPriorities = [
            "Low",
            "Medium",
            "High",
            "Critical"
        ];

        if (
            priority &&
            !allowedPriorities.includes(priority)
        ) {
            return res.status(400).json({
                message: "Invalid complaint priority"
            });
        }

        if (status) {
            complaint.status = status;
        }

        if (adminResponse !== undefined) {
            complaint.adminResponse = adminResponse;
        }

        if (priority) {
            complaint.priority = priority;
        }

        if (status === "Resolved") {
            complaint.resolvedAt = new Date();
        }

        await complaint.save();

        const updatedComplaint = await Complaint.findById(
            complaint._id
        )
            .populate("createdBy", "name email phone role")
            .populate("bus", "busNumber registrationNumber status")
            .populate("trip", "status startTime endTime");

        res.status(200).json({
            message: "Complaint updated successfully",
            complaint: updatedComplaint
        });

    } catch (error) {
        console.error("Update complaint error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    createComplaint,
    getMyComplaints,
    getMyComplaintById,
    getAllComplaints,
    getComplaintById,
    updateComplaint
};