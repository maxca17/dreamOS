import React from 'react';
import '../css/constants/navbar.css';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        <div className="crown-icon">👑</div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className="active">
            <Link to="/dashboard">Home</Link>
          </li>
          <li>
            <Link to="/companies">Companies</Link>
          </li>
          <li>
            <Link to="/people">People</Link>
          </li>
          <li>Lists</li>
          <li>Events</li>
          <li>Scouts</li>
        </ul>
      </nav>
    </aside>
  );
};

export default NavBar;
