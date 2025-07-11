const TestDriveModel = require('../models/TestDriveModel');

exports.createReservation = async (req, res) => {
  try {
    const result = await TestDriveModel.create(req.body);
    res.status(201).json({ message: 'Reservation created', id: result.id });
  } catch (err) {
    console.error('Create Error:', err);
    res.status(500).json({ error: 'Database insert failed' });
  }
};

exports.getAllReservations = async (req, res) => {
  try {
    const reservations = await TestDriveModel.findAll();
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
};

exports.getUserReservations = async (req, res) => {
  try {
    const results = await TestDriveModel.findByUserId(req.params.userId);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user reservations' });
  }
};

exports.updateReservationStatus = async (req, res) => {
  try {
    await TestDriveModel.updateStatus(req.params.id, req.body.status);
    res.json({ message: 'Status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update status' });
  }
};