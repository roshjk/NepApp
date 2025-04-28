import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./StudentProfile.css";

const StudentProfile = () => {
  const { id } = useParams(); // get student ID from URL
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const { data } = await axios.get(`/api/v1/user/${id}`, {
          withCredentials: true,
        });
        setStudent(data.user);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch student profile:", error);
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentProfile();
    }
  }, [id]);

  if (loading) return <div className="loading">Loading Profile...</div>;
  if (!student) return <div className="error">Profile not found.</div>;

  const {
    name,
    profilePic,
    bio,
    skills = [],
    education = [],
    experience = [],
    portfolio = [],
    address,
    niches,
    role,
    createdAt
  } = student;

  return (
    <div className="student-profile">
      {/* Header */}
      <div className="profile-header">
        <img
          src={profilePic?.url || "/profile/default-profile.png"}
          alt="Profile"
          className="profile-image"
        />
        <h1>{name}</h1>
        <p className="location">{address || "Location not provided"}</p>
      </div>

      {/* Bio */}
      {bio && (
        <div className="about-me">
          <h2>About Me</h2>
          <p>{bio}</p>
        </div>
      )}

      {/* Niches */}
      {role === "Student" && niches && (
        <div className="profile-section">
          <h2>Preferred Job Niches</h2>
          <ul>
            <li>{niches.firstNiche}</li>
            <li>{niches.secondNiche}</li>
            <li>{niches.thirdNiche}</li>
          </ul>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="skills-section">
          <h2>Skills</h2>
          <div className="skills-list">
            {skills.map((skill, idx) => (
              <span key={idx} className="skill-badge">{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="education-section">
          <h2>Education</h2>
          {education.map((edu, idx) => (
            <div key={idx} className="education-item">
              <strong>{edu.degree}</strong> at {edu.institution} ({edu.year})
            </div>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="experience-section">
          <h2>Experience</h2>
          {experience.map((exp, idx) => (
            <div key={idx} className="experience-item">
              <strong>{exp.title}</strong> at {exp.company} ({exp.year})
            </div>
          ))}
        </div>
      )}

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <div className="portfolio-section">
          <h2>Portfolio</h2>
          <ul>
            {portfolio.map((project, idx) => (
              <li key={idx}>
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  {project.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Meta Info */}
      <div className="meta-section">
        <p><strong>Role:</strong> {role}</p>
        <p><strong>Joined:</strong> {new Date(createdAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default StudentProfile;
