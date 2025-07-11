const express = require("express");
const router = express.Router();
const controller = require("../controllers/testDriveController");
const { verifyToken, checkSupervisor, checkEmployee } = require("../middleware/authMiddleware");

router.post("/", verifyToken, controller.createReservation);
router.get("/", verifyToken, checkEmployee, controller.getAllReservations);
router.get("/user/:userId", verifyToken, controller.getUserReservations);
router.put("/:id/status", verifyToken, checkSupervisor, controller.updateReservationStatus);

module.exports = router;