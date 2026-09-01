const db = require('../config/db');

exports.dashboard = async (req,res)=>{
  try {
    const [[bookingStats]] = await db.execute(`SELECT COUNT(*) total, SUM(status='pending') pending, SUM(status='confirmed') confirmed, SUM(status='canceled') cancelled, COALESCE(SUM(total_price),0) value FROM reservations`);
    const [[driveStats]] = await db.execute(`SELECT COUNT(*) total, SUM(status='pending') pending, SUM(status='confirmed') confirmed, SUM(status='completed') completed, SUM(status='cancelled') cancelled FROM test_drive_reservations`);
    const [[serviceStats]] = await db.execute(`SELECT COUNT(*) total, SUM(status='pending') pending, SUM(status='in_progress') in_progress, SUM(status='completed') completed, COALESCE(SUM(cost),0) revenue FROM services`);
    const [[partStats]] = await db.execute(`SELECT COUNT(*) total, COALESCE(SUM(stock_quantity),0) units, SUM(stock_quantity=0) out_of_stock, SUM(stock_quantity BETWEEN 1 AND 5) low_stock FROM spare_parts`);
    const [[carStats]] = await db.execute(`SELECT COUNT(*) total, SUM(availability=1) available, SUM(availability=0) unavailable FROM cars`);
    const [[customerStats]] = await db.execute(`SELECT COUNT(*) total FROM users WHERE role='customer'`);
    const [[staffStats]] = await db.execute(`SELECT COUNT(*) total, SUM(is_active=1) active, SUM(role='supervisor') supervisors FROM users WHERE role IN ('employee','supervisor')`);
    const [recentBookings] = await db.execute(`SELECT r.id,r.status,r.order_date,r.total_price,u.name AS customer,CONCAT(c.brand,' ',c.model) AS vehicle FROM reservations r JOIN users u ON r.user_id=u.id JOIN cars c ON r.car_id=c.id ORDER BY r.created_at DESC LIMIT 8`);
    const [serviceByStatus] = await db.execute(`SELECT status,COUNT(*) count FROM services GROUP BY status`);
    const [bookingsByStatus] = await db.execute(`SELECT status,COUNT(*) count FROM reservations GROUP BY status`);
    res.json({bookings:bookingStats, testDrives:driveStats, services:serviceStats, parts:partStats, cars:carStats, customers:customerStats, staff:staffStats, recentBookings, serviceByStatus, bookingsByStatus});
  } catch(err){ console.error('Analytics error:',err); res.status(500).json({message:'Unable to load analytics'}); }
};
