import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../css/constants/navbar.css';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="navbar-container">
      <div className="navbar-header">
        <h1 className="navbar-title">Dream Ventures</h1>
      </div>
      <div className="navbar-divider"></div>
      <nav className="navbar-links">
        <Link className="navbar-link" to="/dashboard">Home</Link>
        <Link className="navbar-link" to="/companies">Companies</Link>
        <Link className="navbar-link" to="/people">People</Link>
      </nav>
      <button className="navbar-logout-button" onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Navbar;
