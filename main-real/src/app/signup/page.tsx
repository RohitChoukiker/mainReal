'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Building2, ChevronDown } from 'lucide-react';
import Link from "next/link"
type Role = 'broker' | 'agent' | 'tc';

interface FormData {
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

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    mobile: '',
    companyName: '',
    teamName: '',
    address: '',
    companyPhone: '',
    city: '',
    state: '',
    pinCode: '',
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    role: 'agent'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const isPasswordStrong = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
    return minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="md:w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
              alt="Modern office building"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/40 flex items-center justify-center">
              <div className="text-center text-white p-6">
                <Building2 className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Join Our Network</h2>
                <p className="text-lg">Connect with the best in real estate</p>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="md:w-1/2 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create Your Account</h1>
                <p className="text-gray-600 mt-2">Start your journey in real estate today</p>
              </div>

              {/* Role Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Role
                </label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                  >
                    <option value="broker">Broker</option>
                    <option value="agent">Agent</option>
                    <option value="tc">Transaction Coordinator</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Two columns grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300 border py-2 px-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      ) : (
                        <Eye className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {formData.password && !isPasswordStrong(formData.password) && (
                    <p className="text-red-500 text-xs mt-1">
                      Password must contain at least 8 characters, including uppercase, lowercase, number, and special character
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Name
                  </label>
                  <input
                    type="text"
                    name="teamName"
                    value={formData.teamName}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Phone
                  </label>
                  <input
                    type="tel"
                    name="companyPhone"
                    required
                    value={formData.companyPhone}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pin Code
                    </label>
                    <input
                      type="text"
                      name="pinCode"
                      required
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time Zone
                  </label>
                  <select
                    name="timeZone"
                    value={formData.timeZone}
                    onChange={handleInputChange}
                    className="block w-full rounded-lg border-gray-300 border py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {Intl.supportedValuesOf('timeZone').map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Create Account
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Login Instead
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;