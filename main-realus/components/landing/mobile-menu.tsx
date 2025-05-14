"use client"

import { motion } from "framer-motion"
import { X, Home, Info, Briefcase, Phone, DollarSign, LogIn } from "lucide-react"

interface MobileMenuProps {
  onClose: () => void
  activeSection: string
  scrollToSection: (section: string) => void
  openLoginModal: () => void
  openPricingModal: () => void
}

export default function MobileMenu({
  onClose,
  activeSection,
  scrollToSection,
  openLoginModal,
  openPricingModal,
}: MobileMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/95 z-50 flex flex-col p-4 overflow-y-auto"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">Realus</span>
        </div>
        <button 
          onClick={onClose} 
          className="text-white p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col space-y-5 py-4">
        {[
          { id: "home", label: "Home", icon: <Home className="h-6 w-6" /> },
          { id: "about", label: "About", icon: <Info className="h-6 w-6" /> },
          { id: "services", label: "Services", icon: <Briefcase className="h-6 w-6" /> },
          { id: "contact", label: "Contact", icon: <Phone className="h-6 w-6" /> },
        ].map(({ id, label, icon }) => (
          <motion.button
            key={id}
            onClick={() => scrollToSection(id)}
            className={`flex items-center space-x-4 text-xl p-3 rounded-lg w-full ${
              activeSection === id 
                ? "bg-primary text-white font-medium" 
                : "text-white hover:bg-gray-800 transition-colors"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {icon}
            <span>{label}</span>
          </motion.button>
        ))}

        <div className="border-t border-gray-700 my-2 pt-4">
          <motion.button 
            onClick={() => {
              openPricingModal();
              onClose(); // Close the mobile menu when opening the pricing modal
            }} 
            className="flex items-center space-x-4 text-xl p-3 rounded-lg w-full text-white hover:bg-gray-800 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <DollarSign className="h-6 w-6" />
            <span>Pricing</span>
          </motion.button>
        </div>

        <div className="mt-auto pt-4">
          <motion.button 
            onClick={() => {
              openLoginModal();
              onClose(); // Close the mobile menu when opening the login modal
            }} 
            className="flex items-center justify-center space-x-3 text-xl bg-primary text-white p-4 rounded-lg w-full hover:bg-primary/90 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <LogIn className="h-6 w-6" />
            <span>Login / Sign Up</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}

