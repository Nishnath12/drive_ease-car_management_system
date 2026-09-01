const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authRateLimit } = require("../middleware/rateLimit");

router.post("/register", authRateLimit({ max: 8 }), authController.register);
router.post("/login", authRateLimit({ max: 10 }), authController.login);
router.post("/logout", authController.logout);

module.exports = router;
