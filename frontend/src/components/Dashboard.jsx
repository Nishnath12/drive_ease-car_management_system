// src/components/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import Sidebar from './Sidebar';
import FeaturedVehicles from './FeaturedVehicles';
import TestDrive from './TestDrive';
import Locations from './Locations';
import CarBookings from './CarBookings';
import SparePartBookings from './SparePartBookings';
import ManageLocations from './ManageLocations';
import ServiceBooking from './ServiceBookings';
import ApproveBookings from './ApproveBookings';
import PartsInventory from './PartsInventory';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [activeBookingTab, setActiveBookingTab] = useState('car');
  const [selectedCar, setSelectedCar] = useState(null);
  const [testDriveForm, setTestDriveForm] = useState({ car: '', location: '', date: '', time: '', comments: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setLoading(false);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  const toggleSidebar = () => setSidebarExpanded(prev => !prev);

  const canAccessSection = (section) => {
    if (!user) return false;
    const role = user.role;
    const access = {
      all: ['dashboard', 'featured', 'locations'],
      customer: ['testdrive', 'bookings', 'services'],
      employee: ['approve-bookings', 'parts', 'car-management'],
      supervisor: ['manage-locations']
    };

    return (
      access.all.includes(section) ||
      (role === 'customer' && access.customer.includes(section)) ||
      (['employee', 'supervisor'].includes(role) && access.employee.includes(section)) ||
      (role === 'supervisor' && access.supervisor.includes(section))
    );
  };

  const renderBookingTabs = () => (
    <div className="booking-tabs">
      <button className={`tab-button ${activeBookingTab === 'car' ? 'active' : ''}`} onClick={() => setActiveBookingTab('car')}>Car Bookings</button>
      <button className={`tab-button ${activeBookingTab === 'spareparts' ? 'active' : ''}`} onClick={() => setActiveBookingTab('spareparts')}>Spare Parts Orders</button>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return (
          <div className="dashboard-welcome realistic">
            <div className="hero-section">
              <img
                src="https://media.cnn.com/api/v1/images/stellar/prod/161217142430-2017-cars-ferrari-1.jpg?q=w_1600,h_900,x_0,y_0,c_fill"
                alt="Luxury Car"
                className="hero-image"
              />
              <div className="hero-text">
                <h1 className="quote">"Drive your dreams. Control your journey."</h1>
                <p>Welcome to DriveEase, where innovation meets performance.</p>
              </div>
            </div>

            <section className="features-intro">
              <h2>What You Can Do</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <img 
                    src="https://static.vecteezy.com/system/resources/previews/060/518/882/non_2x/retro-car-in-classic-silhouette-form-vector.jpg" 
                    alt="Explore Cars"
                    style={{ width: 26, height: 26 }} 
                  />
                  Explore New Cars
                </div>
                <div className="feature-card">📅 Book Test Drives</div>
                <div className="feature-card">🛠 Schedule Services</div>
                <div className="feature-card">📦 Manage Spare Parts</div>
                <div className="feature-card">📍 Locate Nearby Dealers</div>
                <div className="feature-card">📊 Track All Bookings</div>
              </div>
            </section>

            <footer className="dashboard-footer">
              <p>&copy; 2025 DriveEase. Crafted with passion and precision.</p>
            </footer>
          </div>
        );

      case 'featured':
        return <FeaturedVehicles user={user} setActiveSection={setActiveSection} setSelectedCar={setSelectedCar} />;

      case 'testdrive':
        return canAccessSection('testdrive') && <TestDrive user={user} selectedCar={selectedCar} />;

      case 'locations':
        return <Locations locations={[]} setTestDriveForm={setTestDriveForm} testDriveForm={testDriveForm} />;

      case 'bookings':
        return canAccessSection('bookings') && (
          <>
            {renderBookingTabs()}
            {activeBookingTab === 'car' && <CarBookings user={user} selectedCar={selectedCar} />}
            {activeBookingTab === 'spareparts' && <SparePartBookings user={user} />}
          </>
        );

      case 'services':
        return canAccessSection('services') && <ServiceBooking user={user} />;

      case 'approve-bookings':
        return canAccessSection('approve-bookings') && <ApproveBookings />;

      case 'parts':
        return canAccessSection('parts') && <PartsInventory />;

      case 'car-management':
        return canAccessSection('car-management') && <FeaturedVehicles user={user} setActiveSection={setActiveSection} isManageMode={true} />;

      case 'manage-locations':
        return canAccessSection('manage-locations') && <ManageLocations />;

      default:
        return <p>Section not available.</p>;
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        user={user}
        handleLogout={handleLogout}
        sidebarExpanded={sidebarExpanded}
        toggleSidebar={toggleSidebar}
      />
      <main className={`main-content ${sidebarExpanded ? '' : 'expanded'}`}>
        {error ? <div className="error-message">{error}</div> : renderSection()}
      </main>
    </div>
  );
};

export default Dashboard;
