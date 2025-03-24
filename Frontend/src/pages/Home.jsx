import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaSquareXTwitter,
  FaSquareInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";
import "./Home.css"; // CSS file for the home page

// Hero Component
const Hero = () => {
  return (
    <section className="hero">
      <h1>Launch Your Freelance Career Today</h1>
      <h4>
        Discover Projects, Connect with Clients, and Build Your Portfolio with Ease
      </h4>
      <div className="box">
        Join a thriving community of freelancers. Find opportunities in design, development, writing, and more. Your next gig is just a click away—start now!
        <Link to="/signup" className="cta-button">
          Get Started
        </Link>
      </div>
    </section>
  );
};

// Services Component
const Services = () => {
  return (
    <section className="services">
      <h2>Our Services</h2>
      <div className="services-grid">
        <div className="service-card">
          <h3>Find Gigs</h3>
          <p>Browse thousands of freelance projects tailored to your skills.</p>
        </div>
        <div className="service-card">
          <h3>Showcase Work</h3>
          <p>Create a stunning portfolio to attract clients.</p>
        </div>
        <div className="service-card">
          <h3>Get Paid</h3>
          <p>Secure payments with our trusted escrow system.</p>
        </div>
      </div>
    </section>
  );
};



// Main Home Component
const Home = () => {
  return (
    <div className="home">
      <Hero />
      <Services />
   
    </div>
  );
};

export default Home;