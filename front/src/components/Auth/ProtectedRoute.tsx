import { Navigate, Outlet } from 'react-router-dom';
import { Box, Spinner } from '@chakra-ui/react';
import { useAuth } from '@/context/AuthContext';
import type { Role } from '@/utils/constants';

interface Props {
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ allowedRoles }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="brand.700" thickness="3px" />
      </Box>
    );
  }

  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    const redirect = user.role === 'entity' ? '/entidad/dashboard' : '/empresa/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return <Outlet />;
}
