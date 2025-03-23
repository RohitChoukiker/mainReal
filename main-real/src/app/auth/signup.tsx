"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateUniqueId } from "../../utils/generateId";

type Role = "Agent" | "Coordinator" | "Broker" | "Admin";

interface SignupData {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  companyName: string;
  teamName: string;
  address: string;
  companyPhone: string;
  city: string;
  state: string;
  pinCode: string;
  timeZone: string;
  role: Role;
}

const timeZones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "America/Chicago",
  "America/Denver",
  "Asia/Kolkata",
  "Asia/Tokyo",
  "Asia/Shanghai",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
  "Asia/Dubai",
  "Asia/Singapore",
  "Africa/Johannesburg",
  "America/Toronto",
  "America/Sao_Paulo",
  "Asia/Seoul",
];

interface SignupPopupProps {
  onClose: () => void;
  isDarkMode: boolean;
  openLogin: () => void;
}

export const SignupPopup: React.FC<SignupPopupProps> = ({ onClose, isDarkMode, openLogin }) => {
  const [signupData, setSignupData] = useState<SignupData>({
    id: "",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    companyName: "",
    teamName: "",
    address: "",
    companyPhone: "",
    city: "",
    state: "",
    pinCode: "",
    timeZone: "UTC",
    role: "Agent",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newId = generateUniqueId();
    const dataWithId = { ...signupData, id: newId };
    
    console.log(dataWithId);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataWithId),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(`Registration successful! Your ID is: ${newId}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: isDarkMode ? "dark" : "light",
        });
        onClose();
        openLogin();
      } else {
        toast.error(data.message || "Registration failed. Please try again.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: isDarkMode ? "dark" : "light",
        });
        console.log(data);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: isDarkMode ? "dark" : "light",
      });
      console.error("Error during signup:", error);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const inputVariants = {
    focus: { scale: 1.02, borderColor: isDarkMode ? "#60a5fa" : "#4f46e5" },
    blur: { scale: 1, borderColor: isDarkMode ? "#4b5563" : "#e5e7eb" },
  };

  return (
    <>
      <ToastContainer />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl border ${
            isDarkMode ? "bg-gray-950 border-gray-700 text-white" : "bg-primary border-gray-200/20 text-primary"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${
              isDarkMode ? "hover:bg-gray-700" : "hover:bg-secondary"
            }`}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-theme bg-clip-text text-transparent">
              Create Your Account
            </h2>
            <p className={isDarkMode ? "text-gray-400" : "text-secondary mt-2"}>
              Join our platform and streamline your real estate journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center text-sm text-gray-500">
              Your unique ID will be generated upon successful registration
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Personal Details</h3>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? "text-white-300" : "text-secondary"} mb-1`}>
                    Full Name <span className="text-red-800">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  />
                </motion.div>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Email Address <span className="text-red-800">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  />
                </motion.div>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="mobile" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Mobile Number <span className="text-red-800">*</span>
                  </label>
                  <input
                    type="tel"
                    id="mobile"
                    value={signupData.mobile}
                    maxLength={10}
                    onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  />
                </motion.div>
              </motion.div>

              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Company Details</h3>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="companyName" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Company Name
                  </label>
                  <input
                    type="text"
                    id="companyName"
                    value={signupData.companyName}
                    maxLength={10}
                    onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                  />
                </motion.div>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="teamName" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Team Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="teamName"
                    value={signupData.teamName}
                    onChange={(e) => setSignupData({ ...signupData, teamName: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                  />
                </motion.div>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="companyPhone" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Company Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    id="companyPhone"
                    value={signupData.companyPhone}
                    onChange={(e) => setSignupData({ ...signupData, companyPhone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                  />
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className={`space-y-6 p-6 rounded-xl ${isDarkMode ? "bg-black" : "bg-gray-50"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Security</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Password <span className="text-red-800">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  />
                </motion.div>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Confirm Password <span className="text-red-800">*</span>
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Location</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="address" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={signupData.address}
                    onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  />
                </motion.div>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="city" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={signupData.city}
                    onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  />
                </motion.div>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="state" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    value={signupData.state}
                    onChange={(e) => setSignupData({ ...signupData, state: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  />
                </motion.div>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="pinCode" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Pin Code
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    value={signupData.pinCode}
                    onChange={(e) => setSignupData({ ...signupData, pinCode: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  />
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className={`space-y-6 p-6 rounded-xl ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Preferences</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="timeZone" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Time Zone
                  </label>
                  <select
                    id="timeZone"
                    value={signupData.timeZone}
                    onChange={(e) => setSignupData({ ...signupData, timeZone: e.target.value })}
                    className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                    required
                  >
                    {timeZones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </select>
                </motion.div>
                <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                  <label htmlFor="role" className={`block text-sm font-medium ${isDarkMode ? "text-gray-300" : "text-secondary"} mb-1`}>
                    Role
                  </label>
                  <select
                    id="role"
                    value={signupData.role}
                    onChange={(e) => setSignupData({ ...signupData, role: e.target.value as Role })}
                    className={`w-full px-2 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${
                      isDarkMode ? "bg-black border-gray-600 text-white focus:ring-blue-400/20" : "bg-white/50 border-gray-200 text-primary"
                    }`}
                  >
                    <option value="Agent">Agent</option>
                    <option value="Coordinator">Transaction Coordinator</option>
                    <option value="Broker">Broker</option>
                  </select>
                </motion.div>
              </div>
            </motion.div>

            <motion.button
              type="submit"
              whileHover={{
                scale: 1.05,
                boxShadow: isDarkMode ? "0 8px 25px rgba(96, 165, 250, 0.3)" : "0 8px 25px rgba(79, 70, 229, 0.3)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full button py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300"
            >
              Create Account
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </>
  );
};