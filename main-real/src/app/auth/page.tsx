

'use client';

import { useState } from 'react';
import { Building2, ChevronDown, Eye, EyeOff } from 'lucide-react';
// import { useRouter } from 'next/navigation';
import Image from 'next/image';

type Role = 'broker' | 'agent' | 'tc';

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

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // For Login Password and Signup Password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // For Signup Confirm Password
  // const router = useRouter();

  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
    role: 'agent',
  });

  const [signupData, setSignupData] = useState<SignupData>({
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
    role: 'agent',
  });

  const timeZones = [
    'UTC',
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Denver',
    'America/Phoenix',
    'America/Anchorage',
    'America/Honolulu',
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Dubai',
    'Asia/Kolkata',
    'Asia/Singapore',
    'Asia/Hong_Kong',
    'Australia/Sydney',
    'Australia/Melbourne',
    'Pacific/Auckland',
    'Africa/Johannesburg',
    'Africa/Cairo',
    'America/Toronto',
    'America/Sao_Paulo',
    'America/Mexico_City',
  ];

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    //try {
    //   const res = await fetch('/api/auth/login', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(loginData),
    //   });
    //   if (!res.ok) throw new Error('Login failed');
    //   const data = await res.json();
    //   const roleRoutes = {
    //     broker: '/dashboard/Broker',
    //     agent: '/dashboard/Agent',
    //     tc: '/dashboard/tc',
    //   };
    //   router.push(roleRoutes[loginData.role]);
    // } catch (error) {
    //   console.error('Login error:', error);
    //   alert('Login failed. Please try again.');
    // }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // if (signupData.password !== signupData.confirmPassword) {
    //   alert('Passwords do not match');
    //   return;
    // }
    // try {
    //   const res = await fetch('/api/auth/signup', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(signupData),
    //   });
    //   if (!res.ok) throw new Error('Signup failed');
    //   const data = await res.json();
    //   const roleRoutes = {
    //     broker: '/dashboard/Broker',
    //     agent: '/dashboard/Agent',
    //     tc: '/dashboard/tc',
    //   };
    //   router.push(roleRoutes[signupData.role]);
    // } catch (error) {
    //   console.error('Signup error:', error);
    //   alert('Signup failed. Please try again.');
    //}
  };

  return (
    <div className="h-screen w-screen bg-gray-50 p-4 flex items-center justify-center">
      <div className="h-full w-full bg-white rounded-2xl flex flex-col md:flex-row overflow-hidden border border-gray-200 shadow-lg">
        {/* Left Side - Image */}
        <div className="w-full md:w-1/2 h-1/3 md:h-full relative bg-gray-100">
          <Image
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80"
            alt="Modern office building"
            layout="fill"
            objectFit="cover"
            className="w-full h-full rounded-l-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent flex items-center justify-center">
            <div className="text-center text-white p-6">
              <Building2 className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">
                {isLogin ? 'Welcome Back' : 'Join Us'}
              </h2>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full hover:bg-white/30 transition-all duration-300 border border-white/30"
              >
                {isLogin ? 'Create Account' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div className="w-full md:w-1/2 h-2/3 md:h-full bg-white flex items-center justify-center relative overflow-hidden">
          <div className="w-full max-w-lg p-6">
            {/* Login Form */}
            <div
              className={`absolute inset-0 p-6 transition-all duration-500 ease-in-out transform ${
                isLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
              }`}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Sign In</h1>
              <p className="text-gray-600 mb-6">Access your dashboard</p>
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <div className="relative">
                    <select
                      value={loginData.role}
                      onChange={(e) => setLoginData({ ...loginData, role: e.target.value as Role })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all duration-200"
                      required
                    >
                      <option value="broker">Broker</option>
                      <option value="agent">Agent</option>
                      <option value="tc">Transaction Coordinator</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-all duration-300 shadow-sm"
                >
                  Sign In
                </button>
              </form>
            </div>

            {/* Signup Form */}
            <div
              className={`absolute inset-0 p-6 transition-all duration-500 ease-in-out transform ${
                !isLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
              }`}
            >
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600 mb-6">Join our network</p>
              <form onSubmit={handleSignupSubmit} className="space-y-5 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={signupData.name}
                      onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={signupData.email}
                      onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupData.confirmPassword}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      value={signupData.mobile}
                      onChange={(e) => setSignupData({ ...signupData, mobile: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Phone</label>
                    <input
                      type="tel"
                      value={signupData.companyPhone}
                      onChange={(e) => setSignupData({ ...signupData, companyPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={signupData.companyName}
                      onChange={(e) => setSignupData({ ...signupData, companyName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Team Name</label>
                    <input
                      type="text"
                      value={signupData.teamName}
                      onChange={(e) => setSignupData({ ...signupData, teamName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                    <input
                      type="text"
                      value={signupData.address}
                      onChange={(e) => setSignupData({ ...signupData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      value={signupData.city}
                      onChange={(e) => setSignupData({ ...signupData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      value={signupData.state}
                      onChange={(e) => setSignupData({ ...signupData, state: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pin Code</label>
                    <input
                      type="text"
                      value={signupData.pinCode}
                      onChange={(e) => setSignupData({ ...signupData, pinCode: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                    <div className="relative">
                      <select
                        value={signupData.timeZone}
                        onChange={(e) => setSignupData({ ...signupData, timeZone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none max-h-40 overflow-y-auto transition-all duration-200"
                        required
                      >
                        {timeZones.map((tz) => (
                          <option key={tz} value={tz}>
                            {tz}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                    <div className="relative">
                      <select
                        value={signupData.role}
                        onChange={(e) => setSignupData({ ...signupData, role: e.target.value as Role })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none transition-all duration-200"
                        required
                      >
                        <option value="broker">Broker</option>
                        <option value="agent">Agent</option>
                        <option value="tc">Transaction Coordinator</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-3 rounded-md font-medium hover:bg-indigo-700 transition-all duration-300 shadow-sm mt-6"
                >
                  Create Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


