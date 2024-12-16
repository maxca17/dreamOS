import React from 'react';
import { Link } from 'react-router-dom';
import '../css/constants/navbar.css';

const NavBar = () => {
  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        <div className="dream-logo">Dream Ventures</div>
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
          <li>
            <Link to="/portfoliocompanies">Portfolio Companies</Link>
          </li>
          <li>
            <Link to="/portfoliostats">Portfolio Stats</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default NavBar;
