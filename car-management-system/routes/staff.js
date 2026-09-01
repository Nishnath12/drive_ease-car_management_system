const express = require("express");
const router = express.Router();
const controller = require("../controllers/staffController");
const auth = require("../middleware/authMiddleware");

router.use(auth.verifyToken, auth.checkSupervisor);
router.get("/", controller.listStaff);
router.post("/employees", controller.createEmployee);
router.put("/employees/:id", controller.updateEmployee);
router.patch("/employees/:id/status", controller.setEmployeeStatus);

module.exports = router;
