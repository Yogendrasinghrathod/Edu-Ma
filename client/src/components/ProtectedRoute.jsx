import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.authSlice);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AuthenticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.authSlice);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

AuthenticatedUser.propTypes = {
  children: PropTypes.node.isRequired,
};

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((store) => store.authSlice);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.accountType !== "Instructor") {
    return <Navigate to="/" />;
  }

  return children;
};

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
