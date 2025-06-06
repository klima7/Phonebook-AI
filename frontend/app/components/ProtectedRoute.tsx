import { Navigate } from "react-router";
import type { ReactNode } from 'react';
import { useAuth } from "../contexts/AuthContext";
import { useEffect, useState } from "react";
import { Spinner } from 'react-bootstrap';

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
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 