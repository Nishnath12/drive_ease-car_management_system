const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservationController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware.verifyToken);
router.post("/", reservationController.addReservation);
router.get("/", reservationController.getReservations);
router.get("/:id", reservationController.getReservationById);
router.put("/:id", authMiddleware.checkSupervisor, reservationController.updateReservation);
router.delete("/:id", authMiddleware.checkSupervisor, reservationController.deleteReservation);

module.exports = router;
