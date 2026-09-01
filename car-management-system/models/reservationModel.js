const db = require("../config/db");

const Reservation = {
  addReservation: async ({ user_id, car_id, order_date, total_price, payment_mode, status = "pending" }) => {
    const [result] = await db.execute(
      "INSERT INTO reservations (user_id, car_id, order_date, total_price, payment_mode, status) VALUES (?, ?, ?, ?, ?, ?)",
      [user_id, car_id, order_date, total_price, payment_mode, status]
    );
    return result.insertId;
  },

  getReservations: async () => {
    const [results] = await db.execute(`
      SELECT r.*, u.name AS user_name, CONCAT(c.brand, '-', c.model) AS car_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
      ORDER BY r.id DESC
    `);
    return results;
  },

  getReservationsByUser: async (userId) => {
    const [results] = await db.execute(`
      SELECT r.*, u.name AS user_name, CONCAT(c.brand, '-', c.model) AS car_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
      WHERE r.user_id = ?
      ORDER BY r.id DESC
    `, [userId]);
    return results;
  },

  getReservationById: async (id) => {
    const [results] = await db.execute(`
      SELECT r.*, u.name AS user_name, CONCAT(c.brand, '-', c.model) AS car_name
      FROM reservations r
      JOIN users u ON r.user_id = u.id
      JOIN cars c ON r.car_id = c.id
      WHERE r.id = ?
    `, [id]);
    return results[0] || null;
  },

  updateReservation: async (id, status) => {
    const [result] = await db.execute("UPDATE reservations SET status = ? WHERE id = ?", [status, id]);
    return result.affectedRows;
  },

  deleteReservation: async (id) => {
    const [result] = await db.execute("DELETE FROM reservations WHERE id = ?", [id]);
    return result.affectedRows;
  }
};

module.exports = Reservation;
