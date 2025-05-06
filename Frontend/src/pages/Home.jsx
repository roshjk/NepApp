import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./Home.css"; // Update CSS based on layout

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  if (isAuthenticated) return null; // Only show for unauthenticated users

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-left">
          <h1>Connect Students<br />with Business Opportunities</h1>
          <p>Find part-time jobs and project-based work that fits your schedule and skills.</p>
          <div className="cta-buttons">
            <Link to="/register/student" className="btn student">I'm a Student</Link>
            <Link to="/register/business" className="btn business">I'm a Business</Link>
          </div>
        </div>
       
      </section>

      {/* How NepApp Works */}
      <section className="how-it-works">
        <h2>How NepApp Works</h2>
        <div className="steps">
          <div className="step">
           
            <h3>Create Profile</h3>
            <p>Sign up and create your profile with skills and experience.</p>
          </div>
          <div className="step">
           
            <h3>Find Opportunities</h3>
            <p>Browse and apply for relevant jobs and projects.</p>
          </div>
          <div className="step">
       
            <h3>Connect & Earn</h3>
            <p>Get hired and receive payments through secure local gateways.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stat-box"><h3>5000+</h3><p>Active Students</p></div>
        <div className="stat-box"><h3>1000+</h3><p>Businesses</p></div>
        <div className="stat-box"><h3>2500+</h3><p>Jobs Posted</p></div>
        <div className="stat-box"><h3>NPR 10M+</h3><p>Paid to Students</p></div>
      </section>

      {/* Payment Partners */}
      <section className="payment-partners">
        <h2>Trusted Payment Partners</h2>
        <img src="/images/esewa-logo.png" alt="eSewa" className="partner-logo" />
      </section>

      
    </div>
  );
};

export default Home;
