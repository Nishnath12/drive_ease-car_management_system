import React, { useState, useEffect } from 'react';
import ReservationService from '../services/ReservationService';
import CarService from '../services/CarService';
import '../styles/CarBookings.css';

const CarBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cars, setCars] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [carsLoading, setCarsLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [newBooking, setNewBooking] = useState({
    car_id: '',
    order_date: '',
    price: '',
    payment_mode: '',
  });

  const [bookingMessage, setBookingMessage] = useState('');

  // Fetch user bookings and all cars
  const fetchBookings = async () => {
    try {
      const response = await ReservationService.getAllReservations();
      const carResponse = await CarService.getAllCars();
      const allCars = carResponse.data;

      const userBookings = response.data
        .filter(booking => booking.user_id === user.id)
        .map(booking => {
          const car = allCars.find(c => c.id === booking.car_id);
          return {
            ...booking,
            car_name: car ? `${car.model}` : null,
          };
        });

      setBookings(userBookings);
      setCars(allCars);
    } catch (err) {
      console.error('Error fetching bookings or cars:', err);
      setError('Failed to load your bookings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCars = async () => {
    setCarsLoading(true);
    try {
      const response = await CarService.getAllCars();
      setCars(response.data);
    } catch (err) {
      console.error('Error fetching available cars:', err);
    } finally {
      setCarsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  useEffect(() => {
    if (showBookingForm) {
      fetchAvailableCars();
    }
  }, [showBookingForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBooking(prev => ({ ...prev, [name]: value }));
  };

  // Validate date in dd/mm/yyyy format
  const isValidDate = (dateStr) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateStr)) return false;
    const [_, dd, mm, yyyy] = dateStr.match(regex);
    const date = new Date(`${yyyy}-${mm}-${dd}`);
    return (
      date.getFullYear() === Number(yyyy) &&
      date.getMonth() + 1 === Number(mm) &&
      date.getDate() === Number(dd)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBookingMessage('');
    setSubmitLoading(true);

    const { car_id, order_date, price, payment_mode } = newBooking;

    if (!car_id || !order_date || !price || !payment_mode) {
      setBookingMessage('Please fill all required fields');
      setSubmitLoading(false);
      return;
    }

    if (!isValidDate(order_date)) {
      setBookingMessage('Order date must be in dd/mm/yyyy format');
      setSubmitLoading(false);
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      setBookingMessage('Price must be a positive number');
      setSubmitLoading(false);
      return;
    }

    const selectedCar = cars.find(car => car.id === parseInt(car_id));
    if (!selectedCar) {
      setBookingMessage('Invalid car selection');
      setSubmitLoading(false);
      return;
    }

    try {
      // Convert dd/mm/yyyy to ISO string for backend
      const [dd, mm, yyyy] = order_date.split('/');
      const isoOrderDate = new Date(`${yyyy}-${mm}-${dd}`).toISOString().split('T')[0];

      const reservationData = {
        user_id: user.id,
        car_id: parseInt(car_id),
        order_date: isoOrderDate,
        total_price: parseFloat(price),
        payment_mode,
        status: 'pending',
      };

      await ReservationService.addReservation(reservationData);
      setBookingMessage('Booking request submitted successfully!');
      setNewBooking({ car_id: '', order_date: '', price: '', payment_mode: '' });
      fetchBookings();
      setShowBookingForm(false);
    } catch (err) {
      console.error('Error creating booking:', err);
      setBookingMessage(`Failed to create booking: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) return <p>Loading your bookings...</p>;
  if (error) return <p className="error-message">{error}</p>;

  return (
    <section className="car-bookings section" style={{ minHeight: '100%', width: '100%' }}>
      <div style={{ maxWidth: '100%', overflow: 'auto' }}>
        <h2>My Car Bookings</h2>

        <button className="booking-button" onClick={() => setShowBookingForm(!showBookingForm)}>
          {showBookingForm ? 'Cancel' : 'Book a Car'}
        </button>

        {showBookingForm && (
          <div className="booking-form-container">
            <h3>New Car Reservation</h3>
            <form onSubmit={handleSubmit} className="booking-form">
              {/* Car Select */}
              <div className="form-group">
                <label htmlFor="car_id">Select a Car:</label>
                {carsLoading ? (
                  <p>Loading available cars...</p>
                ) : (
                  <select
                    id="car_id"
                    name="car_id"
                    value={newBooking.car_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">-- Select a Car --</option>
                    {cars.map(car => (
                      <option key={car.id} value={car.id}>
                        {car.make} {car.model} 
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Order Date */}
              <div className="form-group">
                <label htmlFor="order_date">Order Date (dd/mm/yyyy):</label>
                <input
                  type="text"
                  id="order_date"
                  name="order_date"
                  placeholder="dd/mm/yyyy"
                  value={newBooking.order_date}
                  onChange={handleInputChange}
                  required
                  maxLength={10}
                />
              </div>

              {/* Price */}
              <div className="form-group">
                <label htmlFor="price">Price (₹):</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  min="1"
                  step="0.01"
                  value={newBooking.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {/* Mode of Payment */}
              <div className="form-group">
                <label htmlFor="payment_mode">Mode of Payment:</label>
                <select
                  id="payment_mode"
                  name="payment_mode"
                  value={newBooking.payment_mode}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">-- Select Payment Mode --</option>
                  <option value="cash">Cash</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="net_banking">Net Banking</option>
                  <option value="upi">UPI</option>
                </select>
              </div>

              <button type="submit" className="submit-button" disabled={submitLoading}>
                {submitLoading ? 'Submitting...' : 'Submit Reservation'}
              </button>

              {bookingMessage && (
                <p className={bookingMessage.includes('Failed') ? 'error-message' : 'success-message'}>
                  {bookingMessage}
                </p>
              )}
            </form>
          </div>
        )}

        <h3>Existing Car Bookings</h3>
        {bookings.length === 0 ? (
          <p>You haven't made any car bookings yet.</p>
        ) : (
          <ul className="bookings-list">
            {bookings.map(booking => (
              <li key={booking.id} className="booking-item">
                <p><strong>ID:</strong> {booking.id}</p>
                <p><strong>Car:</strong> {booking.car_name || `Car ID ${booking.car_id}`}</p>
                <p><strong>Status:</strong> {booking.status}</p>
                <p><strong>Order Date:</strong> {booking.order_date ? new Date(booking.order_date).toLocaleDateString() : '-'}</p>
                <p><strong>Price:</strong> ₹{booking.total_price}</p>
                <p><strong>Payment Mode:</strong> {booking.payment_mode || '-'}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default CarBookings;
