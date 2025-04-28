import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { clearAllUpdateProfileErrors, updateProfile } from "../store/slices/updateProfileSlice";
import { toast } from "react-toastify";
import { getUser } from "../store/slices/userSlice";
import "./UpdateProfile.css";

const UpdateProfile = () => {
  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector((state) => state.updateProfile);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    coverLetter: "",
    firstNiche: "",
    secondNiche: "",
    thirdNiche: "",
  });

  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState("");
  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        coverLetter: user.coverLetter || "",
        firstNiche: user.niches?.firstNiche || "",
        secondNiche: user.niches?.secondNiche || "",
        thirdNiche: user.niches?.thirdNiche || "",
      });
      setSkills(user.skills || []);
      setEducation(user.education || []);
      setExperience(user.experience || []);
      setResumePreview(user.resume?.url || "");
      setProfilePicPreview(user.profilePic?.url || "");
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setProfilePicPreview(reader.result);
    };
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setResumePreview(reader.result);
    };
  };

  const handleSkillChange = (index, value) => {
    const updated = [...skills];
    updated[index] = value;
    setSkills(updated);
  };
  
  const handleAddSkill = () => {
    setSkills([...skills, ""]);
  };
  
  const handleRemoveSkill = (index) => {
    setSkills((prev) => prev.filter((_, idx) => idx !== index));
  };
  

  const handleEducationChange = (index, field, value) => {
    const updated = [...education];
    updated[index][field] = value;
    setEducation(updated);
  };

  const handleAddEducation = () => {
    setEducation([...education, { degree: "", institution: "", year: "" }]);
  };

  const handleRemoveEducation = (index) => {
    setEducation((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleExperienceChange = (index, field, value) => {
    const updated = [...experience];
    updated[index][field] = value;
    setExperience(updated);
  };

  const handleAddExperience = () => {
    setExperience([...experience, { title: "", company: "", year: "" }]);
  };

  const handleRemoveExperience = (index) => {
    setExperience((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateProfile = () => {
    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("address", formData.address);
    data.append("bio", formData.bio);
    data.append("coverLetter", formData.coverLetter);
    data.append("skills", JSON.stringify(skills));
    data.append("education", JSON.stringify(education));
    data.append("experience", JSON.stringify(experience));
    if (user?.role === "Student") {
      data.append("firstNiche", formData.firstNiche);
      data.append("secondNiche", formData.secondNiche);
      data.append("thirdNiche", formData.thirdNiche);
    }
    if (resume) data.append("resume", resume);
    if (profilePic) data.append("profilePic", profilePic);

    dispatch(updateProfile(data));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
    if (isUpdated) {
      toast.success("Profile Updated Successfully!");
      dispatch(getUser());
      dispatch(clearAllUpdateProfileErrors());
    }
  }, [dispatch, error, isUpdated, loading]);

  return (
    <div className="update-profile-container">
      <h2>Update Your Profile</h2>

      {/* Profile Picture */}
      <div className="profile-picture-upload">
        <img
          src={profilePicPreview || "/profile/default-profile.png"}
          alt="Profile"
          className="profile-pic-preview"
        />
        <input type="file" accept="image/*" onChange={handleProfilePicChange} />
      </div>

      {/* Basic Fields */}
      <div className="form-section">
        <label>Full Name</label>
        <input type="text" name="name" value={formData.name} onChange={handleInputChange} />

        <label>Email Address</label>
        <input type="email" name="email" value={formData.email} onChange={handleInputChange} />

        <label>Phone Number</label>
        <input type="number" name="phone" value={formData.phone} onChange={handleInputChange} />

        <label>Address</label>
        <input type="text" name="address" value={formData.address} onChange={handleInputChange} />

        <label>Bio</label>
        <textarea name="bio" rows="3" value={formData.bio} onChange={handleInputChange}></textarea>
      </div>

      {/* Skills Section */}
<div className="skills-section">
  <label>Skills</label>
  {skills.map((skill, idx) => (
    <div key={idx} className="nested-field">
      <input
        type="text"
        value={skill}
        onChange={(e) => handleSkillChange(idx, e.target.value)}
        placeholder="Enter a skill"
      />
      <button type="button" className="remove-btn" onClick={() => handleRemoveSkill(idx)}>❌</button>
    </div>
  ))}
  <button type="button" className="add-btn" onClick={handleAddSkill}>+ Add Skill</button>
</div>

      {/* Education Section */}
      <div className="education-section">
        <label>Education</label>
        {education.map((edu, idx) => (
          <div key={idx} className="nested-field">
            <input
              placeholder="Degree"
              value={edu.degree}
              onChange={(e) => handleEducationChange(idx, "degree", e.target.value)}
            />
            <input
              placeholder="Institution"
              value={edu.institution}
              onChange={(e) => handleEducationChange(idx, "institution", e.target.value)}
            />
            <input
              placeholder="Year"
              value={edu.year}
              onChange={(e) => handleEducationChange(idx, "year", e.target.value)}
            />
            <button type="button" className="remove-btn" onClick={() => handleRemoveEducation(idx)}>❌</button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={handleAddEducation}>+ Add Education</button>
      </div>

      {/* Experience Section */}
      <div className="experience-section">
        <label>Experience</label>
        {experience.map((exp, idx) => (
          <div key={idx} className="nested-field">
            <input
              placeholder="Job Title"
              value={exp.title}
              onChange={(e) => handleExperienceChange(idx, "title", e.target.value)}
            />
            <input
              placeholder="Company"
              value={exp.company}
              onChange={(e) => handleExperienceChange(idx, "company", e.target.value)}
            />
            <input
              placeholder="Year"
              value={exp.year}
              onChange={(e) => handleExperienceChange(idx, "year", e.target.value)}
            />
            <button type="button" className="remove-btn" onClick={() => handleRemoveExperience(idx)}>❌</button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={handleAddExperience}>+ Add Experience</button>
      </div>

      {/* Resume Section */}
      <div className="resume-section">
        <label>Upload Resume</label>
        <input type="file" accept=".pdf" onChange={handleResumeChange} />
        {resumePreview && (
          <div className="resume-link">
            <Link to={resumePreview} target="_blank" rel="noopener noreferrer">View Current Resume</Link>
          </div>
        )}
      </div>

      <button onClick={handleUpdateProfile} disabled={loading} className="save-btn">
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default UpdateProfile;
