import { Navigate } from "react-router";
import type { ReactNode } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [isClient, setIsClient] = useState(false);
  
  // This effect will only run on the client after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Show loading indicator while authenticating
  if (isLoading || !isClient) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 