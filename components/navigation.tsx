import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Menu, X } from "lucide-react"
import { useAuth } from "../context/AuthContext"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { settings } = useAuth()
  // Determine dark mode based on explicit toggle OR theme selection
  const isDark = settings.darkMode || settings.theme === 'modern-dark'

  return (
    <nav className={`${isDark ? 'bg-black/95 border-white/10' : 'bg-white border-gray-200'} border-b sticky top-0 z-50 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>RIC</div>
            <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tanzania</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              Home
            </Link>
            <Link to="/services" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              Services
            </Link>
            <Link to="/about" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              About
            </Link>
            <Link to="/clients" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              Clients
            </Link>
            <Link to="/contact" className={`${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>
              Contact
            </Link>
            <Button asChild className={isDark ? "bg-white text-black hover:bg-gray-200" : ""}>
              <Link to="/client-area">Client Area</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className={`md:hidden py-4 space-y-4 border-b ${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-200'}`}>
            <Link to="/" onClick={() => setIsOpen(false)} className={`block px-4 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
              Home
            </Link>
            <Link to="/services" onClick={() => setIsOpen(false)} className={`block px-4 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
              Services
            </Link>
            <Link to="/about" onClick={() => setIsOpen(false)} className={`block px-4 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
              About
            </Link>
            <Link to="/clients" onClick={() => setIsOpen(false)} className={`block px-4 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
              Clients
            </Link>
            <Link to="/contact" onClick={() => setIsOpen(false)} className={`block px-4 ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
              Contact
            </Link>
            <div className="px-4">
              <Button asChild className={`w-full ${isDark ? "bg-white text-black hover:bg-gray-200" : ""}`}>
                <Link to="/client-area">Client Area</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}