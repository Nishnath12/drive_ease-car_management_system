const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware.verifyToken, serviceController.addService);
router.get("/", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.getAllServices);
router.get("/user/:userId", authMiddleware.verifyToken, serviceController.getServicesByUserId);
router.get("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.getServiceById);
router.get("/location/:locationId", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.getServicesByLocationId);
router.put("/:id/status", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.updateServiceStatus);
router.put("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.updateService);
router.delete("/:id", authMiddleware.verifyToken, authMiddleware.checkEmployee, serviceController.deleteService);

module.exports = router;
