import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, clearAllUserErrors } from "../store/slices/userSlice";
import { LuMoveRight } from "react-icons/lu";

import AdminUsers from "../admin/AdminUsers";
import AdminJobs from "../admin/AdminJobs";
import AdminApplications from "../admin/AdminApplications";
import AdminSubmissions from "../admin/AdminSubmissions";
import "./AdminDashboard.css"; // or create AdminDashboard.css with same layout

const AdminDashboard = () => {
  const [show, setShow] = useState(false);
  const [componentName, setComponentName] = useState("Users");

  const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
  };

  const handleComponentSwitch = (name) => {
    setComponentName(name);
    setShow(false);
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated || user?.role !== "Admin") {
      navigate("/login");
    }
  }, [dispatch, error, isAuthenticated, user, navigate]);

  return (
    <section className="account">
      <div className="component_header">
        <p>Admin Dashboard</p>
        <p>
          Welcome! <span>{user?.name}</span>
        </p>
      </div>

      <div className="container">
        <div className={show ? "sidebar showSidebar" : "sidebar"}>
          <ul className="sidebar_links">
            <h4>Admin Tools</h4>
            <li><button onClick={() => handleComponentSwitch("Users")}>Manage Users</button></li>
            <li><button onClick={() => handleComponentSwitch("Jobs")}>Manage Jobs</button></li>
            <li><button onClick={() => handleComponentSwitch("Applications")}>All Applications</button></li>
            <li><button onClick={() => handleComponentSwitch("Submissions")}>Submitted Work</button></li>
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>

        <div className="banner">
          <div className={show ? "sidebar_icon move_right" : "sidebar_icon move_left"}>
            <LuMoveRight onClick={() => setShow(!show)} className={show ? "left_arrow" : "right_arrow"} />
          </div>

          {
            {
              "Users": <AdminUsers />,
              "Jobs": <AdminJobs />,
              "Applications": <AdminApplications />,
              "Submissions": <AdminSubmissions />,
            }[componentName] || <AdminUsers />
          }
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
