import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, Linkedin, Facebook, Instagram } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? "text-black font-semibold" : "text-gray-600 hover:text-black";

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter">
              RIC <span className="text-sm font-normal text-gray-500 ml-1">Tanzania</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={isActive('/')}>Home</Link>
            <Link to="/services" className={isActive('/services')}>Services</Link>
            <Link to="/about" className={isActive('/about')}>About</Link>
            <Link to="/clients" className={isActive('/clients')}>Clients</Link>
            <Link to="/contact" className={isActive('/contact')}>Contact</Link>
            <Link 
              to="/client-area" 
              className="bg-black text-white px-5 py-2.5 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Client Area
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Home</Link>
            <Link to="/services" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Services</Link>
            <Link to="/about" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">About</Link>
            <Link to="/clients" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Clients</Link>
            <Link to="/contact" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">Contact</Link>
            <Link to="/client-area" className="block px-3 py-2 mt-4 rounded-md text-base font-medium bg-black text-white text-center">Client Area</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#111111] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">RIC Tanzania</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted digital partner for innovative solutions in Tanzania and beyond.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/clients" className="hover:text-white transition-colors">Clients</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>Logo Design</li>
              <li>Social Media Management</li>
              <li>Website Creation</li>
              <li>Digital Ads</li>
              <li>WhatsApp Automation</li>
              <li>AI Solutions</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center space-x-3">
                <Phone size={16} />
                <span>+255 XXX XXX XXX</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} />
                <span>info@rictanzania.co.tz</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin size={16} />
                <span>Dar es Salaam, Tanzania</span>
              </li>
              <li className="flex space-x-4 pt-2">
                <Facebook size={20} className="hover:text-white cursor-pointer" />
                <Instagram size={20} className="hover:text-white cursor-pointer" />
                <Linkedin size={20} className="hover:text-white cursor-pointer" />
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© 2025 RIC Tanzania. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <span>Built with</span>
            <span className="font-bold text-white">React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};