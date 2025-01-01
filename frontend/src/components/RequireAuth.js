import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export const RequireAuth = () => {
  const { auth } = useAuth();
  const location = useLocation();

  // Check if the user is logged in
  if (!auth?.user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the outlet (nested route)
  return <Outlet />;
};
