import { Navigate } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';
import { getToken, isTokenExpired, getUserRole, logout } from '../services/auth';

const ProtectedRoute = ({ children, role }) => {
  const token = getToken();

  if (!token || isTokenExpired()) {
    logout();
    return <Navigate to="/" />;
  }

  const userRole = getUserRole();
  if (userRole !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
