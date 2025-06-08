import { Navigate } from "react-router";
import type { ReactNode } from 'react';
import { useAuth } from "../../hooks/useAuth";
import { Spinner } from 'react-bootstrap';

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, authInitialized } = useAuth();
  
  // Show loading
  if (isLoading || !authInitialized) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // Redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show content
  return <>{children}</>;
}