import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    // If user isn't logged in, return a Navigate component that sends the user to /login
    return <Navigate to="/" replace />;
  }

  // Otherwise, render the protected route's child component.
  return children;
}
