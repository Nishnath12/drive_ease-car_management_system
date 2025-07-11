// routes/sparePartBooking.js
const express = require("express");
const router = express.Router();
const controller = require("../controllers/sparePartBookingController");
const auth = require("../middleware/authMiddleware");

// Book a spare part
router.post("/", auth.verifyToken, controller.bookSparePart);

// Get user’s own bookings
router.get("/my", auth.verifyToken, controller.getUserBookings);

// Admin/Employee get all bookings
router.get("/all", auth.verifyToken, controller.getAllBookings);

module.exports = router;
