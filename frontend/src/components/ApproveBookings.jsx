import React, { useEffect, useState } from 'react';
import ReservationService from '../services/ReservationService';
import TestDriveService from '../services/TestDriveService';

const ApproveBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [testDrives, setTestDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [filter, setFilter] = useState('pending');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [bookingRes, testDriveRes] = await Promise.all([
        ReservationService.getAllReservations(),
        TestDriveService.getAllTestDrives()
      ]);
      setBookings(Array.isArray(bookingRes.data) ? bookingRes.data : []);
      setTestDrives(Array.isArray(testDriveRes.data) ? testDriveRes.data : []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleStatusChange = async (type, id, newStatus) => {
    try {
      if (type === 'car') {
        await ReservationService.updateReservation(id, { status: newStatus });
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
      } else {
        await TestDriveService.updateTestDriveStatus(id, newStatus);
        setTestDrives(prev => prev.map(td => td.id === id ? { ...td, status: newStatus } : td));
      }
      setSuccessMessage(`${type === 'car' ? 'Car booking' : 'Test drive'} #${id} updated to ${newStatus}.`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error('Status update failed:', err);
      setError(err.response?.data?.message || `Failed to update ${type} #${id}.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const filteredCarBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const filteredTestDrives = filter === 'all' ? testDrives : testDrives.filter(td => td.status === filter);

  if (loading) return <div className="section-loading">Loading bookings...</div>;

  return (
    <section className="approve-bookings section">
      <div className="section-header">
        <h2>Manage Car Bookings</h2>
        <div className="filter-controls">
          {['all', 'pending', 'confirmed', 'canceled', 'completed', 'cancelled'].map(f => (
            <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>
      {successMessage && <div className="success-message">{successMessage}</div>}
      {error && <div className="error-message">{error}</div>}

      <h3>Car Purchase Bookings</h3>
      {filteredCarBookings.length === 0 ? <p>No {filter} car bookings found.</p> : (
        <div className="bookings-table-container"><table className="bookings-table"><thead><tr><th>ID</th><th>Customer</th><th>Car</th><th>Order Date</th><th>Payment</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {filteredCarBookings.map(booking => <tr key={booking.id} className={`status-${booking.status}`}>
            <td>{booking.id}</td><td>{booking.user_name || `User-${booking.user_id}`}</td><td>{booking.car_name || `Car-${booking.car_id}`}</td><td>{new Date(booking.order_date).toLocaleDateString()}</td><td>{booking.payment_mode}</td><td><span className={`status-badge ${booking.status}`}>{booking.status}</span></td>
            <td>{booking.status === 'pending' && <><button onClick={() => handleStatusChange('car', booking.id, 'confirmed')} className="approve-btn">Approve</button><button onClick={() => handleStatusChange('car', booking.id, 'canceled')} className="reject-btn">Reject</button></>}{booking.status === 'canceled' && <button onClick={() => handleStatusChange('car', booking.id, 'pending')} className="reconsider-btn">Reconsider</button>}</td>
          </tr>)}
        </tbody></table></div>
      )}

      <h3>Test Drive Bookings</h3>
      {filteredTestDrives.length === 0 ? <p>No {filter} test drive bookings found.</p> : (
        <div className="bookings-table-container"><table className="bookings-table"><thead><tr><th>ID</th><th>User</th><th>Car</th><th>Location</th><th>Date</th><th>Slot</th><th>Status</th><th>Actions</th></tr></thead><tbody>
          {filteredTestDrives.map(td => <tr key={td.id} className={`status-${td.status}`}>
            <td>{td.id}</td><td>{td.user_name || `User-${td.user_id}`}</td><td>{td.car_name || `Car-${td.car_id}`}</td><td>{td.location_name || `Location-${td.location_id}`}</td><td>{new Date(td.preferred_date).toLocaleDateString()}</td><td>Slot {td.slot_number}</td><td><span className={`status-badge ${td.status}`}>{td.status}</span></td>
            <td>{td.status === 'pending' && <><button onClick={() => handleStatusChange('testdrive', td.id, 'confirmed')} className="approve-btn">Approve</button><button onClick={() => handleStatusChange('testdrive', td.id, 'cancelled')} className="reject-btn">Reject</button></>}{td.status === 'cancelled' && <button onClick={() => handleStatusChange('testdrive', td.id, 'pending')} className="reconsider-btn">Reconsider</button>}</td>
          </tr>)}
        </tbody></table></div>
      )}
    </section>
  );
};

export default ApproveBookings;
