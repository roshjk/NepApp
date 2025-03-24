import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import "./Navbar.css"; // Import the CSS
const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <nav className={`navbar ${show ? "show" : ""}`}>
      {/* Logo */}
      <div className="logo">
        <img src="/logo.jpg" alt="Company Logo" />
      </div>

      {/* Navigation Links */}
      <div className={`links ${show ? "active" : ""}`}>
        <ul>
          <li><Link to="/" onClick={() => setShow(false)}>HOME</Link></li>
          <li><Link to="/jobs" onClick={() => setShow(false)}>JOBS</Link></li>
          {isAuthenticated ? (
            <>
              <li><Link to="/dashboard" onClick={() => setShow(false)}>DASHBOARD</Link></li>
              <li><Link to="/chatHeader" onClick={() => setShow(false)}>CHAT</Link></li>
            </>
          ) : (
            <li><Link to="/login" onClick={() => setShow(false)}>LOGIN</Link></li>
          )}
        </ul>
      </div>

      {/* Hamburger Menu */}
      <GiHamburgerMenu className="hamburger" onClick={() => setShow(!show)} />
    </nav>
  );
};

export default Navbar;
