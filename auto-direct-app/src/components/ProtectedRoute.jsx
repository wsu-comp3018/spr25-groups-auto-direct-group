import React from "react";
import { useUser } from "../contexts/UserContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children }) {
  const { user, loading } = useUser();

  // Don't render route until loading complete
  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  if (!user.roles?.some(role => allowedRoles.includes(role))) {
    console.log("User does NOT have required role. Redirecting...");
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
