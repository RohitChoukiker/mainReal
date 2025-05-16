"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Globe, Rocket, Sparkles } from "lucide-react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(100);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col items-center justify-center z-50">
      <div className="relative mb-4">
        <Globe
          className="w-16 h-16 text-orange-500 animate-spin-slow"
          strokeWidth={1.5}
        />
        <Rocket
          className="w-8 h-8 text-orange-600 absolute -top-2 right-0 transform rotate-45"
          strokeWidth={1.5}
        />
        <Sparkles
          className="w-6 h-6 text-yellow-400 absolute bottom-0 left-0"
          strokeWidth={1.5}
        />
      </div>
      
      <div className="text-2xl font-bold mb-6">
        <span className="bg-gradient-to-r from-orange-800 to-orange-500 text-transparent bg-clip-text">
          Real
        </span>
        <span>us</span>
      </div>
      
      <div className="w-64 h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "5%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}