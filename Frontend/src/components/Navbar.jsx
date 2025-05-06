import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdNotificationsOutline } from "react-icons/io";
import "./Navbar.css";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);
  const { items: notifications } = useSelector((state) => state.notifications);

  return (
    <nav className={`navbar-container ${show ? "show" : ""}`}>
      <div className="navbar-content">
        {/* Logo */}
        <div className="navbar-logo">
          <img src="/logo.jpg" alt="Logo" />
          <div className="logo-text">
            <span className="title">NepApp</span>
            <span className="subtitle">Get your dream job</span>
          </div>
        </div>

        {/* Nav Links */}
        <div className={`navbar-links ${show ? "active" : ""}`}>
          <ul>
            <li><Link to="/" onClick={() => setShow(false)}>Home</Link></li>
            <li><Link to="/jobs" onClick={() => setShow(false)}>Find Gigs</Link></li>
            <li><Link to="/chat" onClick={() => setShow(false)}>Chat</Link></li>
            
            <li><Link to="/contact" onClick={() => setShow(false)}>Contact</Link></li>
          </ul>
        </div>

        {/* Right Side (Auth Buttons or Notifications) */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="notification-container">
                <IoMdNotificationsOutline
                  className="notification-icon"
                  size={24}
                  onClick={() => setDropdown(!dropdown)}
                />
                {notifications.length > 0 && (
                  <span className="notification-badge">{notifications.length}</span>
                )}
                {dropdown && (
                  <div className="notification-dropdown">
                    <h4>Notifications</h4>
                    {notifications.length === 0 ? (
                      <p>No notifications</p>
                    ) : (
                      notifications.map((note, index) => (
                        <p key={index} className="notification-item">🔔 {note.message}</p>
                      ))
                    )}
                  </div>
                )}
              </div>
              <Link to="/dashboard" className="btn-outline">Dashboard</Link>
             
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary">Register</Link>
              <Link to="/login" className="btn-outline">Login</Link>
            </>
          )}
        </div>

        {/* Hamburger */}
        <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
      </div>
    </nav>
  );
};

export default Navbar;
