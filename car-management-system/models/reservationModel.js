const db = require("../config/db");

const Reservation = {
    // Add a new reservation
    addReservation: async ({ user_id, car_id, order_date, total_price, payment_mode, status }) => {
        const query = `
            INSERT INTO reservations (user_id, car_id, order_date, total_price, payment_mode, status) 
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [user_id, car_id, order_date, total_price, payment_mode, status || "pending"];
        const [result] = await db.execute(query, values);
        return result.insertId;
    },

    // Get all reservations
    getReservations: async () => {
    const query =`
        SELECT 
            r.*, 
            u.name AS user_name ,
            CONCAT(c.brand, '-', c.model) AS car_name
        FROM 
            reservations r
        JOIN 
            users u ON r.user_id = u.id
        JOIN 
            cars c ON r.car_id = c.id
    ;`
    const [results] = await db.execute(query);
    return results;
},


    // Get a reservation by ID
    getReservationById: async (id) => {
        const [results] = await db.execute("SELECT * FROM reservations WHERE id = ?", [id]);
        return results.length > 0 ? results[0] : null;
    },

    // Update reservation status
    updateReservation: async (id, status) => {
        const query = "UPDATE reservations SET status = ? WHERE id = ?";
        const [result] = await db.execute(query, [status, id]);
        return result.affectedRows;
    },

    // Delete a reservation
    deleteReservation: async (id) => {
        const [result] = await db.execute("DELETE FROM reservations WHERE id = ?", [id]);
        return result.affectedRows;
    }
};

module.exports = Reservation;
