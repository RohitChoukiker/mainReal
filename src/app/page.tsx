import React, { useState, useEffect } from 'react';

// Main Page Component
const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showPricingPopup, setShowPricingPopup] = useState(false);
  const [showTeamPopup, setShowTeamPopup] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showSignupPopup, setShowSignupPopup] = useState(false);

  useEffect(() => {
    // Set dark mode class on initial load
    document.documentElement.classList.add("dark");
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    // Rest of the component code...
  );
};

export default Home; 