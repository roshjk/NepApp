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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { getUser } from "./store/slices/userSlice";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";

// Create a wrapper component to use the useLocation hook
const AppContent = () => {
  const dispatch = useDispatch();
  const location = useLocation(); // Get the current route

  // Hide Navbar, Footer, and ToastContainer on the /admin/dashboard route
  const isAdminDashboard = location.pathname === "/admin/dashboard";

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  return (
    <>
      {!isAdminDashboard && <Navbar />} {/* Conditionally render the Navbar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/post/application/:jobId" element={<PostApplication />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="*" element={<NotFound />} />
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