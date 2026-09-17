import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RoleRoute = ({ allowedRoles = [], children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const redirectMap = {
      user: '/user/dashboard',
      driver: '/driver/dashboard',
      admin: '/admin/dashboard',
    };

    return <Navigate to={redirectMap[user.role] || '/login'} replace />;
  }

  return children || <Outlet />;
};

export default RoleRoute;
