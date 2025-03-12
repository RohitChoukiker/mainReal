
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import Head from "next/head";
import {
  Menu, X, ChevronRight, Sun, Moon, Building2, ClipboardCheck, BarChart3,
  Check, Star, Linkedin, Twitter, ArrowUp, ArrowRight, Phone, Mail, MapPin,
  Github, Send, CheckCircle, Shield, Clock, Users, LucideIcon
} from "lucide-react";

// Type Definitions
type Role = "Agent" | "Coordinator" | "Broker" | "Admin";

interface MenuItem {
  name: string;
  href: string;
}

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  social: {
    linkedin: string;
    twitter: string;
  };
}

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  popular: boolean;
}

interface LoginData {
  email: string;
  password: string;
  role: Role;
}

interface SignupData {
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

// Common time zones list
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

// Constants
const backgroundImages: string[] = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1460472178825-e5240623afd5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80",
];

const menuItems: MenuItem[] = [
  { name: "About", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Team", href: "#team" },
  { name: "Pricing", href: "#pricing" },
  { name: "Contact", href: "#contact" },
];

const aboutFeatures: Feature[] = [
  { icon: CheckCircle, title: "Streamlined Workflow", description: "Automate and simplify your transaction processes" },
  { icon: Shield, title: "Compliance Assured", description: "Stay compliant with automated checks and balances" },
  { icon: Clock, title: "Time Saving", description: "Reduce manual work and focus on what matters" },
  { icon: Users, title: "Team Collaboration", description: "Work together seamlessly across your organization" },
];

const services: Service[] = [
  { icon: Building2, title: "Transaction Management", description: "Comprehensive tools for agents to manage deals from start to finish", features: ["Document Management", "Timeline Tracking", "Client Communication"] },
  { icon: ClipboardCheck, title: "Task Coordination", description: "Streamlined coordination and compliance tracking for Transaction Coordinators", features: ["Task Automation", "Compliance Checks", "Deadline Management"] },
  { icon: BarChart3, title: "Brokerage Oversight", description: "Advanced analytics and oversight tools for administrative staff", features: ["Performance Metrics", "Risk Assessment", "Financial Tracking"] },
];

const team: TeamMember[] = [
  { name: "Rohit Choukiker", role: "Developer", image: "https://media.licdn.com/dms/image/v2/D5603AQFHN8m-zpDK3w/profile-displayphoto-shrink_400_400/B56ZVsCkr6HoAg-/0/1741274369372?e=1747267200&v=beta&t=8Wec9qTty1_UQ9XJVQS_SRYgF3KCy7eYveBAIU1Sy6k", social: { linkedin: "https://www.linkedin.com/in/rohit-choukiker", twitter: "#" } },
];

const plans: Plan[] = [
  { name: "Free", price: "0", description: "Perfect for getting started", features: ["Basic transaction management", "Up to 5 active listings", "Email support", "Basic analytics", "Mobile app access"], popular: false },
  { name: "Premium", price: "49", description: "Best for growing businesses", features: ["Unlimited transactions", "Unlimited listings", "Priority 24/7 support", "Advanced analytics", "Custom branding", "Team collaboration", "API access", "Automated workflows"], popular: true },
];

// Navbar Component
const Navbar: React.FC<{
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  setShowPricingPopup: (value: boolean) => void;
  setShowTeamPopup: (value: boolean) => void;
}> = ({ isDarkMode, setIsDarkMode, setShowPricingPopup, setShowTeamPopup }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePricingClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPricingPopup(true);
    setIsMenuOpen(false);
  };

  const handleTeamClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTeamPopup(true);
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-secondary/0 shadow-theme backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          <a href="/" className={`text-2xl italic  ${isScrolled ? "text-primary" : "text-white"}`}>
            Realus
          </a>
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={
                  item.name === "Pricing"
                    ? handlePricingClick
                    : item.name === "Team"
                    ? handleTeamClick
                    : undefined
                }
                className={`${isScrolled ? "text-secondary hover:text-primary" : "text-white/90 hover:text-white"} transition-colors relative group`}
                whileHover={{ scale: 1.05 }}
              >
                {item.name}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-theme origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
            <motion.button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full ${isScrolled ?  " bg-secondary hover:bg-primary" : "bg-white/10 hover:bg-white/20"}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-black" />}
              </AnimatePresence>
            </motion.button>
          </div>
          <div className="md:hidden flex items-center space-x-2">
            <motion.button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2 rounded-full ${isScrolled ? "bg-secondary" : "bg-white/10"}`}>
              <AnimatePresence mode="wait">
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-white" />}
              </AnimatePresence>
            </motion.button>
            <motion.button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg">
              {isMenuOpen ? <X className={isScrolled ? "text-primary" : "text-white"} /> : <Menu className={isScrolled ? "text-primary" : "text-white"} />}
            </motion.button>
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed top-0 left-0 h-full w-64 bg-secondary shadow-theme md:hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-xl font-bold text-primary">Menu</span>
                  <motion.button onClick={() => setIsMenuOpen(false)} className="p-2 rounded-lg hover:bg-primary">
                    <X className="text-primary" />
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {menuItems.map((item) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      onClick={
                        item.name === "Pricing"
                          ? handlePricingClick
                          : item.name === "Team"
                          ? handleTeamClick
                          : () => setIsMenuOpen(false)
                      }
                      className="flex items-center justify-between w-full p-3 rounded-lg text-secondary hover:text-primary hover:bg-primary transition-colors"
                    >
                      <span>{item.name}</span>
                      <ChevronRight className="w-5 h-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Login Popup Component
const LoginPopup: React.FC<{ onClose: () => void; openSignup: () => void; isDarkMode: boolean }> = ({ onClose, openSignup, isDarkMode }) => {
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
    role: "Agent",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login Data:", loginData);
    // Add your login logic here
    onClose();
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
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              className={`input ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-2`}>Password</label>
            <input
              type="password"
              id="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              className={`input ${isDarkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
              required
            />
          </div>
          <div>
            <label htmlFor="role" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-2`}>Role</label>
            <select
              id="role"
              value={loginData.role}
              onChange={(e) => setLoginData({ ...loginData, role: e.target.value as Role })}
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

// Enhanced Signup Popup Component with Dark Mode
const SignupPopup: React.FC<{ onClose: () => void; isDarkMode: boolean }> = ({ onClose, isDarkMode }) => {
  const [signupData, setSignupData] = useState<SignupData>({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }
    console.log("Signup Data:", signupData);
    // Add your signup logic here
    onClose();
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
    blur: { scale: 1, borderColor: isDarkMode ? "#4b5563" : "#e5e7eb" }
  };

  return (
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
        className={`rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 relative shadow-2xl border ${isDarkMode ? 'bg-gray-950 border-gray-700 text-white' : 'bg-primary border-gray-200/20 text-primary'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className={`absolute top-4 right-4 p-2 rounded-full transition-colors duration-200 ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-secondary'}`}
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-theme bg-clip-text text-transparent">Create Your Account</h2>
          <p className={isDarkMode ? 'text-gray-400' : 'text-secondary mt-2'}>Join our platform and streamline your real estate journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <motion.div className="space-y-6" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Personal Details</h3>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="name" className={`block text-sm font-medium ${isDarkMode ? 'text-white-300' : 'text-secondary'} mb-1`}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  value={signupData.name}
                  onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="email" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="mobile" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Mobile Number</label>
                <input
                  type="tel"
                  id="mobile"
                  value={signupData.mobile}
                  onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
            </motion.div>

            {/* Company Information */}
            <motion.div className="space-y-6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Company Details</h3>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="companyName" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Company Name</label>
                <input
                  type="text"
                  id="companyName"
                  value={signupData.companyName}
                  onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="teamName" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Team Name (Optional)</label>
                <input
                  type="text"
                  id="teamName"
                  value={signupData.teamName}
                  onChange={(e) => setSignupData({ ...signupData, teamName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                />
              </motion.div>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="companyPhone" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Company Phone (Optional)</label>
                <input
                  type="tel"
                  id="companyPhone"
                  value={signupData.companyPhone}
                  onChange={(e) => setSignupData({ ...signupData, companyPhone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                />
              </motion.div>
            </motion.div>
          </div>

          {/* Security */}
          <motion.div 
            className={`space-y-6 p-6 rounded-xl ${isDarkMode ? 'bg-black' : 'bg-gray-50'}`} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Security</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="password" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Password</label>
                <input
                  type="password"
                  id="password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="confirmPassword" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={signupData.confirmPassword}
                  onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Location */}
          <motion.div 
            className="space-y-6" 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Location</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="address" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Address</label>
                <input
                  type="text"
                  id="address"
                  value={signupData.address}
                  onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="city" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>City</label>
                <input
                  type="text"
                  id="city"
                  value={signupData.city}
                  onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="state" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>State</label>
                <input
                  type="text"
                  id="state"
                  value={signupData.state}
                  onChange={(e) => setSignupData({ ...signupData, state: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="pinCode" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Pin Code</label>
                <input
                  type="text"
                  id="pinCode"
                  value={signupData.pinCode}
                  onChange={(e) => setSignupData({ ...signupData, pinCode: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
                  required
                />
              </motion.div>
            </div>
          </motion.div>

          {/* Preferences */}
          <motion.div 
            className={`space-y-6 p-6 rounded-xl ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-2">Preferences</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={inputVariants} whileFocus="focus" animate="blur" transition={{ duration: 0.2 }}>
                <label htmlFor="timeZone" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Time Zone</label>
                <select
                  id="timeZone"
                  value={signupData.timeZone}
                  onChange={(e) => setSignupData({ ...signupData, timeZone: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
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
                <label htmlFor="role" className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-secondary'} mb-1`}>Role</label>
                <select
                  id="role"
                  value={signupData.role}
                  onChange={(e) => setSignupData({ ...signupData, role: e.target.value as Role })}
                  className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-primary/20 transition-all duration-200 shadow-sm ${isDarkMode ? 'bg-black border-gray-600 text-white focus:ring-blue-400/20' : 'bg-white/50 border-gray-200 text-primary'}`}
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
            whileHover={{ scale: 1.05, boxShadow: isDarkMode ? "0 8px 25px rgba(96, 165, 250, 0.3)" : "0 8px 25px rgba(79, 70, 229, 0.3)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full button py-4 text-lg font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            Create Account
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// About Component
const About: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="about" className="section">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-heading mb-4">About Us</h2>
          <p className="text-subheading max-w-2xl mx-auto">We're revolutionizing real estate transaction management with cutting-edge technology and user-centric design.</p> 
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1 }} className="card p-6">
                <div className="accent-primary mb-4"><Icon className="w-12 h-12" /></div>
                <h3 className="text-xl font-semibold mb-2 text-primary">{
feature.title}</h3>
                <p className="text-secondary">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Services Component
const Services: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="services" className="section">
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-heading mb-4">Our Services</h2>
          <p className="text-subheading max-w-2xl mx-auto">Comprehensive solutions tailored for every role in real estate transaction management</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: index * 0.1 }} className="group perspective">
                <div className="relative transform-style-3d transition-transform duration-500 group-hover:rotate-y-180">
                  <div className="card p-8">
                    <div className="accent-primary mb-6"><Icon className="w-12 h-12" /></div>
                    <h3 className="text-2xl font-semibold mb-4 text-primary">{service.title}</h3>
                    <p className="text-secondary mb-4">{service.description}</p>
                  </div>
                  <div className="absolute inset-0 bg-gradient-theme text-white p-8 rounded-xl shadow-lg backface-hidden rotate-y-180">
                    <h4 className="text-xl font-semibold mb-4">Key Features</h4>
                    <ul className="space-y-2">
                      {service.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-white rounded-full" />{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// Team Popup Component
const TeamPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
        className="bg-primary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full"
        >
          <X className="w-6 h-6 text-primary" />
        </button>
        <div className="p-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-heading mb-4">Our Team</h2>
            <p className="text-subheading max-w-2xl mx-auto">
              Meet the passionate individuals driving innovation in real estate technology.
            </p>
          </motion.div>
          <div className=" grid place-items-center md:grid-cols-1 lg:grid-cols-1 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card overflow-hidden"
              >
                <div className="relative group">
                  <div className=" w-full aspect-[3/4] relative">
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 sm:group-hover:opacity-100 transition-all duration-500 flex items-center justify-center space-x-3">
                    <a href={member.social.linkedin} className="text-white hover:text-indigo-400">
                      <Linkedin className="w-5 h-5" />
                    </a>
                    <a href={member.social.twitter} className="text-white hover:text-indigo-400">
                      <Twitter className="w-5 h-5" />
                    </a>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <h3 className="text-lg font-semibold mb-1 text-primary">{member.name}</h3>
                  <p className="text-secondary text-sm">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Pricing Popup Component
const PricingPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

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
        className="bg-primary rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-secondary rounded-full"
        >
          <X className="w-6 h-6 text-primary" />
        </button>
        <div className="p-8">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-heading mb-4">Simple, Transparent Pricing</h2>
            <p className="text-subheading max-w-2xl mx-auto">Choose the perfect plan for your real estate business needs</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative card overflow-hidden ${plan.popular ? "ring-4 ring-accent-primary" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-theme text-white px-4 py-1 rounded-bl-lg flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">Most Popular</span>
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-primary">{plan.name}</h3>
                  <p className="text-secondary mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-primary">${plan.price}</span>
                    <span className="text-secondary">/month</span>
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={`w-full button mb-8 ${plan.popular ? "" : "bg-secondary text-primary"}`}>
                    Get Started
                  </motion.button>
                  <div className="space-y-4">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="w-5 h-5 accent-primary flex-shrink-0" />
                        <span className="text-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Contact Component
const Contact: React.FC = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="contact" className="section bg-primary min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
          <h2 className="text-heading mb-4 bg-gradient-theme bg-clip-text text-transparent">Get in Touch</h2>
          <p className="text-subheading max-w-2xl mx-auto">We'd love to hear from you. Drop us a line and we\'ll get back to you shortly.</p> 
        </motion.div>
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6 }} className="space-y-8">
            <div className="card p-8">
              <h2 className="text-2xl font-semibold text-primary mb-8">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-center space-x-4 group">
                  <div className="bg-secondary p-4 rounded-2xl group-hover:bg-primary"><Phone className="w-6 h-6 accent-primary" /></div>
                  <div className="transform group-hover:translate-x-1"><p className="text-sm text-secondary">Call Us</p><p className="text-primary font-medium">+91 8989898989</p></div>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="bg-secondary p-4 rounded-2xl group-hover:bg-primary"><Mail className="w-6 h-6 accent-primary" /></div>
                  <div className="transform group-hover:translate-x-1"><p className="text-sm text-secondary">Email Us</p><p className="text-primary font-medium">rohitchoukiker21@gmail.com</p></div>
                </div>
                <div className="flex items-center space-x-4 group">
                  <div className="bg-secondary p-4 rounded-2xl group-hover:bg-primary"><MapPin className="w-6 h-6 accent-primary" /></div>
                  <div className="transform group-hover:translate-x-1"><p className="text-sm text-secondary">Visit Us</p><p className="text-primary font-medium">123 Business Street, Suite 100<br />Indore, MP 453441</p></div>
                </div>
              </div>
              <div className="mt-12 pt-8 border-t border-theme">
                <h3 className="text-lg font-semibold text-primary mb-6">Connect With Us</h3>
                <div className="flex space-x-6">
                  <a href="#" className="bg-secondary p-4 rounded-2xl hover:bg-primary"><Github className="w-5 h-5 text-secondary" /></a>
                  <a href="#" className="bg-secondary p-4 rounded-2xl hover:bg-primary"><Linkedin className="w-5 h-5 text-secondary" /></a>
                  <a href="#" className="bg-secondary p-4 rounded-2xl hover:bg-primary"><Twitter className="w-5 h-5 text-secondary" /></a>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.form
            action="https://formsubmit.co/rohitchoukiker2803@gmail.com"
            method="POST"
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="card p-8"
          >
            <div className="space-y-8">
              <div><label htmlFor="name" className="block text-sm font-medium text-secondary mb-2">Your Name</label><input type="text" id="name" name="name" className="input" required /></div>
              <div><label htmlFor="email" className="block text-sm font-medium text-secondary mb-2">Email Address</label><input type="email" id="email" name="email" className="input" required /></div>
              <div><label htmlFor="message" className="block text-sm font-medium text-secondary mb-2">Message</label><textarea id="message" name="message" rows={4} className="input resize-none" required /></div>
              <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full button flex items-center justify-center space-x-2">
                Send Message <Send className="w-4 h-4 animate-pulse" />
              </motion.button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer: React.FC = () => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-primary text-secondary py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">About</h3>
            <p className="text-secondary">Streamlining real estate transactions with innovative technology solutions.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Quick Links</h3>
            <ul className="space-y-2">
              {menuItems.map((item) => (
                <li key={item.name}><a href={item.href} className="text-secondary hover:text-primary transition-colors">{item.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Services</h3>
            <ul className="space-y-2">
              <li className="text-secondary">Transaction Management</li>
              <li className="text-secondary">Task Coordination</li>
              <li className="text-secondary">Brokerage Oversight</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-primary">Contact</h3>
            <ul className="space-y-2 text-secondary">
              <li>001 Business </li>
              <li>Bengaluru, CA 94107</li>
              <li>contact@realestate.com</li>
              <li>+91 9898989898</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-theme pt-8 flex justify-between items-center">
          <p className="text-secondary">© {new Date().getFullYear()} Real Estate Manager. All rights reserved.</p>
          <motion.button onClick={scrollToTop} whileHover={{ y: -5 }} className="button p-3 rounded-full"><ArrowUp className="w-6 h-6" /></motion.button>
        </div>
      </div>
    </footer>
  );
};

// Main Page Component
const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  // Hero Component with single Get Started button
  const HeroWithLogin: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === backgroundImages.length - 1 ? 0 : prev + 1));
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    return (
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden">
        {backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{
              opacity: index === currentImageIndex ? 1 : 0,
              scale: index === currentImageIndex ? 1 : 1.1,
            }}
            transition={{
              duration: 1.5,
              ease: "easeInOut",
              opacity: { duration: 1 },
              scale: { duration: 1.5 },
            }}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-center text-white max-w-4xl mx-auto"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight tracking-tight">
              Revolutionize Your<br />
              <span className="text-transparent bg-clip-text bg-gradient-theme">Real Estate Journey</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-secondary max-w-3xl mx-auto leading-relaxed">
              Transform your real estate transactions with our cutting-edge, user-friendly platform designed for seamless efficiency.
            </p>
            <motion.button
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowLoginPopup(true)}
              className="button inline-flex items-center gap-3 px-8 py-4 text-lg font-bold shadow-md hover:shadow-lg"
            >
              Get Started <ArrowRight className="w-6 h-6 animate-pulse" />
            </motion.button>
          </motion.div>
        </div>
      </section>
    );
  };

  const handleOpenSignup = () => {
    setShowLoginPopup(false);
    setShowSignupPopup(true);
  };

  return (
    <>
      <Head>
        <title>Real Estate Manager</title>
        <meta name="description" content="Revolutionize your real estate journey" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-primary text-primary'}`}>
        <Navbar
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          setShowPricingPopup={setShowPricingPopup}
          setShowTeamPopup={setShowTeamPopup}
        />
        <HeroWithLogin />
        <About />
        <Services />
        <Contact />
        <Footer />
        <AnimatePresence>
          {showPricingPopup && <PricingPopup onClose={() => setShowPricingPopup(false)} />}
          {showTeamPopup && <TeamPopup onClose={() => setShowTeamPopup(false)} />}
          {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} openSignup={handleOpenSignup} isDarkMode={isDarkMode} />}
          {showSignupPopup && <SignupPopup onClose={() => setShowSignupPopup(false)} isDarkMode={isDarkMode} />}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Home;