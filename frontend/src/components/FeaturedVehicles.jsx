import React, { useState, useEffect } from 'react';
import CarService from '../services/CarService';
import '../styles/FeaturedVehicles.css';

const FeaturedVehicles = ({ setActiveSection, user, setSelectedCar, isManageMode = false }) => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCarForm, setShowAddCarForm] = useState(false);
  const [newCar, setNewCar] = useState({
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    price: '',
    availability: true,
    image: ''
  });

  const canManageCars = user && ['supervisor', 'employee'].includes(user.role);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await CarService.getAllCars();
      const cars = response.data.map(car => ({
        id: car.id,
        name: car.model,
        brand: car.brand,
        year: car.year,
        price: car.price,
        formattedPrice: `₹${car.price.toLocaleString()}`,
        image: car.image || '../assets/drivee.jpg',
        availability: car.availability
      }));
      setFeaturedCars(cars);
    } catch (err) {
      console.error('Error fetching cars:', err);
      setError('Error loading vehicles.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewCar(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddCar = async (e) => {
    e.preventDefault();
    try {
      await CarService.addCar({
        ...newCar,
        price: Number(newCar.price),
        year: Number(newCar.year)
      });
      setNewCar({
        model: '',
        brand: '',
        year: new Date().getFullYear(),
        price: '',
        availability: true,
        image: ''||'../assets/drivee.jpg',
      });
      setShowAddCarForm(false);
      fetchCars();
    } catch (err) {
      console.error('Error adding car:', err);
      setError('Failed to add vehicle.');
    }
  };

  const handleDeleteCar = async (carId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await CarService.deleteCar(carId);
        fetchCars();
      } catch (err) {
        console.error('Error deleting car:', err);
        setError('Failed to delete vehicle.');
      }
    }
  };

  const handleSelectCar = (car, targetSection) => {
    if (setSelectedCar) setSelectedCar(car);
    setActiveSection(targetSection);
  };

  if (loading) return <div className="section-loading">Loading vehicles...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <section className="featured-vehicles">
      <div className="fv-header">
        <h2>{isManageMode ? 'Manage Vehicles' : 'Available Models'}</h2>
        {canManageCars && (
          <button className="btn btn-primary" onClick={() => setShowAddCarForm(!showAddCarForm)}>
            {showAddCarForm ? 'Cancel' : 'Add Vehicle'}
          </button>
        )}
      </div>

      {showAddCarForm && canManageCars && (
        <form className="fv-form" onSubmit={handleAddCar}>
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input type="text" id="brand" name="brand" value={newCar.brand} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input type="text" id="model" name="model" value={newCar.model} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input type="number" id="year" name="year" min="1900" max={new Date().getFullYear() + 1} value={newCar.year} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price (₹)</label>
            <input type="number" id="price" name="price" min="0" step="0.01" value={newCar.price} onChange={handleInputChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input type="text" id="image" name="image" value={newCar.image} onChange={handleInputChange} placeholder="https://example.com/car.jpg" />
          </div>
          <div className="form-group checkbox">
            <label htmlFor="availability">Available</label>
            <input type="checkbox" id="availability" name="availability" checked={newCar.availability} onChange={handleInputChange} />
          </div>
          <button type="submit" className="btn btn-success">Add Vehicle</button>
        </form>
      )}

      <div className="fv-grid">
        {featuredCars.length > 0 ? (
          featuredCars.map(car => (
            <div className="fv-card" key={car.id}>
              <img className="fv-image" src={car.image} alt={`${car.brand} ${car.name}`} />
              <div className="fv-details">
                <h3>{car.brand} {car.name}</h3>
                <div className="fv-meta">
                  <span>{car.year}</span>
                  <span>{car.formattedPrice}</span>
                </div>
                <span className={`fv-availability ${car.availability ? 'available' : 'unavailable'}`}>
                  {car.availability ? 'Available' : 'Unavailable'}
                </span>
                <div className="fv-actions">
                  {user?.role === 'customer' && car.availability && (
                    <button className="btn test-drive-btn" onClick={() => handleSelectCar(car, 'testdrive')}>
                      Book Test Drive
                    </button>
                  )}
                  {user?.role === 'customer' && (
                    <button className="btn book-car-btn" onClick={() => handleSelectCar(car, 'bookings')}>
                      Book Now
                    </button>
                  )}
                  {canManageCars && (
                    <button className="btn edit-btn" onClick={() => alert('Edit functionality to be implemented')}>
                      Edit
                    </button>
                  )}
                  {user?.role === 'supervisor' && (
                    <button className="btn delete-btn" onClick={() => handleDeleteCar(car.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No vehicles currently available. Please check back later.</p>
        )}
      </div>
    </section>
  );
};

export default FeaturedVehicles;
