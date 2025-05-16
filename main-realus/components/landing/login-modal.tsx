"use client";

import type React from "react";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { X, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dynamic from "next/dynamic";
import { setUser } from "@/utils/auth";

// Dynamically import ToastContainer with no SSR to improve initial load time
const ToastContainer = dynamic(
  () => import("react-toastify").then((mod) => mod.ToastContainer),
  { ssr: false }
);

interface LoginModalProps {
  onClose: () => void;
  onSignupClick: () => void;
}

export default function LoginModal({
  onClose,
  onSignupClick,
}: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "",
    rememberMe: "",
  });

  const router = useRouter();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Start navigation preparation in parallel with API request
      const prefetchPromises = [
        router.prefetch("/agent/dashboard"),
        router.prefetch("/broker/dashboard"),
        router.prefetch("/tc/dashboard")
      ];
      
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          rememberMe: formData.rememberMe,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user data immediately using our auth utility
        setUser(data.user);
        localStorage.setItem("rememberMe", formData.rememberMe);
        
        // Close modal immediately
        onClose();
        
        // Show toast in background
        toast.success("Login successful!");

        // Navigate immediately without delay
        switch (data.user.role) {
          case "Agent":
            router.push("/agent/dashboard");
            break;
          case "Broker":
            router.push("/broker/dashboard");
            break;
          case "Tc":
            router.push("/tc/dashboard");
            break;
          default:
            console.log("Unknown role:", data.user.role);
            router.push("/"); // Default route
        }
      } else {
        toast.error(data.message || "Login failed!");
      }
      
      // Ensure prefetch promises are resolved
      await Promise.all(prefetchPromises);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, router, onClose]);

  const handleChange = useCallback((
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        className="bg-background rounded-xl shadow-xl w-full max-w-md relative overflow-hidden"
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
            <h2 className="text-2xl font-bold text-foreground">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-foreground"
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
                  className="block w-full pl-10 pr-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
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
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-2 border border-border bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
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
                htmlFor="role"
                className="block text-sm font-medium text-foreground"
              >
                Select Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-border bg-background text-foreground rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                disabled={isLoading}
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="Agent">Agent</option>
                <option value="Broker">Broker</option>
                <option value="Tc">Transaction Coordinator</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => {
                    setRememberMe(e.target.checked);
                    setFormData((prev) => ({
                      ...prev,
                      rememberMe: e.target.checked.toString(),
                    }));
                  }}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  disabled={isLoading}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-foreground"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={onSignupClick}
                className="font-medium text-primary hover:text-primary/80"
                disabled={isLoading}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
      <ToastContainer />
    </div>
  );
}
