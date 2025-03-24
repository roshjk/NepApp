import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearAllUserErrors, login } from "../store/slices/userSlice";
import { toast } from "react-toastify";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import "./Login.css"; // Import the CSS

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const loginData = { email, password };
    dispatch(login(loginData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
  //add admin here
  if (isAuthenticated && user) {
    if (user.role === "Admin") {
      navigateTo("/admin/dashboard");
    } else if (user.role === "Business") {
      navigateTo("/business/dashboard");
    } else {
      navigateTo("/student/dashboard");
    }
  }
}, [dispatch, error, isAuthenticated, user, navigateTo]);



  return (
    <div className="authPage">
      {/* Left Side */}
      <div className="left-section">
        <div className="left-content">
          <h1>Welcome Back</h1>
          <p>Login to get access...</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="right-section">
        <div className="login-container">
          <h3>Login to your account</h3>
          <form onSubmit={handleLogin}>
            <div className="inputTag">
              <label>Email</label>
              <div className="input-group">
                <MdOutlineMailOutline className="input-icon" />
                <input
                  type="email"
                  placeholder="youremail@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="inputTag">
              <label>Password</label>
              <div className="input-group">
                <RiLock2Fill className="input-icon" />
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" disabled={loading}>
              Login
            </button>
            <Link to={"/register"} className="register-link">Register Now</Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
