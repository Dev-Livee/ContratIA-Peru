import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

export default function DashboardRedirect() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'entity') return <Navigate to="/entidad" replace />;
  if (user.role === 'company') return <Navigate to="/empresa" replace />;
  return <Navigate to="/ciudadano" replace />;
}
