import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, register } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { FaAddressBook, FaPencilAlt, FaRegUser } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { MdCategory, MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";

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
      <style>
        {`
          .register-page {
            min-height: 100vh;
            background: url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80') no-repeat center center fixed;
            background-size: cover;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.5rem;
          }

          .register-container {
            max-width: 20rem;
            height: 26rem;
            width: 100%;
            background: rgba(255, 255, 255, 0.95);
            padding: 2.5rem;
            border-radius: 0.75rem;
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
            margin-left: auto;
            margin-right: 70px;
            margin-top: 70px; /* Pushes the container to the top in a flex context */
          }

          .register-header {
            text-align: center;
            margin-bottom: 0.5rem; /* Reduced from 2rem */
          }

          .register-header h3 {
            font-size: 1.5rem; /* Reduced from 1.875rem */
            font-weight: bold;
            color: #1a202c;
          }

          .register-header p {
            color: #718096;
            margin-top: 0.25rem;
            font-size: 0.875rem;
          }

          .form-group {
            position: relative;
            max-width: 100%;
            height: 2rem;
            padding: 0.2rem 0.2rem 0 2rem;
          }

          .form-input {
            width: 100%;
            padding: 0.2rem 1rem 0.2rem 2.5rem;
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            font-size: 0.6rem; /* Slightly smaller font */
            transition: all 0.2s;
          }

          .form-input:focus {
            outline: none;
            border-color: #4299e1;
            box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.3);
          }

          .form-icon {
            position: absolute;
            left: 0.65rem;
            top: 50%;
            transform: translateY(-50%);
            color: #718096;
            font-size: 1rem;
          }

          .register-button {
            width: 70%;
            padding: 0.5rem; /* Reduced from 0.75rem */
            background: #4299e1;
            color: white;
            border: none;
            border-radius: 0.375rem;
            margin-left: 20%;
            font-weight: 500;
            font-size: 0.8rem;
            cursor: pointer;
            transition: background 0.3s;
          }

          .register-button:hover {
            background: #2b6cb0;
          }

          .register-button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }

          .login-link {
            text-align: center;
            margin-top: 0.75rem; /* Reduced from 1rem */
            color: #718096;
            font-weight: 300;
            font-size: 0.7rem;
          }

          .login-link a {
            color: #4299e1;
            text-decoration: none;
            font-size: 0.7rem;
            font-weight: 300;
          }

          .login-link a:hover {
            color: #2b6cb0;
            text-decoration: underline;
          }

          textarea.form-input {
            min-height: 6rem; /* Reduced from 8rem */
            padding: 0.65rem;
          }

          input[type="file"] {
            padding: 0.4rem; /* Reduced from 0.5rem */
            border: 1px solid #e2e8f0;
            border-radius: 0.375rem;
            width: 100%;
            font-size: 0.9rem;
          }
        `}
      </style>
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