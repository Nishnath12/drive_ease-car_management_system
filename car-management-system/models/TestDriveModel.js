const pool = require('../config/db');

const TestDriveModel = {
  findAll: async () => {
  const [rows] = await pool.query(`
                SELECT 
                    r.*, 
                    u.name AS user_name ,
                    CONCAT(c.brand, '-', c.model) AS car_name,
                    CONCAT(l.name, ', ', l.address) AS location_name
                FROM 
                    test_drive_reservations r
                JOIN 
                    users u ON r.user_id = u.id
                JOIN 
                    cars c ON r.car_id = c.id
                JOIN
                    locations l ON r.location_id = l.id
            `);
  return rows;
},

  findByUserId: async (userId) => {
    const [rows] = await pool.query('SELECT * FROM test_drive_reservations WHERE user_id = ?', [userId]);
    return rows;
  },

  create: async (testDrive) => {
    const { user_id, car_id, location_id, preferred_date, slot_number, status, comments } = testDrive;
    const [result] = await pool.query(
      'INSERT INTO test_drive_reservations (user_id, car_id, location_id, preferred_date, slot_number, status, comments) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, car_id, location_id, preferred_date, slot_number, status, comments]
    );
    return { id: result.insertId, ...testDrive };
  },

  updateStatus: async (id, status) => {
    await pool.query('UPDATE test_drive_reservations SET status = ? WHERE id = ?', [status, id]);
  }
};

module.exports = TestDriveModel;