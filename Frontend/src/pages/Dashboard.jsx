import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout, clearAllUserErrors } from "../store/slices/userSlice";
import { LuMoveRight } from "react-icons/lu";

import MyProfile from "../components/MyProfile";
import UpdateProfile from "../components/UpdateProfile";
import UpdatePassword from "../components/UpdatePassword";
import MyJobs from "../components/MyJobs";
import Applications from "../components/Applications";
import MyApplications from "../components/MyApplications";
import JobPost from "../components/PostJob";
import "./Dashboard.css";

const Dashboard = () => {
  const [show, setShow] = useState(false);
  const [componentName, setComponentName] = useState("My Profile");

  const { loading, isAuthenticated, error, user } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully.");
  };

  const handleComponentSwitch = (name) => {
    setComponentName(name);
    setShow(false); // Hide sidebar on small screen after selection
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [dispatch, error, isAuthenticated, navigateTo]);

  return (
    <section className="account">
      <div className="component_header">
        <p>Dashboard</p>
        <p>
          Welcome! <span>{user?.name}</span>
        </p>
      </div>

      <div className="container">
        <div className={show ? "sidebar showSidebar" : "sidebar"}>
          <ul className="sidebar_links">
            <h4>Manage Account</h4>
            <li><button onClick={() => handleComponentSwitch("My Profile")}>My Profile</button></li>
            <li><button onClick={() => handleComponentSwitch("Update Profile")}>Update Profile</button></li>
            <li><button onClick={() => handleComponentSwitch("Update Password")}>Update Password</button></li>

            {user?.role === "Business" && (
              <>
                <li><button onClick={() => handleComponentSwitch("Job Post")}>Post New Job</button></li>
                <li><button onClick={() => handleComponentSwitch("My Jobs")}>My Jobs</button></li>
                <li><button onClick={() => handleComponentSwitch("Applications")}>Applications</button></li>
              </>
            )}

            {user?.role === "Student" && (
              <li><button onClick={() => handleComponentSwitch("My Applications")}>My Applications</button></li>
            )}

            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
        </div>

        <div className="banner">
          <div className={show ? "sidebar_icon move_right" : "sidebar_icon move_left"}>
            <LuMoveRight onClick={() => setShow(!show)} className={show ? "left_arrow" : "right_arrow"} />
          </div>

          {
            {
              "My Profile": <MyProfile />,
              "Update Profile": <UpdateProfile />,
              "Update Password": <UpdatePassword />,
              "Job Post": <JobPost />,
              "My Jobs": <MyJobs />,
              "Applications": <Applications />,
              "My Applications": <MyApplications />,
            }[componentName] || <MyProfile />
          }
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
