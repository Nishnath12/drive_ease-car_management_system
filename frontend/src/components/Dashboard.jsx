import React, { useEffect, useMemo, useState } from 'react';
import { CalendarDays, CarFront, CheckCircle2, ChevronRight, MapPin, Package, Sparkles, Wrench } from 'lucide-react';
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
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeBookingTab, setActiveBookingTab] = useState('car');
  const [selectedCar, setSelectedCar] = useState(null);
  const [testDriveForm, setTestDriveForm] = useState({ car: '', location: '', date: '', time: '', comments: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (currentUser) setUser(currentUser); else navigate('/login', { replace: true });
    setLoading(false);
  }, [navigate]);

  const role = String(user?.role || 'customer').toLowerCase();
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  const firstName = (user?.name || 'there').split(' ')[0];
  const canAccessSection = (section) => {
    const access = {
      all: ['dashboard', 'featured', 'locations'],
      customer: ['testdrive', 'bookings', 'services'],
      employee: ['approve-bookings', 'parts', 'car-management'],
      supervisor: ['manage-locations']
    };
    return access.all.includes(section) || (role === 'customer' && access.customer.includes(section)) || ((role === 'employee' || role === 'supervisor') && access.employee.includes(section)) || (role === 'supervisor' && access.supervisor.includes(section));
  };

  const quickActions = useMemo(() => {
    if (role === 'customer') return [
      { id: 'featured', icon: CarFront, title: 'Explore vehicles', text: 'Browse available models and pricing' },
      { id: 'testdrive', icon: CalendarDays, title: 'Book a test drive', text: 'Choose a vehicle, time and showroom' },
      { id: 'services', icon: Wrench, title: 'Schedule service', text: 'Keep your vehicle running at its best' },
      { id: 'locations', icon: MapPin, title: 'Find a showroom', text: 'View locations and contact details' }
    ];
    return [
      { id: 'approve-bookings', icon: CheckCircle2, title: 'Booking queue', text: 'Review requests that need attention' },
      { id: 'car-management', icon: CarFront, title: 'Vehicle management', text: 'Keep the vehicle catalogue current' },
      { id: 'parts', icon: Package, title: 'Parts inventory', text: 'Monitor parts and stock levels' },
      { id: role === 'supervisor' ? 'manage-locations' : 'locations', icon: MapPin, title: role === 'supervisor' ? 'Manage showrooms' : 'Showrooms', text: 'Keep location information accurate' }
    ];
  }, [role]);

  const handleLogout = () => { AuthService.logout(); navigate('/login', { replace: true }); };

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return (
        <div className="dashboard-home">
          <section className="welcome-hero">
            <div className="hero-orb orb-one" /><div className="hero-orb orb-two" />
            <div className="hero-content">
              <div className="eyebrow"><Sparkles size={14} /> DriveEase workspace</div>
              <h1>Good to see you, {firstName}.</h1>
              <p>{role === 'customer' ? 'Everything you need to explore, book and maintain your DriveEase journey — in one place.' : 'Your operational workspace is ready. Review priorities and keep the dealership moving.'}</p>
              <button className="hero-primary" onClick={() => setActiveSection(quickActions[0].id)}>{quickActions[0].title}<ChevronRight size={17} /></button>
            </div>
            <div className="hero-stat"><span>Account</span><strong>{roleLabel}</strong><small>DriveEase member</small></div>
          </section>

          <section className="section-heading"><div><span className="section-kicker">Quick actions</span><h2>What would you like to do?</h2></div></section>
          <section className="quick-grid">
            {quickActions.map(({ id, icon: Icon, title, text }) => (
              <button key={id} className="quick-card" onClick={() => setActiveSection(id)}>
                <span className="quick-icon"><Icon size={20} /></span><span className="quick-copy"><strong>{title}</strong><small>{text}</small></span><ChevronRight className="quick-arrow" size={18} />
              </button>
            ))}
          </section>

          <section className="trust-strip"><div><CheckCircle2 size={19} /><span><strong>Secure access</strong><small>Role-based workspace</small></span></div><div><CarFront size={19} /><span><strong>Live catalogue</strong><small>Availability from your system</small></span></div><div><MapPin size={19} /><span><strong>Real-world support</strong><small>Showrooms, service and bookings</small></span></div></section>
        </div>
      );
      case 'featured': return <FeaturedVehicles user={user} setActiveSection={setActiveSection} setSelectedCar={setSelectedCar} />;
      case 'testdrive': return canAccessSection('testdrive') ? <TestDrive user={user} selectedCar={selectedCar} /> : null;
      case 'locations': return <Locations locations={[]} setTestDriveForm={setTestDriveForm} testDriveForm={testDriveForm} />;
      case 'bookings': return canAccessSection('bookings') && <div className="dashboard-module"><div className="booking-tabs"><button className={activeBookingTab === 'car' ? 'active' : ''} onClick={() => setActiveBookingTab('car')}>Car bookings</button><button className={activeBookingTab === 'spareparts' ? 'active' : ''} onClick={() => setActiveBookingTab('spareparts')}>Parts orders</button></div>{activeBookingTab === 'car' ? <CarBookings user={user} selectedCar={selectedCar} /> : <SparePartBookings user={user} />}</div>;
      case 'services': return canAccessSection('services') ? <ServiceBooking user={user} /> : null;
      case 'approve-bookings': return canAccessSection('approve-bookings') ? <ApproveBookings /> : null;
      case 'parts': return canAccessSection('parts') ? <PartsInventory /> : null;
      case 'car-management': return canAccessSection('car-management') ? <FeaturedVehicles user={user} setActiveSection={setActiveSection} isManageMode /> : null;
      case 'manage-locations': return canAccessSection('manage-locations') ? <ManageLocations /> : null;
      default: return <div className="empty-state"><h2>Section unavailable</h2><p>Choose another workspace area from the navigation.</p></div>;
    }
  };

  if (loading) return <div className="loading-container"><div className="loader" /><p>Preparing your workspace…</p></div>;
  return (
    <div className="dashboard-container">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} user={user} handleLogout={handleLogout} sidebarExpanded={sidebarExpanded} toggleSidebar={() => setSidebarExpanded(prev => !prev)} />
      <main className={`main-content ${sidebarExpanded ? 'with-sidebar' : 'sidebar-collapsed'}`}>
        <header className="topbar"><div><span className="topbar-kicker">{activeSection === 'dashboard' ? 'Overview' : 'DriveEase workspace'}</span><h2>{activeSection === 'dashboard' ? 'Dashboard' : activeSection.replaceAll('-', ' ')}</h2></div><div className="topbar-user"><span className="status-dot" /><span>{user?.name || 'User'}</span><strong>{roleLabel}</strong></div></header>
        <div className="content-shell">{renderSection()}</div>
      </main>
    </div>
  );
};
export default Dashboard;
