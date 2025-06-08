import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginPanel from "../components/auth/loginPanel";
import { motion } from "framer-motion";

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="py-5"
    >
      <div className="d-flex justify-content-center">
        <LoginPanel />
      </div>
    </motion.div>
  );
} 