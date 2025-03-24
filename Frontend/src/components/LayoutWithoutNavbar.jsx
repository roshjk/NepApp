// src/components/LayoutWithoutNavbar.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";

const LayoutWithoutNavbar = () => {
  return (
    <>
      <main>
        <Outlet /> {/* Renders the child routes */}
      </main>
      <Footer />
      <ToastContainer position="top-right" theme="dark" />
    </>
  );
};

export default LayoutWithoutNavbar;