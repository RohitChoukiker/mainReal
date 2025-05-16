"use client";

import type React from "react";
import { useState, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";

// Dynamically import ToastContainer with no SSR to improve initial load time
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);
import {
  X,
  Mail,
  Lock,
  User,
  Building,
  MapPin,
  Phone,
  Clock,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";

interface SignupModalProps {
  onClose: () => void;
  onLoginClick: () => void;
}

function SignupModal({
  onClose,
  onLoginClick,
}: SignupModalProps) {
  const [formData, setFormData] = useState({
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
    brokerId: "",
    role: "Agent", // Matches the Role enum in userModel.ts
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalSteps = 2;

  const generateBrokerId = useCallback(() => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id = "";
    for (let i = 0; i < 11; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData((prev) => ({ ...prev, brokerId: id }));
  }, []);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // If changing role to Broker, generate a broker ID automatically
    if (name === 'role' && value === 'Broker') {
      setFormData((prev) => ({ ...prev, [name]: value }));
      generateBrokerId();
    } 
    // If changing from Broker to another role, clear the broker ID
    else if (name === 'role' && formData.role === 'Broker') {
      setFormData((prev) => ({ ...prev, [name]: value, brokerId: '' }));
    }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }, [formData.role, generateBrokerId]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      return;
    }

    // Validate form data
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill all required fields");
      return;
    }
    
    // Check if broker ID is required but not provided
    if (formData.role !== "Broker" && !formData.brokerId) {
      toast.error("Broker ID is required for your role");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setLoading(true);

    try {
      // Prepare form data before API call to avoid delays
      const formDataToSend = { ...formData };
      
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataToSend),
      });

      const data = await response.json();

      if (response.ok) {
        // Close modal immediately for better UX
        onClose();
        
        // Show success message
        toast.success("Account created successfully!");
        
        // Optionally redirect to login or dashboard
        // You could add a redirect here if needed
      } else {
        toast.error(data.message || "Failed to create account");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during signup");
      console.error("Signup Error:", err.message);
    } finally {
      setLoading(false);
    }
  }, [currentStep, totalSteps, formData, onClose]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center pt-56 overflow-y-auto">
      <ToastContainer />

      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative overflow-hidden my-8"
        initial={{ opacity: 0.9, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create an Account
            </h2>
            <p className="text-gray-600">
              Join our platform to streamline your real estate transactions
            </p>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div key={index} className="flex-1 flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep > index + 1
                        ? "bg-green-500 text-white"
                        : currentStep === index + 1
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {currentStep > index + 1 ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < totalSteps - 1 && (
                    <div
                      className={`flex-1 h-1 ${
                        currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Account Information</span>
              <span className="text-xs text-gray-500">Company Details</span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter Your Name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Enter Your Email"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="mobile"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="mobile"
                      name="mobile"
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="brokerId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {formData.role === "TransactionCoordinator" ? "Your Broker's ID" : "Broker Id"}
                  </label>
                  <div className="relative flex items-center space-x-2">
                    <input
                      id="brokerId"
                      name="brokerId"
                      type="text"
                      required={formData.role !== "Broker" && formData.role !== ""}
                      maxLength={11}
                      value={formData.brokerId}
                      onChange={handleChange}
                      className="block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder={formData.role === "TransactionCoordinator" ? "Enter your broker's ID" : "Enter Broker Id"}
                    />
                    {formData.role === "Broker" && (
                      <button
                        type="button"
                        onClick={generateBrokerId}
                        className="px-3 py-2 bg-primary text-white text-sm rounded-md shadow-sm hover:bg-primary-dark"
                      >
                        Create
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                    className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  >
                    <option value="Agent">Agent</option>
                    <option value="Broker">Broker</option>
                    <option value="TransactionCoordinator">Transaction Coordinator</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="companyName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="companyName"
                        name="companyName"
                        type="text"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                        placeholder="Acme Real Estate"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="teamName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Team Name (Optional)
                    </label>
                    <input
                      id="teamName"
                      name="teamName"
                      type="text"
                      value={formData.teamName}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Sales Team"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="address"
                      name="address"
                      type="text"
                      value={formData.address}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="123 Main St, Suite 100"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="companyPhone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Company Phone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="companyPhone"
                      name="companyPhone"
                      type="tel"
                      value={formData.companyPhone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Company Phone Number"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="Austin"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={formData.state}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="TX"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="pinCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP Code
                    </label>
                    <input
                      id="pinCode"
                      name="pinCode"
                      type="text"
                      value={formData.pinCode}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                      placeholder="78701"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="timeZone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Time Zone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="timeZone"
                      name="timeZone"
                      value={formData.timeZone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                    >
                      <option value="UTC">
                        UTC (Coordinated Universal Time)
                      </option>
                      <option value="EST">EST (Eastern Standard Time)</option>
                      <option value="CST">CST (Central Standard Time)</option>
                      <option value="MST">MST (Mountain Standard Time)</option>
                      <option value="PST">PST (Pacific Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={goToPreviousStep}
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {loading
                  ? "Processing..."
                  : currentStep < totalSteps
                  ? "Next"
                  : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="font-medium text-primary hover:text-primary/80"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default memo(SignupModal);
