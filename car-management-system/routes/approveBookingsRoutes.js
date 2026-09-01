const express = require('express');
const router = express.Router();
const controller = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.verifyToken, authMiddleware.checkEmployee, controller.getReservations);
router.put('/:id/status', authMiddleware.verifyToken, authMiddleware.checkSupervisor, controller.updateReservation);

module.exports = router;
