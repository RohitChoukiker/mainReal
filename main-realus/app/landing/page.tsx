"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
// import { Hexagon, Gem } from "lucide-react"
import { Globe, Rocket, Sparkles ,X } from "lucide-react"
import {
  Home,
  Info,
  Briefcase,
  Phone,
  DollarSign,
  Users,
  ChevronRight,
  Mail,
  Building,
  MapPin,
  Clock,
  UserCheck,
  ClipboardCheck,
  FileText,
  CheckSquare,
  MessageSquare,
  BarChart,
  Menu,
} from "lucide-react"
import Image from "next/image"

// Modal Components
import LoginModal from "@/components/landing/login-modal"
import SignupModal from "@/components/landing/signup-modal"
import PricingModal from "@/components/landing/pricing-modal"
import TeamModal from "@/components/landing/team-modal"
import MobileMenu from "@/components/landing/mobile-menu"

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState("home")
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)
  const [isPricingModalOpen, setIsPricingModalOpen] = useState(false)
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      // Determine active section based on scroll position
      const sections = ["home", "about", "services", "contact"]
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80 // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      })
    }
    setIsMobileMenuOpen(false)
  }

  const openLoginModal = () => {
    setIsLoginModalOpen(true)
    setIsSignupModalOpen(false)
    setIsMobileMenuOpen(false)
  }

  const openSignupModal = () => {
    setIsSignupModalOpen(true)
    setIsLoginModalOpen(false)
    setIsMobileMenuOpen(false)
  }


  
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      {/* <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 10 ? "bg-white shadow-md py-3" : "bg-transparent py-5"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
          <div className="relative">
                  <Globe className="w-10 h-10 text-orange-500 animate-spin-slow" strokeWidth={1.5} />
                  <Rocket className="w-6 h-6 text-orange-600 absolute -top-1 right-0 transform rotate-45" strokeWidth={1.5} />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute bottom-0 left-0" strokeWidth={1.5} />
                </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-800 to-orange-500 text-transparent bg-clip-text">Real</span>
              <span className="text-2xl font-bold">us</span>
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            {[
              { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
              { id: "about", label: "About", icon: <Info className="h-4 w-4" /> },
              { id: "services", label: "Services", icon: <Briefcase className="h-4 w-4" /> },
              { id: "contact", label: "Contact", icon: <Phone className="h-4 w-4" /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`flex items-center space-x-1 ${activeSection === id ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
            <button
              onClick={() => setIsPricingModalOpen(true)}
              className="flex items-center space-x-1 text-gray-600 hover:text-primary"
            >
              <DollarSign className="h-4 w-4" />
              <span>Pricing</span>
            </button>
            <button
              onClick={() => setIsTeamModalOpen(true)}
              className="flex items-center space-x-1 text-gray-600 hover:text-primary"
            >
              <Users className="h-4 w-4" />
              <span>Our Team</span>
            </button>
          </div>
          <div className="hidden md:block">
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              Login
            </button>
          </div>
          <div className="md:hidden">
            <button className="text-gray-600 p-1" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav> */}

<nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrollY > 10 ? "bg-white shadow-md py-3" : "bg-transparent py-5"}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Globe className="w-10 h-10 text-orange-500 animate-spin-slow" strokeWidth={1.5} />
              <Rocket className="w-6 h-6 text-orange-600 absolute -top-1 right-0 transform rotate-45" strokeWidth={1.5} />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute bottom-0 left-0" strokeWidth={1.5} />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-800 to-orange-500 text-transparent bg-clip-text">Real</span>
              <span className="text-2xl font-bold">us</span>
            </div>
          </div>
          <div className="hidden md:flex space-x-8">
            {[
              { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
              { id: "about", label: "About", icon: <Info className="h-4 w-4" /> },
              { id: "services", label: "Services", icon: <Briefcase className="h-4 w-4" /> },
              { id: "contact", label: "Contact", icon: <Phone className="h-4 w-4" /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className={`flex items-center space-x-1 ${activeSection === id ? "text-primary font-medium" : "text-gray-600 hover:text-primary"}`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
            <button className="flex items-center space-x-1 text-gray-600 hover:text-primary">
              <DollarSign className="h-4 w-4" />
              <span>Pricing</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-600 hover:text-primary">
              <Users className="h-4 w-4" />
              <span>Our Team</span>
            </button>
          </div>
          <div className="hidden md:block">
            <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">Login</button>
          </div>
          <div className="md:hidden flex items-center">
            <button className="text-gray-600 p-2 focus:outline-none" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 flex flex-col space-y-4 items-center md:hidden">
          {[
            { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
            { id: "about", label: "About", icon: <Info className="h-4 w-4" /> },
            { id: "services", label: "Services", icon: <Briefcase className="h-4 w-4" /> },
            { id: "contact", label: "Contact", icon: <Phone className="h-4 w-4" /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className="flex items-center space-x-2 text-gray-600 hover:text-primary"
            >
              {icon}
              <span>{label}</span>
            </button>
          ))}
          <button className="text-gray-600 hover:text-primary flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <DollarSign className="h-4 w-4" />
            <span>Pricing</span>
          </button>
          <button className="text-gray-600 hover:text-primary flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
            <Users className="h-4 w-4" />
            <span>Our Team</span>
          </button>
        </div>
      )}
    </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <MobileMenu
            onClose={() => setIsMobileMenuOpen(false)}
            activeSection={activeSection}
            scrollToSection={scrollToSection}
            openLoginModal={openLoginModal}
            openPricingModal={() => setIsPricingModalOpen(true)}
            openTeamModal={() => setIsTeamModalOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="relative pt-28 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-blue-50 to-indigo-50">
  <div className="container mx-auto px-4">
    <div className="flex flex-col md:flex-row items-center">
      {/* Left Content */}
      <motion.div
        className="md:w-1/2 mb-8 md:mb-0"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-gray-900">
          Streamline Your Real Estate Transactions
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Our powerful platform helps agents, brokers, and transaction coordinators manage the entire real estate
          transaction process efficiently.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={openLoginModal}
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors flex items-center shadow-lg"
          >
            <span>Get Started</span>
            <ChevronRight className="h-5 w-5 ml-2" />
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="border border-primary text-primary px-6 py-3 rounded-md hover:bg-primary/10 transition-colors"
          >
            Learn More
          </button>
        </div>
      </motion.div>

      {/* Right Images Grid */}
      <motion.div
        className="md:w-1/2 relative"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="relative grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <img
              src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=600"
              alt="Luxury Home"
              className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=600"
              alt="Modern Interior"
              className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="space-y-4 pt-8">
            <img
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600"
              alt="Luxury Villa"
              className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
            <img
              src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&q=80&w=600"
              alt="Modern House"
              className="rounded-2xl shadow-lg transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-purple-500/10 rounded-3xl"></div>
        </div>
      </motion.div>
    </div>
  </div>

  {/* Background Decorations */}
  <div className="absolute top-1/2 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
  <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
</section>


      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">About Our Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We've built a comprehensive solution to simplify the complex process of real estate transactions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Building className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Established in 2025</h3>
              <p className="text-gray-600">
                With years of experience in the real estate industry, we understand the challenges faced by
                professionals.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Trusted by Thousands</h3>
              <p className="text-gray-600">
                Our platform is used by thousands of real estate professionals across the country to manage their
                transactions.
              </p>
            </motion.div>

            <motion.div
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="bg-primary/10 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <UserCheck className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Customer-Focused</h3>
              <p className="text-gray-600">
                We continuously improve our platform based on feedback from our users to ensure it meets their needs.
              </p>
            </motion.div>
          </div>

          <motion.div
            className="mt-16 bg-gray-50 rounded-xl overflow-hidden shadow-md"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative h-64 md:h-auto">
                <Image src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80&w=800" alt="Our mission" fill className="object-cover" />
              </div>
              <div className="md:w-1/2 p-6 md:p-8">
                <h3 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h3>
                <p className="text-gray-600 mb-4">
                  At Realus, our mission is to simplify the complex world of real estate transactions. We
                  believe that technology should make the lives of real estate professionals easier, not more
                  complicated.
                </p>
                <p className="text-gray-600 mb-4">
                  Our platform is designed to streamline workflows, reduce paperwork, and improve communication between
                  all parties involved in a transaction.
                </p>
                <div className="flex items-center space-x-4 mt-6">
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-primary">5K+</span>
                    <span className="text-sm text-gray-500">Active Users</span>
                  </div>
                  <div className="h-10 border-r border-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-primary">50K+</span>
                    <span className="text-sm text-gray-500">Transactions</span>
                  </div>
                  <div className="h-10 border-r border-gray-300"></div>
                  <div className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-primary">98%</span>
                    <span className="text-sm text-gray-500">Satisfaction</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We offer a comprehensive suite of tools to streamline every aspect of real estate transactions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Transaction Management",
                description:
                  "Track and manage all your real estate transactions in one place, from listing to closing.",
                icon: <ClipboardCheck className="h-6 w-6 text-primary" />,
                image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Document Management",
                description:
                  "Securely store, share, and e-sign all transaction documents with clients and team members.",
                icon: <FileText className="h-6 w-6 text-primary" />,
                image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Task Automation",
                description:
                  "Automate routine tasks and workflows to save time and reduce errors in your transactions.",
                icon: <CheckSquare className="h-6 w-6 text-primary" />,
                image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Team Collaboration",
                description:
                  "Collaborate seamlessly with agents, transaction coordinators, and brokers on transactions.",
                icon: <Users className="h-6 w-6 text-primary" />,
                image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Client Communication",
                description: "Keep clients informed with automated updates and a client portal for transparency.",
                icon: <MessageSquare className="h-6 w-6 text-primary" />,
                image: "https://images.unsplash.com/photo-1553484771-371a605b060b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Analytics & Reporting",
                description: "Gain insights into your business performance with detailed analytics and custom reports.",
                icon: <BarChart className="h-6 w-6 text-primary" />,
                image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all group overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-semibold text-white">{service.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-primary/10 p-2 rounded-full">{service.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                  </div>
                  <p className="text-gray-600">{service.description}</p>
                  <button className="mt-4 text-primary font-medium flex items-center group-hover:underline">
                    Learn more
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">What Our Clients Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what real estate professionals have to say about our platform.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "This platform has completely transformed how I manage my transactions. I save at least 10 hours every week!",
                author: "Jennifer Williams",
                role: "Real Estate Agent",
                image: "/images/testimonial-1.jpg",
              },
              {
                quote:
                  "As a broker, I can finally keep track of all my agents' transactions in one place. The analytics are incredibly helpful.",
                author: "Michael Rodriguez",
                role: "Broker/Owner",
                image: "/images/testimonial-2.jpg",
              },
              {
                quote:
                  "The document management system is a game-changer. No more digging through emails to find that one attachment.",
                author: "Sarah Thompson",
                role: "Transaction Coordinator",
                image: "/images/testimonial-3.jpg",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 p-6 rounded-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center mb-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.author}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Contact Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about our platform? Get in touch with our team and we'll be happy to help.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8">
            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Send us a message</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </motion.div>

            <motion.div
              className="md:w-1/2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="bg-white p-6 rounded-xl shadow-md h-full">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Address</p>
                      <p className="text-gray-600">Indore, Madhya Pradesh
                      </p>
                      <p className="text-gray-600">India</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Phone</p>
                      <p className="text-gray-600">+91 123456789</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Email</p>
                      <p className="text-gray-600">info@realus.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-primary mr-3 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">Business Hours</p>
                      <p className="text-gray-600">Monday - Friday: 9am - 5pm</p>
                      <p className="text-gray-600">Saturday: 10am - 2pm</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="font-medium mb-2 text-gray-900">Follow Us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    
                    <a href="#" className="text-gray-600 hover:text-primary">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <Image src="/images/map.jpg" alt="Office location" fill className="object-cover" />
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                      <button className="bg-white text-primary px-4 py-2 rounded-md shadow-md hover:bg-gray-50 transition-colors">
                        View on Google Maps
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Building className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Realus</span>
              </div>
              <p className="text-gray-400 mb-4">
                Streamlining real estate transactions for professionals across the country.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#home" className="text-gray-400 hover:text-white">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-400 hover:text-white">
                    About
                  </a>
                </li>
                <li>
                  <a href="#services" className="text-gray-400 hover:text-white">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white">
                    Contact
                  </a>
                </li>
                <li>
                  <button onClick={() => setIsPricingModalOpen(true)} className="text-gray-400 hover:text-white">
                    Pricing
                  </button>
                </li>
                <li>
                  <button onClick={() => setIsTeamModalOpen(true)} className="text-gray-400 hover:text-white">
                    Our Team
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Transaction Management
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Document Management
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Task Automation
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Team Collaboration
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Client Communication
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Analytics & Reporting
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    GDPR Compliance
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white">
                    Security
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Realus. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {isLoginModalOpen && <LoginModal onClose={() => setIsLoginModalOpen(false)} onSignupClick={openSignupModal} />}

        {isSignupModalOpen && <SignupModal onClose={() => setIsSignupModalOpen(false)} onLoginClick={openLoginModal} />}

        {isPricingModalOpen && <PricingModal onClose={() => setIsPricingModalOpen(false)} />}

        {isTeamModalOpen && <TeamModal onClose={() => setIsTeamModalOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}

