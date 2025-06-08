import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginPanel from "../components/loginPanel";

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if logged
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="py-5">
      <div className="d-flex justify-content-center">
        <LoginPanel />
      </div>
    </div>
  );
} 