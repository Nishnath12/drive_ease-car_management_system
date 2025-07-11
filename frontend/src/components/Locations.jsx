// src/components/Locations.jsx
import React, { useState, useEffect } from 'react';
import LocationService from '../services/LocationService';
import '../styles/Locations.css'; // 👈 CSS path based on your folder structure

const Locations = ({ setActiveSection, setTestDriveForm, testDriveForm }) => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await LocationService.getAllLocations();
        const locs = response.data.map(loc => ({
          id: loc.id,
          name: loc.name,
          address: loc.address,
          phone: loc.phone,
          hours: loc.hours || '9 AM - 6 PM'
        }));
        setLocations(locs);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Error loading locations.');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  if (loading) return <div className="section-loading">Loading locations...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <section className="locations-section">
      <h2 className="section-title">Find a Dealer Near You</h2>
      <div className="locations-grid">
        {locations.length > 0 ? (
          locations.map(location => (
            <div className="location-card" key={location.id}>
              <div className="location-header">
                <h2 id="1">{location.name}</h2>
                <span className="location-id">Location id:{location.id}</span>
              </div>
              <p className="location-address">{location.address}</p>
              <p><strong>Phone:</strong> {location.phone}</p>
              <p><strong>Hours:</strong> {location.hours}</p>
              <div className="location-actions">
                <button
                  className="btn book-btn"
                  onClick={() => {
                    setActiveSection('testdrive');
                    setTestDriveForm(prev => ({
                      ...prev,
                      location: location.id.toString()
                    }));
                  }}
                >
                  Book Test Drive
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No locations available at this time.</p>
        )}
      </div>
    </section>
  );
};

export default Locations;
