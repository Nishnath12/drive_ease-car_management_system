const db = require("../config/db");

const Service = {
    addService: async ({ user_id, car_id, location_id, service_date, description, cost, status }) => {
        const [result] = await db.execute(`INSERT INTO services (user_id, car_id, location_id, service_date, description, cost, status) VALUES (?, ?, ?, ?, ?, ?, ?)`, [user_id, car_id, location_id, service_date, description, cost, status || "pending"]);
        return result.insertId;
    },
    getAllServices: async () => {
        const [results] = await db.execute(`SELECT s.*, u.name AS user_name, CONCAT(c.brand, ' ', c.model) AS car_name, l.name AS location_name, l.address AS location_address FROM services s JOIN users u ON s.user_id=u.id JOIN cars c ON s.car_id=c.id JOIN locations l ON s.location_id=l.id ORDER BY s.created_at DESC`);
        return results;
    },
    getServiceById: async (id) => {
        const [results] = await db.execute(`SELECT s.*, u.name AS user_name, CONCAT(c.brand, ' ', c.model) AS car_name, l.name AS location_name, l.address AS location_address FROM services s JOIN users u ON s.user_id=u.id JOIN cars c ON s.car_id=c.id JOIN locations l ON s.location_id=l.id WHERE s.id=?`, [id]);
        return results[0] || null;
    },
    getServicesByUserId: async (userId) => {
        const [results] = await db.execute(`SELECT s.*, CONCAT(c.brand, ' ', c.model) AS car_name, l.name AS location_name, l.address AS location_address FROM services s JOIN cars c ON s.car_id=c.id JOIN locations l ON s.location_id=l.id WHERE s.user_id=? ORDER BY s.service_date DESC, s.created_at DESC`, [userId]);
        return results;
    },
    getServicesByLocationId: async (locationId) => {
        const [results] = await db.execute(`SELECT s.*, u.name AS user_name, CONCAT(c.brand, ' ', c.model) AS car_name, l.name AS location_name FROM services s JOIN users u ON s.user_id=u.id JOIN cars c ON s.car_id=c.id JOIN locations l ON s.location_id=l.id WHERE s.location_id=? ORDER BY s.service_date DESC`, [locationId]);
        return results;
    },
    updateServiceStatus: async (id, status) => { const [result] = await db.execute("UPDATE services SET status=? WHERE id=?", [status,id]); return result.affectedRows; },
    updateService: async (id, {location_id,service_date,description,cost,status}) => { const [result] = await db.execute("UPDATE services SET location_id=?, service_date=?, description=?, cost=?, status=? WHERE id=?", [location_id,service_date,description,cost,status,id]); return result.affectedRows; },
    deleteService: async (id) => { const [result] = await db.execute("DELETE FROM services WHERE id=?", [id]); return result.affectedRows; }
};
module.exports = Service;
