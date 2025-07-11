import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AppLayout from "../components/layout";
import { useSelector } from "react-redux";
const Protected = () => {
  const location = useLocation();

  const token = useSelector((state) => state.token.data);
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
};

export default Protected;
