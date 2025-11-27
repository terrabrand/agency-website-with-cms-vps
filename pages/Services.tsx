import React from 'react';
import { ShoppingCart, MessageCircle, MessageSquare, Palette, Share2, Globe, Radio, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Services: React.FC = () => {
  const { services, servicesContent, settings } = useAuth();
  const isDark = settings.darkMode || settings.theme === 'modern-dark';

  // Icon Map for rendering Lucide components from string names
  const iconMap: any = {
    Palette: Palette,
    Share2: Share2,
    Globe: Globe,
    Radio: Radio,
    Zap: Zap,
    '🆕': MessageSquare
  };

  return (
    <div className={`w-full pb-20 font-sans transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      {/* Hero Section */}
      <section className={`pt-24 pb-20 text-center border-b ${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-100'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-8 ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>
            Ready Services
          </div>
          <h1 className={`text-5xl md:text-6xl font-bold mb-8 tracking-tight leading-[1.1] whitespace-pre-wrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
            {servicesContent.heroTitle}
          </h1>
          <p className={`text-xl mb-10 max-w-2xl mx-auto leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {servicesContent.heroDescription}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className={`px-8 py-3.5 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto shadow-sm ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
              View Services
            </button>
            <button className={`px-8 py-3.5 rounded-lg text-sm font-semibold transition-colors w-full sm:w-auto ${isDark ? 'bg-transparent text-white border border-white/20 hover:bg-white/10' : 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50'}`}>
              Get Free Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Brand Logos Strip */}
      <div className={`py-10 mb-20 border-b ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-gray-50 border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-gray-400 mb-6 uppercase tracking-wider">Trusted by Industry Leaders</p>
            <div className={`flex justify-between items-center opacity-50 grayscale overflow-x-auto gap-12 no-scrollbar ${isDark ? 'text-white' : 'text-gray-900'}`}>
                <div className="font-bold text-xl whitespace-nowrap">National Bank</div>
                <div className="font-bold text-xl whitespace-nowrap">Company+</div>
                <div className="font-bold text-xl whitespace-nowrap">CocaCola</div>
                <div className="font-bold text-xl whitespace-nowrap">Airbnb</div>
                <div className="font-bold text-xl whitespace-nowrap">Uber Eats</div>
                <div className="font-bold text-xl whitespace-nowrap">Zoom</div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Standard Services Header */}
        <div className="text-center mb-16">
           <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Ready to Buy</div>
           <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Standard Services</h2>
           <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Purchase instantly with mobile money and get started right away</p>
        </div>

        {/* Standard Services Grid (Dynamic from Context) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {services.map((service) => {
            const IconComponent = iconMap[service.icon] || MessageSquare;
            return (
              <div key={service.id} className={`p-8 rounded-2xl shadow-sm border flex flex-col transition-all hover:shadow-md ${
                  isDark 
                  ? 'bg-neutral-900 border-white/10 hover:border-white/30 text-white' 
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
              }`}>
                <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-gray-50 text-gray-900'}`}>
                        <IconComponent size={24} />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded uppercase tracking-wide ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>{service.tag}</span>
                </div>
                
                <h3 className={`text-xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.title}</h3>
                <p className={`text-sm mb-6 flex-grow leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{service.description}</p>
                
                <div className={`pt-4 border-t mt-auto ${isDark ? 'border-white/10' : 'border-gray-50'}`}>
                    <div className="mb-4">
                      <span className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>From </span>
                      <span className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.price}</span>
                    </div>
                    <Link to="/client-area" className={`w-full py-3 rounded-lg font-medium flex items-center justify-center space-x-2 transition ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800'}`}>
                      <ShoppingCart size={16} />
                      <span>Buy Now</span>
                    </Link>
                    <p className="text-center text-xs text-gray-400 mt-2 font-medium">Pay with Mobile Money</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Services Section */}
        <div className="text-center mb-16">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>Custom Solutions</div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{servicesContent.customSolutionsTitle}</h2>
            <p className={`max-w-2xl mx-auto text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{servicesContent.customSolutionsDescription}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
           {[
             {icon: "💬", tag: "Technology", title: "WhatsApp API Automation", desc: "Automate customer communication with WhatsApp Business API integration."},
             {icon: "📄", tag: "Strategy", title: "Content Strategy", desc: "Comprehensive content planning and editorial calendars aligned with your goals."},
             {icon: "🤖", tag: "Technology", title: "AI Solutions", desc: "Custom AI integration and automation to enhance your business operations."},
           ].map((item, idx) => (
             <div key={idx} className={`p-8 rounded-2xl shadow-sm border flex flex-col transition-all hover:shadow-md ${
                  isDark 
                  ? 'bg-neutral-900 border-white/10 hover:border-white/30 text-white' 
                  : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
              }`}>
                <div className="flex justify-between items-start mb-6">
                     <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${isDark ? 'bg-white/10' : 'bg-gray-50'}`}>{item.icon}</div>
                     <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">{item.tag}</span>
                </div>
                
                <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                <p className={`text-sm mb-8 flex-grow leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                
                <button className="w-full bg-[#25D366] text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:bg-[#128C7E] transition mt-auto">
                  <MessageCircle size={18} />
                  <span>WhatsApp Enquiry</span>
                </button>
                <p className="text-center text-xs text-gray-400 mt-2 font-medium">Get custom pricing</p>
             </div>
           ))}
        </div>

        {/* Support Banner */}
        <div className={`rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden ${isDark ? 'bg-white/10 text-white' : 'bg-gray-900 text-white'}`}>
           <div className="absolute top-0 right-0 w-64 h-64 bg-gray-800 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
           
           <div className="flex items-center space-x-6 mb-8 md:mb-0 relative z-10">
             <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">🎧</span>
             </div>
             <div>
               <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
               <p className="text-gray-400">Our customer support team is available 24/7 to assist you</p>
             </div>
           </div>
           
           <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full md:w-auto">
             <button className="bg-white text-gray-900 px-6 py-3 rounded-lg text-sm font-bold hover:bg-gray-100 transition text-center">
                Live Chat
             </button>
             <button className="bg-transparent border border-white/30 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-white/10 transition flex items-center justify-center gap-2">
                <MessageSquare size={16} /> WhatsApp Support
             </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Services;