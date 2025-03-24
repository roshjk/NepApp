import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaSquareXTwitter,
  FaSquareInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <>
      <footer
        style={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: "1200px", // Container width for the entire footer
          margin: "0 auto", // Center the footer
          padding: "2rem",
          background: "#f9f9f9", // Light background
        }}
      >
        {/* Logo Section */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src="/logo.jpg"
            alt="logo"
            style={{ width: "100px", height: "auto" }}
          />
        </div>

        {/* Support Section */}
        <div>
          <h4 style={{ marginBottom: "1rem", color: "#333" }}>Support</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ margin: "0.5rem 0", color: "#666" }}>
              Kathmandu, Nepal
            </li>
            <li style={{ margin: "0.5rem 0", color: "#666" }}>
              NepApp@gmail.com
            </li>
            <li style={{ margin: "0.5rem 0", color: "#666" }}>
              +977 9845632133
            </li>
          </ul>
        </div>

        {/* Quick Links Section */}
        <div>
          <h4 style={{ marginBottom: "1rem", color: "#333" }}>Quick Links</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ margin: "0.5rem 0" }}>
              <Link to="/" style={{ textDecoration: "none", color: "#007bff" }}>
                Home
              </Link>
            </li>
            <li style={{ margin: "0.5rem 0" }}>
              <Link
                to="/jobs"
                style={{ textDecoration: "none", color: "#007bff" }}
              >
                Jobs
              </Link>
            </li>
            {isAuthenticated && (
              <li style={{ margin: "0.5rem 0" }}>
                <Link
                  to="/dashboard"
                  style={{ textDecoration: "none", color: "#007bff" }}
                >
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Follow Us Section (Right-Aligned Container) */}
        <div
          style={{
            maxWidth: "24rem",
            width: "100%",
            background: "rgba(255, 255, 255, 0.95)",
            padding: "1rem",
            borderRadius: "0.75rem",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
            marginLeft: "auto", // Pushes this section to the right
          }}
        >
          <h4 style={{ marginBottom: "1rem", color: "#333" }}>Follow Us</h4>
          <ul style={{ listStyle: "none", padding: 0 }}>
            <li style={{ margin: "0.5rem 0" }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  color: "#333",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>
                  <FaSquareXTwitter />
                </span>
                <span>Twitter (X)</span>
              </Link>
            </li>
            <li style={{ margin: "0.5rem 0" }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  color: "#333",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>
                  <FaSquareInstagram />
                </span>
                <span>Instagram</span>
              </Link>
            </li>
            <li style={{ margin: "0.5rem 0" }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  color: "#333",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>
                  <FaYoutube />
                </span>
                <span>Youtube</span>
              </Link>
            </li>
            <li style={{ margin: "0.5rem 0" }}>
              <Link
                to="/"
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  color: "#333",
                }}
              >
                <span style={{ marginRight: "0.5rem" }}>
                  <FaLinkedin />
                </span>
                <span>LinkedIn</span>
              </Link>
            </li>
          </ul>
        </div>
      </footer>

      {/* Copyright Section */}
      <div
        className="copyright"
        style={{
          textAlign: "center",
          padding: "1rem",
          background: "#f1f1f1",
          color: "#666",
        }}
      >
        © Copyright 2024. All Rights Reserved By NepApp
      </div>
    </>
  );
};

export default Footer;