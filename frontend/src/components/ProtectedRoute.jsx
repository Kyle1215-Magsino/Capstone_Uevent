import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/" replace />;

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'student') return <Navigate to="/student-dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}






