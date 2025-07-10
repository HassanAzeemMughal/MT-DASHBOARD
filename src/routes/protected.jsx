import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import AppLayout from "../components/layout";
const Protected = () => {
  const isAuthenticated = true;

  return isAuthenticated ? (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ) : (
    <Navigate to="/login" />
  );
};

export default Protected;
