"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type Role = "Agent" | "Coordinator" | "Broker" | "Admin";

interface LoginPopupProps {
  onClose: () => void;
  openSignup: () => void;
  isDarkMode: boolean;
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ onClose, openSignup, isDarkMode }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("Agent");

  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Login Data:", { email, password, role });

    // Role-based redirection (Without API)
    switch (role) {
      case "Agent":
        router.push("/agent");
        break;
      case "Broker":
        router.push("/broker");
        break;
      case "Coordinator":
        router.push("/tc");
        break;
      case "Admin":
        router.push("/dashboard/admin");
        break;
      default:
        router.push("/login");
    }

    onClose(); // Close the modal
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className={`rounded-xl max-w-md w-full p-8 relative ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-primary text-primary'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className={`absolute top-4 right-4 p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-secondary'}`}>
          <X className={`w-6 h-6 ${isDarkMode ? 'text-white' : 'text-primary'}`} />
        </button>
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-2`}>Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`input ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-2`}>Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`input ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              required
            />
          </div>
          <div>
            <label htmlFor="role" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-2`}>Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className={`input ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
            >
              <option value="Agent">Agent</option>
              <option value="Coordinator">Coordinator</option>
              <option value="Broker">Broker</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full button">
            Login
          </motion.button>
          <div className="text-center">
            <p className={isDarkMode ? 'text-gray-300' : 'text-secondary'}>
              Don't have an account?{" "}
              <button
                type="button"
                onClick={openSignup}
                className={`${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-primary hover:underline'} font-medium`}
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};
