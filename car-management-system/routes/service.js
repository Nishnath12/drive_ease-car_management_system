const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware.verifyToken);
router.post("/", serviceController.addService);
router.get("/user/:userId", serviceController.getServicesByUserId);
router.get("/", authMiddleware.checkEmployee, serviceController.getAllServices);
router.get("/location/:locationId", authMiddleware.checkEmployee, serviceController.getServicesByLocationId);
router.get("/:id", serviceController.getServiceById);
router.put("/:id/status", authMiddleware.checkEmployee, serviceController.updateServiceStatus);
router.put("/:id", authMiddleware.checkEmployee, serviceController.updateService);
router.delete("/:id", authMiddleware.checkEmployee, serviceController.deleteService);

module.exports = router;
