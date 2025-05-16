import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isApproved: boolean;
  brokerId?: string;
  token: string;
}

interface DecodedToken {
  id: string;
  role: string;
  isApproved: boolean;
  exp: number;
  iat: number;
}

// Safe way to check if we're in a browser environment
// This prevents issues during SSR
const isBrowser = () => typeof window !== 'undefined';

// Get user from localStorage
export const getUser = (): User | null => {
  if (!isBrowser()) return null;
  
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    return null;
  }
};

// Get token from localStorage
export const getToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem('token');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (!isBrowser()) return false;
  
  const token = getToken();
  if (!token) return false;
  
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    
    // Check if token is expired
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
      // Token is expired, clear localStorage
      logout();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Failed to decode token:', error);
    return false;
  }
};

// Get user role
export const getUserRole = (): string | null => {
  if (!isBrowser()) return null;
  
  const user = getUser();
  return user?.role || null;
};

// Check if user has specific role
export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

// Logout user
export const logout = (): void => {
  if (!isBrowser()) return;
  
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('rememberMe');
  
  // Redirect to landing page
  window.location.href = '/landing';
};

// Set user in localStorage
export const setUser = (user: User): void => {
  if (!isBrowser()) return;
  
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', user.token);
  localStorage.setItem('role', user.role);
};

// Check if user is approved
export const isUserApproved = (): boolean => {
  if (!isBrowser()) return false;
  
  const user = getUser();
  return user?.isApproved || false;
};