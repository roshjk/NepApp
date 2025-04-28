import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PostApplication from "./pages/PostApplication";
import Register from "./pages/Register";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/userSlice";

import AdminDashboard from "./pages/AdminDashboard";
import socket from "./socket";
import { addNotification } from "./store/slices/notificationSlice";
import StudentProfile from "./pages/StudentProfile";
import { useSelector } from "react-redux";
import Messaging from "./components/Messaging";


// Create a wrapper component to use the useLocation hook
const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current route
  const { user } = useSelector((state) => state.user); 

  // Hide Navbar, Footer, and ToastContainer on the /admin/dashboard route
  const isAdminDashboard = location.pathname === "/admin/dashboard";

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      socket.emit("join", user._id);
      socket.on("notification", (data) => {
      toast.info(data.message || "🔔 You have a new notification.");
        
        dispatch(addNotification(data));
      });

      return () => {
        socket.off("notification");
      };
    }
  }, [user, dispatch]);

  return (
    <>
      {!isAdminDashboard && <Navbar />} {/* Conditionally render the Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/apply/:jobId" element={<PostApplication />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Messaging />} />
        <Route path="/student/:id" element={<StudentProfile />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/contact" element={<h1>Contact Us</h1>} />
      
    

        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
      </Routes>
      {!isAdminDashboard && <Footer />} {/* Conditionally render the Footer */}
      {!isAdminDashboard && <ToastContainer position="top-right" theme="dark" />}{" "}
      {/* Conditionally render the ToastContainer */}
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;