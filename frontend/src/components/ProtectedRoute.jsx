import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // If the user is not logged in, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />; // This will render the child routes if the user is logged in
};

export default ProtectedRoute;
