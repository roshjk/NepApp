import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, register } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { FaAddressBook, FaPencilAlt, FaRegUser } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdCategory, MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import "./Register.css";

const Register = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstNiche, setFirstNiche] = useState("");
  const [secondNiche, setSecondNiche] = useState("");
  const [thirdNiche, setThirdNiche] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  const nichesArray = [
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const { loading, isAuthenticated, error, message } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleRegsiter = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("password", password);
    if (role === "Student") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);
    }
    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, error, loading, isAuthenticated, message]);

  return (
    <>
  
      <div className="register-page">
        <div className="register-container">
          <div className="register-header">
            <h3>Create Account</h3>
            <p>Join us today!</p>
          </div>

          <form onSubmit={handleRegsiter}>
            <div className="form-group">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-input"
              >
                <option value="">Select Role</option>
                <option value="Student">Student</option>
                <option value="Business">Business</option>
              </select>
              <FaRegUser className="form-icon" />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
              <FaPencilAlt className="form-icon" />
            </div>

            <div className="form-group">
              <input
                type="email"
                placeholder="youremail@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
              <MdOutlineMailOutline className="form-icon" />
            </div>

            <div className="form-group">
              <input
                type="number"
                placeholder="111-222-333"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="form-input"
              />
              <FaPhoneFlip className="form-icon" />
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Your Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="form-input"
              />
              <FaAddressBook className="form-icon" />
            </div>

            <div className="form-group">
              <input
                type="password"
                placeholder="Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
              <RiLock2Fill className="form-icon" />
            </div>

            {role === "Student" && (
              <>
                {[firstNiche, secondNiche, thirdNiche].map((niche, index) => (
                  <div className="form-group" key={index}>
                    <select
                      value={[firstNiche, secondNiche, thirdNiche][index]}
                      onChange={(e) => 
                        [setFirstNiche, setSecondNiche, setThirdNiche][index](e.target.value)
                      }
                      className="form-input"
                    >
                      <option value="">Select Niche {index + 1}</option>
                      {nichesArray.map((niche, idx) => (
                        <option key={idx} value={niche}>{niche}</option>
                      ))}
                    </select>
                    <MdCategory className="form-icon" />
                  </div>
                ))}

                <div className="form-group">
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Your Cover Letter"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="file"
                    onChange={resumeHandler}
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="register-button"
            >
              {loading ? "Registering..." : "Register"}
            </button>

            <div className="login-link">
              Already have an account? <Link to="/login">Login Now</Link>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;