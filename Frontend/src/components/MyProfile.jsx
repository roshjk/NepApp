import React from "react";
import { useSelector } from "react-redux";
import "./MyProfile.css";

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);

  if (!user) return <p>Loading...</p>;

  const {
    name,
    email,
    phone,
    address,
    role,
    createdAt,
    profilePic,
    resume,
    niches,
    bio,
    skills = [],
    education = [],
    experience = [],
    portfolio = [],
  } = user;

  // Calculate profile completion %
  const totalFields = 10;
  let completedFields = 0;

  if (name) completedFields++;
  if (email) completedFields++;
  if (phone) completedFields++;
  if (address) completedFields++;
  if (bio) completedFields++;
  if (skills.length > 0) completedFields++;
  if (education.length > 0) completedFields++;
  if (experience.length > 0) completedFields++;
  if (resume?.url) completedFields++;
  if (portfolio.length > 0) completedFields++;

  const profileCompletion = Math.floor((completedFields / totalFields) * 100);

  return (
    <div className="account_components">
      {/* Progress Bar */}
      <div className="profile-progress-container">
        <label>Profile Completion</label>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${profileCompletion}%` }}>
            {profileCompletion}%
          </div>
        </div>
      </div>

      <h3>My Profile</h3>

      {/* Profile Pic */}
      <div className="profile-pic-container">
        <img
          src={profilePic?.url || "/profile/default-profile.png"}
          alt="Profile"
          className="profile-img"
        />
      </div>

      {/* Basic Info */}
      <div>
        <label>Full Name</label>
        <div className="verified-container">
          <input type="text" disabled value={name} />
          <span className="verified-badge">✔️ Verified</span>
        </div>
      </div>
      <div><label>Email Address</label><input type="email" disabled value={email} /></div>
      <div><label>Phone Number</label><input type="text" disabled value={phone} /></div>
      <div><label>Address</label><input type="text" disabled value={address} /></div>
      <div><label>Role</label><input type="text" disabled value={role} /></div>
      <div><label>Joined On</label><input type="text" disabled value={new Date(createdAt).toLocaleString()} /></div>

      {/* Bio */}
      {bio && (
        <div className="profile-section">
          <label>About Me</label>
          <textarea value={bio} disabled rows={3}></textarea>
        </div>
      )}

      {/* Niches */}
      {role === "Student" && niches && (
        <div className="profile-section">
          <label>Preferred Job Niches</label>
          <ul>
            <li>{niches.firstNiche}</li>
            <li>{niches.secondNiche}</li>
            <li>{niches.thirdNiche}</li>
          </ul>
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="profile-section">
          <label>Skills</label>
          <div className="skill-badges">
            {skills.map((skill, idx) => (
              <span className="skill-badge" key={idx}>{skill}</span>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="profile-section">
          <label>Education</label>
          {education.map((edu, i) => (
            <p key={i}><strong>{edu.degree}</strong> - {edu.institution} ({edu.year})</p>
          ))}
        </div>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <div className="profile-section">
          <label>Experience</label>
          {experience.map((exp, i) => (
            <p key={i}><strong>{exp.title}</strong> at {exp.company} ({exp.year})</p>
          ))}
        </div>
      )}

      {/* Resume */}
      {resume?.url && (
        <div className="profile-section">
          <label>Resume</label>
          <a href={resume.url} target="_blank" rel="noopener noreferrer" className="resume-btn">View Resume</a>
        </div>
      )}

      {/* Portfolio */}
      {portfolio.length > 0 && (
        <div className="profile-section">
          <label>Portfolio</label>
          <ul>
            {portfolio.map((item, i) => (
              <li key={i}><a href={item.link} target="_blank" rel="noopener noreferrer">{item.title}</a></li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyProfile;
