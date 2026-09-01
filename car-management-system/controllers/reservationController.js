const Reservation = require("../models/reservationModel");
const db = require("../config/db");

const validPaymentModes = ["upi", "credit_card", "debit_card", "net_banking", "cash"];

exports.addReservation = async (req, res) => {
  try {
    const user_id = req.user.id;
    const car_id = Number(req.body.car_id);
    const order_date = req.body.order_date;
    const payment_mode = String(req.body.payment_mode || "").trim().toLowerCase();
    if (!Number.isInteger(car_id) || !order_date || !validPaymentModes.includes(payment_mode)) {
      return res.status(400).json({ message: "A valid vehicle, date and payment method are required" });
    }
    const requestedDate = new Date(`${order_date}T00:00:00`);
    const today = new Date(); today.setHours(0, 0, 0, 0);
    if (Number.isNaN(requestedDate.getTime()) || requestedDate < today) {
      return res.status(400).json({ message: "Please choose today or a future date" });
    }
    const [cars] = await db.execute("SELECT id, price, availability FROM cars WHERE id = ? LIMIT 1", [car_id]);
    if (!cars.length) return res.status(404).json({ message: "Vehicle not found" });
    if (!cars[0].availability) return res.status(409).json({ message: "This vehicle is currently unavailable" });
    // Price and initial status are controlled by the server. Never trust client-supplied totals/status.
    const total_price = Number(cars[0].price);
    const reservationId = await Reservation.addReservation({ user_id, car_id, order_date, total_price, payment_mode, status: "pending" });
    res.status(201).json({ message: "Reservation request submitted successfully", reservationId, total_price, status: "pending" });
  } catch (error) {
    console.error("Reservation create error:", error);
    res.status(500).json({ message: "Unable to submit reservation" });
  }
};

exports.getReservations = async (req, res) => {
  try {
    const reservations = req.user.role === "customer" ? await Reservation.getReservationsByUser(req.user.id) : await Reservation.getReservations();
    res.status(200).json(reservations);
  } catch (error) { console.error("Reservation list error:", error); res.status(500).json({ message: "Unable to load reservations" }); }
};

exports.getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.getReservationById(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });
    if (req.user.role === "customer" && reservation.user_id !== req.user.id) return res.status(403).json({ message: "Access denied" });
    res.status(200).json(reservation);
  } catch (error) { console.error("Reservation detail error:", error); res.status(500).json({ message: "Unable to load reservation" }); }
};

exports.updateReservation = async (req, res) => {
  try {
    const status = String(req.body.status || "").toLowerCase();
    if (!["pending", "confirmed", "canceled"].includes(status)) return res.status(400).json({ message: "Invalid reservation status" });
    const affectedRows = await Reservation.updateReservation(req.params.id, status);
    if (!affectedRows) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ message: `Reservation ${status === "confirmed" ? "confirmed" : status === "canceled" ? "canceled" : "returned to pending"}` });
  } catch (error) { console.error("Reservation update error:", error); res.status(500).json({ message: "Unable to update reservation" }); }
};

exports.deleteReservation = async (req, res) => {
  try {
    const affectedRows = await Reservation.deleteReservation(req.params.id);
    if (!affectedRows) return res.status(404).json({ message: "Reservation not found" });
    res.status(200).json({ message: "Reservation removed successfully" });
  } catch (error) { console.error("Reservation delete error:", error); res.status(500).json({ message: "Unable to remove reservation" }); }
};
