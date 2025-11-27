import React from 'react';
import { Phone, Mail, MapPin, MessageSquare, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Contact: React.FC = () => {
  const { settings } = useAuth();
  const isDark = settings.darkMode || settings.theme === 'modern-dark';

  return (
    <div className={`w-full transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Header */}
      <div className="bg-[#111111] text-white py-20 text-center">
         <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
         <p className="text-gray-400">Ready to transform your business? Let's talk about your digital needs</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 mb-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Contact Info */}
            <div className="md:col-span-1 space-y-6">
               <div className={`p-8 rounded-xl shadow-lg h-full border ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-gray-100'}`}>
                  <h3 className={`font-bold mb-6 text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Information</h3>
                  <p className="text-sm text-gray-500 mb-8">Get in touch with us through any of these channels</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}><Phone size={20}/></div>
                      <div>
                        <div className="font-medium text-sm">Phone</div>
                        <div className="text-gray-500 text-sm">{settings.companyPhone}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}><Mail size={20}/></div>
                      <div>
                        <div className="font-medium text-sm">Email</div>
                        <div className="text-gray-500 text-sm">{settings.companyEmail}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}><MapPin size={20}/></div>
                      <div>
                        <div className="font-medium text-sm">Office</div>
                        <div className="text-gray-500 text-sm">{settings.companyAddress}</div>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className={`w-10 h-10 rounded flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}><MessageSquare size={20}/></div>
                      <div>
                        <div className="font-medium text-sm">WhatsApp</div>
                        <div className="text-gray-500 text-sm">Chat with us</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-10 bg-[#111111] text-white p-6 rounded-xl border border-white/10">
                     <h4 className="font-bold mb-2">Free Consultation</h4>
                     <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                       Not sure where to start? Book a free 30-minute consultation. We'll help you understand which services are right for your business.
                     </p>
                     <button className="w-full bg-white text-black text-xs font-bold py-3 rounded text-center hover:bg-gray-200 transition">
                       Schedule Consultation
                     </button>
                  </div>
               </div>
            </div>

            {/* Form */}
            <div className="md:col-span-2">
               <div className={`p-8 rounded-xl shadow-lg h-full border ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-gray-100'}`}>
                  <h3 className={`font-bold mb-6 text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>Send Us a Message</h3>
                  <p className="text-sm text-gray-500 mb-8">Fill out the form below and we'll get back to you within 24 hours</p>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Full Name *</label>
                         <input type="text" className={`w-full border rounded p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none ${isDark ? 'bg-black border-white/20 text-white placeholder:text-gray-600' : 'bg-white border-gray-200 text-gray-900'}`} placeholder="Your name" />
                       </div>
                       <div>
                         <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email *</label>
                         <input type="email" className={`w-full border rounded p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none ${isDark ? 'bg-black border-white/20 text-white placeholder:text-gray-600' : 'bg-white border-gray-200 text-gray-900'}`} placeholder="your@email.com" />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div>
                         <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Phone Number</label>
                         <input type="text" className={`w-full border rounded p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none ${isDark ? 'bg-black border-white/20 text-white placeholder:text-gray-600' : 'bg-white border-gray-200 text-gray-900'}`} placeholder="+255 XXX XXX XXX" />
                       </div>
                       <div>
                         <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Service Interested In</label>
                         <input type="text" className={`w-full border rounded p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none ${isDark ? 'bg-black border-white/20 text-white placeholder:text-gray-600' : 'bg-white border-gray-200 text-gray-900'}`} placeholder="e.g., Logo Design" />
                       </div>
                    </div>

                    <div>
                      <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Message *</label>
                      <textarea rows={4} className={`w-full border rounded p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none ${isDark ? 'bg-black border-white/20 text-white placeholder:text-gray-600' : 'bg-white border-gray-200 text-gray-900'}`} placeholder="Tell us about your project..."></textarea>
                    </div>

                    <button type="button" className={`px-6 py-3 rounded text-sm font-medium flex items-center space-x-2 transition ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                      <Send size={16} />
                      <span>Send Message</span>
                    </button>
                  </form>
               </div>
            </div>

         </div>

         {/* Office Hours */}
         <div className="mt-20 text-center">
            <h3 className={`text-2xl font-bold mb-10 ${isDark ? 'text-white' : 'text-gray-900'}`}>Office Hours</h3>
            <div className="flex flex-col md:flex-row justify-center gap-6">
               <div className={`p-8 rounded-xl shadow-sm border w-full md:w-80 text-left ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-gray-100'}`}>
                  <div className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Weekdays</div>
                  <div className="text-gray-500 text-sm mb-4">Monday - Friday</div>
                  <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>8:00 AM - 6:00 PM EAT</div>
               </div>
               <div className={`p-8 rounded-xl shadow-sm border w-full md:w-80 text-left ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-white border-gray-100'}`}>
                  <div className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Weekends</div>
                  <div className="text-gray-500 text-sm mb-4">Saturday</div>
                  <div className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>9:00 AM - 2:00 PM EAT</div>
               </div>
            </div>
            <p className="text-gray-400 text-xs mt-8">For urgent matters outside office hours, contact us via WhatsApp</p>
         </div>
      </div>
    </div>
  );
};

export default Contact;