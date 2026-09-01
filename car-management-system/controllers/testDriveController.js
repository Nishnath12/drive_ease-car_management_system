const TestDriveModel = require('../models/TestDriveModel');
const db = require('../config/db');

const allowedStatuses = ['pending','confirmed','completed','cancelled'];

exports.createReservation = async (req, res) => {
  try {
    const car_id = Number(req.body.car_id);
    const location_id = Number(req.body.location_id);
    const slot_number = Number(req.body.slot_number);
    const preferred_date = String(req.body.preferred_date || '');
    const comments = String(req.body.comments || '').trim().slice(0, 500);
    if (!Number.isInteger(car_id) || !Number.isInteger(location_id) || !Number.isInteger(slot_number) || !preferred_date) {
      return res.status(400).json({ message: 'Vehicle, showroom, date and time slot are required' });
    }
    if (slot_number < 1 || slot_number > 10) return res.status(400).json({ message: 'Invalid appointment time slot' });
    const date = new Date(`${preferred_date}T00:00:00`); const today = new Date(); today.setHours(0,0,0,0);
    if (Number.isNaN(date.getTime()) || date < today) return res.status(400).json({ message: 'Please choose today or a future date' });
    const [cars] = await db.execute('SELECT id, availability FROM cars WHERE id = ?', [car_id]);
    if (!cars.length) return res.status(404).json({ message: 'Vehicle not found' });
    if (!cars[0].availability) return res.status(409).json({ message: 'This vehicle is currently unavailable' });
    const [locations] = await db.execute('SELECT id FROM locations WHERE id = ?', [location_id]);
    if (!locations.length) return res.status(404).json({ message: 'Showroom not found' });
    const [existing] = await db.execute('SELECT id FROM test_drive_reservations WHERE location_id = ? AND preferred_date = ? AND slot_number = ? AND status IN (\'pending\',\'confirmed\') LIMIT 1', [location_id, preferred_date, slot_number]);
    if (existing.length) return res.status(409).json({ message: 'That showroom time slot is already booked. Please choose another.' });
    const result = await TestDriveModel.create({ user_id: req.user.id, car_id, location_id, preferred_date, slot_number, status: 'pending', comments });
    res.status(201).json({ message: 'Test drive request submitted', id: result.id, status: 'pending' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ message: 'That showroom time slot is already booked. Please choose another.' });
    console.error('Create test drive error:', err);
    res.status(500).json({ message: 'Unable to submit test drive request' });
  }
};

exports.getAllReservations = async (req, res) => { try { res.json(await TestDriveModel.findAll()); } catch (err) { console.error('List test drives error:', err); res.status(500).json({ message: 'Unable to load test drive requests' }); } };

exports.getUserReservations = async (req, res) => {
  try {
    const requestedUserId = Number(req.params.userId);
    if (req.user.role === 'customer' && requestedUserId !== req.user.id) return res.status(403).json({ message: 'Access denied' });
    if (!Number.isInteger(requestedUserId)) return res.status(400).json({ message: 'Invalid user' });
    res.json(await TestDriveModel.findByUserId(requestedUserId));
  } catch (err) { console.error('User test drives error:', err); res.status(500).json({ message: 'Unable to load test drives' }); }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    const status = String(req.body.status || '').toLowerCase();
    if (!allowedStatuses.includes(status)) return res.status(400).json({ message: 'Invalid test drive status' });
    const [result] = await db.execute('UPDATE test_drive_reservations SET status = ? WHERE id = ?', [status, Number(req.params.id)]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Test drive request not found' });
    res.json({ message: 'Test drive status updated successfully' });
  } catch (err) { console.error('Update test drive error:', err); res.status(500).json({ message: 'Unable to update test drive status' }); }
};
