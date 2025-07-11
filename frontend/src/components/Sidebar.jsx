import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/drivee.jpg';
import '../styles/Sidebar.css';


const Sidebar = ({
  activeSection,
  setActiveSection,
  user,
  handleLogout
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  // Define menu items based on user role
  const getMenuItems = () => {
    const commonItems = [
      {
        id: 'dashboard',
        label: 'Dashboard',
        icon: (
          <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M13 5v6h6" />
          </svg>
        )
      },
      {
        id: 'locations',
        label: 'Showrooms',
        icon: (
          <svg className="w-6 h-6 text-gray-800 dark:text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.8 13.938h-.011a7 7 0 1 0-11.464.144h-.016l.14.171c.1.127.2.251.3.371L12 21l5.13-6.248c.194-.209.374-.429.54-.659l.13-.155Z" />
          </svg>
        )
      }
    ];

    console.log('User object:', user);


    const customerItems = [
      { id: 'featured', label: 'Featured Vehicles', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M15.84 4a3 3 0 0 1 2.499 1.34l.105.172L20.438 9H21.6a.4.4 0 0 1 .392.32L22 9.4v.475a.8.8 0 0 1-.502.743l-.128.04a5 5 0 0 1 .484 2.502l-.027.287l-.725 5.801a2 2 0 0 1-1.827 1.746l-.158.006H18a2 2 0 0 1-1.995-1.85L16 19H8a2 2 0 0 1-1.85 1.995L6 21H4.883a2 2 0 0 1-1.96-1.596l-.025-.156l-.725-5.8a5 5 0 0 1 .34-2.528l.117-.263l-.024-.005a.8.8 0 0 1-.599-.668L2 9.875V9.4a.4.4 0 0 1 .32-.392L2.4 9h1.163l1.993-3.488A3 3 0 0 1 7.96 4.007L8.16 4h7.68Zm3.92 8.036a2.953 2.953 0 0 1-2 .957l-.206.007H6.446a2.96 2.96 0 0 1-2.205-.964a3 3 0 0 0-.103.928l.02.235L4.883 19H6v-1a1 1 0 0 1 .883-.993L7 17h10a1 1 0 0 1 .993.883L18 18v1h1.117l.725-5.801c.05-.392.02-.787-.083-1.163ZM5.737 13.898L8.48 15.38c.373.202.218.769-.206.752l-2.314-.093A1 1 0 0 1 5 15.04v-.7a.5.5 0 0 1 .738-.44Zm13.262.44v.701a1 1 0 0 1-.96 1l-2.314.092c-.424.017-.58-.55-.206-.752l2.742-1.48a.5.5 0 0 1 .738.44ZM15.84 6H8.16a1 1 0 0 0-.868.504l-1.714 3A1 1 0 0 0 6.446 11h11.108a1 1 0 0 0 .868-1.496l-1.714-3A1 1 0 0 0 15.839 6Z"/></g></svg> },
      { id: 'testdrive', label: 'Schedule Test Drive', icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 512 512"><path fill="currentColor" d="M331.188 16.72c-40.712-.002-81.41 15.408-112.438 46.436c-43.866 43.864-56.798 107-38.813 162.25L17.03 388.312v25.75l170.22-170.218c2.75 5.84 5.847 11.555 9.344 17.094L17.03 440.5v51.78H64l181.875-181.874a158.498 158.498 0 0 0 17.03 9.438L90.44 492.28h27.03l164.75-164.75c55.182 17.85 118.21 4.884 162-38.905c41.415-41.414 54.998-99.91 41.282-152.813L380.22 241.125l-90.033-23.938l-23.968-90.03L371.53 21.843a161.459 161.459 0 0 0-40.342-5.125z"/></svg> },
      { id: 'bookings', label: 'My Bookings', icon:<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M5 5a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1h1a1 1 0 0 0 1-1 1 1 0 1 1 2 0 1 1 0 0 0 1 1 2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a2 2 0 0 1 2-2ZM3 19v-7a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Zm6.01-6a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm-10 4a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm6 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0Zm2 0a1 1 0 1 1 2 0 1 1 0 0 1-2 0Z" clip-rule="evenodd"/>
</svg>
 },
      { id: 'services', label: 'Book a Service', icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16"><path fill="currentColor" d="m8 10.8l.9-.8l-.9-.9l5.7-5.7l1.2-.4L16 .8l-.7-.7l-2.3 1l-.5 1.2L6.9 8L6 7.1l-.8.9s.8.6-.1 1.5c-.5.5-1.3-.1-2.8 1.4L.2 13s-.6 1 .6 2.2s2.2.6 2.2.6l2.1-2.1c1.4-1.4.9-2.3 1.3-2.7c.9-.9 1.6-.2 1.6-.2zm-3.1-.4l.7.7l-3.8 3.8l-.7-.7z"/></svg> }
    ];

    const employeeItems = [
      { id: 'approve-bookings', label: 'Manage Bookings', icon:<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m4.988 19.012 5.41-5.41m2.366-6.424 4.058 4.058-2.03 5.41L5.3 20 4 18.701l3.355-9.494 5.41-2.029Zm4.626 4.625L12.197 6.61 14.807 4 20 9.194l-2.61 2.61Z"/>
</svg>

 },
      { id: 'car-management', label: 'Manage Vehicles',icon:<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z"/><path fill="currentColor" d="M15.84 4a3 3 0 0 1 2.499 1.34l.105.172L20.438 9H21.6a.4.4 0 0 1 .392.32L22 9.4v.475a.8.8 0 0 1-.502.743l-.128.04a5 5 0 0 1 .484 2.502l-.027.287l-.725 5.801a2 2 0 0 1-1.827 1.746l-.158.006H18a2 2 0 0 1-1.995-1.85L16 19H8a2 2 0 0 1-1.85 1.995L6 21H4.883a2 2 0 0 1-1.96-1.596l-.025-.156l-.725-5.8a5 5 0 0 1 .34-2.528l.117-.263l-.024-.005a.8.8 0 0 1-.599-.668L2 9.875V9.4a.4.4 0 0 1 .32-.392L2.4 9h1.163l1.993-3.488A3 3 0 0 1 7.96 4.007L8.16 4h7.68Zm3.92 8.036a2.953 2.953 0 0 1-2 .957l-.206.007H6.446a2.96 2.96 0 0 1-2.205-.964a3 3 0 0 0-.103.928l.02.235L4.883 19H6v-1a1 1 0 0 1 .883-.993L7 17h10a1 1 0 0 1 .993.883L18 18v1h1.117l.725-5.801c.05-.392.02-.787-.083-1.163ZM5.737 13.898L8.48 15.38c.373.202.218.769-.206.752l-2.314-.093A1 1 0 0 1 5 15.04v-.7a.5.5 0 0 1 .738-.44Zm13.262.44v.701a1 1 0 0 1-.96 1l-2.314.092c-.424.017-.58-.55-.206-.752l2.742-1.48a.5.5 0 0 1 .738.44ZM15.84 6H8.16a1 1 0 0 0-.868.504l-1.714 3A1 1 0 0 0 6.446 11h11.108a1 1 0 0 0 .868-1.496l-1.714-3A1 1 0 0 0 15.839 6Z"/></g></svg> },
      { id: 'parts', label: 'Parts Inventory', icon:<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M7.58209 8.96025 9.8136 11.1917l-1.61782 1.6178c-1.08305-.1811-2.23623.1454-3.07364.9828-1.1208 1.1208-1.32697 2.8069-.62368 4.1363.14842.2806.42122.474.73509.5213.06726.0101.1347.0133.20136.0098-.00351.0666-.00036.1341.00977.2013.04724.3139.24069.5867.52125.7351 1.32944.7033 3.01552.4971 4.13627-.6237.8375-.8374 1.1639-1.9906.9829-3.0736l4.8107-4.8108c1.0831.1811 2.2363-.1454 3.0737-.9828 1.1208-1.1208 1.3269-2.80688.6237-4.13632-.1485-.28056-.4213-.474-.7351-.52125-.0673-.01012-.1347-.01327-.2014-.00977.0035-.06666.0004-.13409-.0098-.20136-.0472-.31386-.2406-.58666-.5212-.73508-1.3294-.70329-3.0155-.49713-4.1363.62367-.8374.83741-1.1639 1.9906-.9828 3.07365l-1.7788 1.77875-2.23152-2.23148-1.41419 1.41424Zm1.31056-3.1394c-.04235-.32684-.24303-.61183-.53647-.76186l-1.98183-1.0133c-.38619-.19746-.85564-.12345-1.16234.18326l-.86321.8632c-.3067.3067-.38072.77616-.18326 1.16235l1.0133 1.98182c.15004.29345.43503.49412.76187.53647l1.1127.14418c.3076.03985.61628-.06528.8356-.28461l.86321-.8632c.21932-.21932.32446-.52801.2846-.83561l-.14417-1.1127ZM19.4448 16.4052l-3.1186-3.1187c-.7811-.781-2.0474-.781-2.8285 0l-.1719.172c-.7811.781-.7811 2.0474 0 2.8284l3.1186 3.1187c.7811.781 2.0474.781 2.8285 0l.1719-.172c.7811-.781.7811-2.0474 0-2.8284Z"/>
</svg>
 }
    ];

    const supervisorItems = [
      { id: 'manage-locations', label: 'Manage Locations', icon:<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
  <path fill-rule="evenodd" d="M5.535 7.677c.313-.98.687-2.023.926-2.677H17.46c.253.63.646 1.64.977 2.61.166.487.312.953.416 1.347.11.42.148.675.148.779 0 .18-.032.355-.09.515-.06.161-.144.3-.243.412-.1.111-.21.192-.324.245a.809.809 0 0 1-.686 0 1.004 1.004 0 0 1-.324-.245c-.1-.112-.183-.25-.242-.412a1.473 1.473 0 0 1-.091-.515 1 1 0 1 0-2 0 1.4 1.4 0 0 1-.333.927.896.896 0 0 1-.667.323.896.896 0 0 1-.667-.323A1.401 1.401 0 0 1 13 9.736a1 1 0 1 0-2 0 1.4 1.4 0 0 1-.333.927.896.896 0 0 1-.667.323.896.896 0 0 1-.667-.323A1.4 1.4 0 0 1 9 9.74v-.008a1 1 0 0 0-2 .003v.008a1.504 1.504 0 0 1-.18.712 1.22 1.22 0 0 1-.146.209l-.007.007a1.01 1.01 0 0 1-.325.248.82.82 0 0 1-.316.08.973.973 0 0 1-.563-.256 1.224 1.224 0 0 1-.102-.103A1.518 1.518 0 0 1 5 9.724v-.006a2.543 2.543 0 0 1 .029-.207c.024-.132.06-.296.11-.49.098-.385.237-.85.395-1.344ZM4 12.112a3.521 3.521 0 0 1-1-2.376c0-.349.098-.8.202-1.208.112-.441.264-.95.428-1.46.327-1.024.715-2.104.958-2.767A1.985 1.985 0 0 1 6.456 3h11.01c.803 0 1.539.481 1.844 1.243.258.641.67 1.697 1.019 2.72a22.3 22.3 0 0 1 .457 1.487c.114.433.214.903.214 1.286 0 .412-.072.821-.214 1.207A3.288 3.288 0 0 1 20 12.16V19a2 2 0 0 1-2 2h-6a1 1 0 0 1-1-1v-4H8v4a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2v-6.888ZM13 15a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2Z" clip-rule="evenodd"/>
</svg>

 }
    ];

    let roleSpecificItems = [];
    if (user) {
      if (user.role === 'customer') roleSpecificItems = customerItems;
      else if (user.role === 'employee') roleSpecificItems = employeeItems;
      else if (user.role === 'supervisor') roleSpecificItems = [...employeeItems, ...supervisorItems];
    }

    return [...commonItems, ...roleSpecificItems];
  };

  const getUserPhoto = () =>
    user?.photoURL || 'https://webstockreview.net/images/male-clipart-professional-man-3.jpg';

 const getDisplayName = () => {
  if (!user) return 'Guest';
  // Prefer name, then email, fallback to 'User'
  return user.name || user.email || 'User';
};

  return (
    <aside
      className={`sidebar ${sidebarExpanded ? 'expanded' : 'collapsed'}`}
      onMouseEnter={() => setSidebarExpanded(true)}
      onMouseLeave={() => setSidebarExpanded(false)}
      aria-label="Sidebar Navigation"
    >
      <div className="sidebar-header">
        {sidebarExpanded && (
          <div className="logo-container">
            <img src={logo} alt="DriveEase Logo" className="logo" />
            <h2 className="logo-text">DriveEase</h2>
          </div>
        )}
      </div>

      {user && (
        <div className="user-info">
          <div className="avatar-container">
            <img
              src={getUserPhoto()}
              alt="User avatar"
              className="user-avatar"
            />
            {sidebarExpanded && (
              <div className="user-details">
                <span className="user-name">{getDisplayName()}</span>
                <span className="role-badge">
                  {user.role === 'customer'
                    ? 'Customer'
                    : user.role === 'employee'
                    ? 'Employee'
                    : user.role === 'supervisor'
                    ? 'Supervisor'
                    : 'User'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      <nav className="menu-nav">
        <ul>
          {getMenuItems().map(item => (
            <li key={item.id}>
              <Link
                to="#"
                className={`menu-item ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => setActiveSection(item.id)}
                title={!sidebarExpanded ? item.label : ''}
              >
                <span className="menu-icon">{item.icon}</span>
                {sidebarExpanded && <span className="menu-label">{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button onClick={handleLogout} className="logout-btn" title="Sign Out">
          <span className="logout-icon"><svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H8m12 0-4 4m4-4-4-4M9 4H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2"/>
</svg>
</span>
          {sidebarExpanded && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
