import React from 'react';
import { LayoutDashboard, MapPin, CarFront, CalendarDays, Wrench, ClipboardCheck, Package, Settings2, ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import logo from '../assets/drivee.jpg';
import '../styles/Sidebar.css';

const commonItems = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'featured', label: 'Vehicles', icon: CarFront },
  { id: 'locations', label: 'Showrooms', icon: MapPin }
];
const customerItems = [
  { id: 'testdrive', label: 'Test drives', icon: CalendarDays },
  { id: 'bookings', label: 'My bookings', icon: ClipboardCheck },
  { id: 'services', label: 'Service', icon: Wrench }
];
const employeeItems = [
  { id: 'approve-bookings', label: 'Booking queue', icon: ClipboardCheck },
  { id: 'car-management', label: 'Vehicle management', icon: CarFront },
  { id: 'parts', label: 'Parts inventory', icon: Package }
];
const supervisorItems = [{ id: 'manage-locations', label: 'Manage showrooms', icon: Settings2 }];

const Sidebar = ({ activeSection, setActiveSection, user, handleLogout, sidebarExpanded = true, toggleSidebar }) => {
  const role = String(user?.role || '').toLowerCase();
  const items = [...commonItems, ...(role === 'customer' ? customerItems : []), ...(role === 'employee' || role === 'supervisor' ? employeeItems : []), ...(role === 'supervisor' ? supervisorItems : [])];
  const initials = (user?.name || 'User').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-brand">
        <img src={logo} alt="DriveEase" className="sidebar-logo" />
        {sidebarExpanded && <div className="brand-copy"><strong>DriveEase</strong><span>Mobility platform</span></div>}
        <button className="sidebar-toggle" onClick={toggleSidebar} aria-label={sidebarExpanded ? 'Collapse sidebar' : 'Expand sidebar'}>
          {sidebarExpanded ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
        </button>
      </div>
      <div className="sidebar-profile">
        <div className="avatar">{initials}</div>
        {sidebarExpanded && <div className="profile-copy"><strong>{user?.name || 'User'}</strong><span>{role || 'customer'}</span></div>}
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <span className="nav-caption">Workspace</span>
        {items.map(({ id, label, icon: Icon }) => (
          <button key={id} className={`menu-item ${activeSection === id ? 'active' : ''}`} onClick={() => setActiveSection(id)} title={!sidebarExpanded ? label : undefined}>
            <Icon size={19} strokeWidth={1.9} /><span className="menu-label">{sidebarExpanded && label}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-footer">
        <button className="logout-btn" onClick={handleLogout} title={!sidebarExpanded ? 'Sign out' : undefined}><LogOut size={18} />{sidebarExpanded && <span>Sign out</span>}</button>
        {sidebarExpanded && <small>DriveEase • Secure workspace</small>}
      </div>
    </aside>
  );
};
export default Sidebar;
