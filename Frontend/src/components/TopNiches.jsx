import React from "react";
import "./TopNiches.css";
import { FaCode, FaGlobe, FaDatabase, FaCloud, FaDev, FaMobileAlt } from 'react-icons/fa'; // Import icons

const TopNiches = () => {
  const services = [
    {
      id: 1,
      service: "Software Development",
      description:
        "Innovative software development services to build, maintain, and upgrade applications, ensuring they meet the highest quality standards.",
      icon: <FaCode />, // Software Development Icon
    },
    {
      id: 2,
      service: "Web Development",
      description:
        "Comprehensive web development solutions from front-end design to back-end integration, delivering responsive and user-friendly websites.",
      icon: <FaGlobe />, // Web Development Icon
    },
    {
      id: 3,
      service: "Data Science",
      description:
        "Advanced data science services to analyze and interpret complex data, providing actionable insights and data-driven solutions.",
      icon: <FaDatabase />, // Data Science Icon
    },
    {
      id: 4,
      service: "Cloud Computing",
      description:
        "Reliable cloud computing services to manage, store, and process data efficiently, offering scalable and flexible cloud solutions.",
      icon: <FaCloud />, // Cloud Computing Icon
    },
    {
      id: 5,
      service: "DevOps",
      description:
        "DevOps services to streamline software development and operations, enhancing deployment efficiency and reducing time to market.",
      icon: <FaDev />, // DevOps Icon
    },
    {
      id: 6,
      service: "Mobile App Development",
      description:
        "Expert mobile app development for iOS and Android platforms, creating intuitive and engaging mobile experiences for your users.",
      icon: <FaMobileAlt />, // Mobile App Development Icon
    },
  ];

  return (
    <section className="services">
      <h3>Top Interests</h3>
      <div className="grid">
        {services.map((element) => {
          return (
            <div className="card" key={element.id}>
              <div className="icon">
                {element.icon} {/* Render Icon here */}
              </div>
              <h4>{element.service}</h4>
              <p>{element.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TopNiches;