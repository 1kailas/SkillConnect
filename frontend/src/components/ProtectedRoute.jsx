import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <LoadingSpinner fullScreen text="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login with return URL
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard if user doesn't have access
    const redirectPath = user?.role === 'worker' ? '/dashboard/worker' 
      : user?.role === 'employer' ? '/dashboard/employer'
      : user?.role === 'admin' ? '/dashboard/admin' 
      : '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
