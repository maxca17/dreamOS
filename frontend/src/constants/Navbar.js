import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../css/constants/navbar.css';

const NavBar = () => {
  const location = useLocation();

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-logo">
        <div className="dream-logo">Dream Ventures</div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li className={location.pathname === "/dashboard" ? "active" : ""}>
            <Link to="/dashboard">Home</Link>
          </li>
          <li className={location.pathname === "/companies" ? "active" : ""}>
            <Link to="/companies">Companies</Link>
          </li>
          <li className={location.pathname === "/people" ? "active" : ""}>
            <Link to="/people">People</Link>
          </li>
          <li className={location.pathname === "/portfoliocompanies" ? "active" : ""}>
            <Link to="/portfoliocompanies">Portfolio Companies</Link>
          </li>
          <li className={location.pathname === "/portfoliostats" ? "active" : ""}>
            <Link to="/portfoliostats">Portfolio Stats</Link>
          </li>
          <li className={location.pathname === "/lps" ? "active" : ""}>
            <Link to="/lps">LPs</Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default NavBar;
