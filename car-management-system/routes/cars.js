const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", carController.getCars);
router.get("/:id", carController.getCarById);
router.post("/", authMiddleware.verifyToken, authMiddleware.checkSupervisor, carController.addCar);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.checkSupervisor, carController.updateCar);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.checkSupervisor, carController.deleteCar);

module.exports = router;
