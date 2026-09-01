const Reservation = require("../models/reservationModel");

exports.addReservation = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { car_id, order_date, total_price, payment_mode, status } = req.body;
    if (!car_id || !order_date || total_price == null || !payment_mode) {
      return res.status(400).json({ message: "Car, order date, total price and payment mode are required" });
    }
    const reservationId = await Reservation.addReservation({ user_id, car_id, order_date, total_price, payment_mode, status });
    res.status(201).json({ message: "Reservation added successfully!", reservationId });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = req.user.role === "customer"
      ? await Reservation.getReservationsByUser(req.user.id)
      : await Reservation.getReservations();
    res.status(200).json(reservations);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.getReservationById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    if (req.user.role === "customer" && reservation.user_id !== req.user.id) return res.status(403).json({ message: "Access denied" });
    res.status(200).json(reservation);
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "confirmed", "canceled"].includes(status)) return res.status(400).json({ message: "Invalid status value" });
    const affectedRows = await Reservation.updateReservation(req.params.id, status);
    if (!affectedRows) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ message: "Reservation updated successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    const affectedRows = await Reservation.deleteReservation(req.params.id);
    if (!affectedRows) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ message: "Reservation deleted successfully!" });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ message: "Database error" });
  }
};
