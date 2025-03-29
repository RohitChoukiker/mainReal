"use client"

import { motion } from "framer-motion"
import { X, Home, Info, Briefcase, Phone, DollarSign, Users, LogIn } from "lucide-react"

interface MobileMenuProps {
  onClose: () => void
  activeSection: string
  scrollToSection: (section: string) => void
  openLoginModal: () => void
  openPricingModal: () => void
  openTeamModal: () => void
}

export default function MobileMenu({
  onClose,
  activeSection,
  scrollToSection,
  openLoginModal,
  openPricingModal,
  openTeamModal,
}: MobileMenuProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/90 z-50 flex flex-col p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-end">
        <button onClick={onClose} className="text-white p-2">
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        <button
          onClick={() => scrollToSection("home")}
          className={`flex items-center space-x-3 text-xl ${activeSection === "home" ? "text-primary font-medium" : "text-white"}`}
        >
          <Home className="h-6 w-6" />
          <span>Home</span>
        </button>

        <button
          onClick={() => scrollToSection("about")}
          className={`flex items-center space-x-3 text-xl ${activeSection === "about" ? "text-primary font-medium" : "text-white"}`}
        >
          <Info className="h-6 w-6" />
          <span>About</span>
        </button>

        <button
          onClick={() => scrollToSection("services")}
          className={`flex items-center space-x-3 text-xl ${activeSection === "services" ? "text-primary font-medium" : "text-white"}`}
        >
          <Briefcase className="h-6 w-6" />
          <span>Services</span>
        </button>

        <button
          onClick={() => scrollToSection("contact")}
          className={`flex items-center space-x-3 text-xl ${activeSection === "contact" ? "text-primary font-medium" : "text-white"}`}
        >
          <Phone className="h-6 w-6" />
          <span>Contact</span>
        </button>

        <button onClick={openPricingModal} className="flex items-center space-x-3 text-xl text-white">
          <DollarSign className="h-6 w-6" />
          <span>Pricing</span>
        </button>

        <button onClick={openTeamModal} className="flex items-center space-x-3 text-xl text-white">
          <Users className="h-6 w-6" />
          <span>Our Team</span>
        </button>

        <button onClick={openLoginModal} className="flex items-center space-x-3 text-xl text-white mt-6">
          <LogIn className="h-6 w-6" />
          <span>Login</span>
        </button>
      </div>
    </motion.div>
  )
}

