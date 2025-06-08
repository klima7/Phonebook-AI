import RegisterPanel from "../components/auth/registerPanel";
import { motion } from "framer-motion";

export default function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="py-5"
    >
      <div className="d-flex justify-content-center">
        <RegisterPanel />
      </div>
    </motion.div>
  );
} 