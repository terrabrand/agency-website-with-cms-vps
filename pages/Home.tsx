import React from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowRight, Palette, Share2, Globe, Radio, MessageSquare, Bot, FileText, Zap, CreditCard, ArrowUpRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

// Icon Map for rendering Lucide components from string names
const iconMap: any = {
  Palette: Palette,
  Share2: Share2,
  Globe: Globe,
  Radio: Radio,
  Zap: Zap,
  '🆕': MessageSquare
};

const DefaultHome: React.FC<any> = ({ homepageContent, latestServices, customServices, clients, isDark }) => {
  return (
    <div className={`min-h-screen ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Hero Section - Minimalist centered */}
      <section className="relative py-20 md:py-32 lg:py-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <img
                src="https://picsum.photos/seed/ric/150/150"
                alt="RIC Tanzania"
                className={`w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 ${isDark ? 'border-white/10' : 'border-gray-100'}`}
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
            {homepageContent.heroTitle}
          </h1>

          <p className={`text-lg md:text-xl mb-10 max-w-2xl mx-auto text-pretty leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            {homepageContent.heroSubtitle}
          </p>

          <Button size="lg" className={`rounded-full px-8 ${isDark ? 'bg-white text-black hover:bg-gray-200' : ''}`} asChild>
            <Link to="/clients">
              Latest Work <ArrowRight className="ml-2" size={18} />
            </Link>
          </Button>
        </div>
      </section>

      {/* Clients/Partners Logo Section */}
      <section className={`py-12 border-y ${isDark ? 'border-white/10 bg-neutral-900/50' : 'border-gray-200 bg-gray-50/50'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-300">
            {clients.map((client: any, index: number) => (
              <div key={index} className="h-10 flex items-center justify-center font-bold text-lg text-gray-400">
                {client.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section - Centered with cards */}
      <section className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
              {homepageContent.servicesTitle}
            </h2>
          </div>

          {/* Standard Services with icons */}
          <div className="mb-16">
            <div className="flex items-center justify-center mb-8">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>Standard Services</div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestServices.map((service: any, index: number) => {
                const Icon = iconMap[service.icon] || MessageSquare;
                return (
                  <Card
                    key={service.id}
                    className={`text-center hover:shadow-lg transition-all duration-300 border-2 flex flex-col h-full ${
                        isDark 
                        ? 'bg-neutral-900 border-white/10 text-white hover:border-white/30' 
                        : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                        <Icon className={isDark ? 'text-white' : 'text-gray-900'} size={28} />
                      </div>
                      <CardTitle className={`text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.title}</CardTitle>
                      <CardDescription className={`text-sm leading-relaxed min-h-[3rem] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 mt-auto">
                      <div className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.price}</div>
                      <Button className={`w-full rounded-full ${isDark ? 'bg-white text-black hover:bg-gray-200' : ''}`} size="sm" asChild>
                        <Link to="/client-area">
                          <CreditCard className="mr-2" size={16} />
                          Buy Now
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            
            <div className="mt-8 text-center">
              <Button variant="outline" className={`rounded-full px-8 ${isDark ? 'bg-transparent border-white text-white hover:bg-white/10' : ''}`} asChild>
                <Link to="/services">View All Services</Link>
              </Button>
            </div>
          </div>

          {/* Custom Services */}
          <div>
            <div className="flex items-center justify-center mb-8">
              <div className={`px-4 py-2 rounded-full text-sm font-medium ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>Custom Solutions</div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {customServices.map((service: any, index: number) => {
                const Icon = service.icon
                return (
                  <Card
                    key={index}
                    className={`text-center hover:shadow-lg transition-all duration-300 border-2 ${
                        isDark 
                        ? 'bg-neutral-900 border-white/10 text-white hover:border-white/30' 
                        : 'bg-white border-gray-200 text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center mx-auto mb-4 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                        <Icon className={isDark ? 'text-white' : 'text-gray-900'} size={28} />
                      </div>
                      <CardTitle className={`text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{service.title}</CardTitle>
                      <CardDescription className={`text-sm leading-relaxed min-h-[3rem] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {service.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button className="w-full rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white border-none" size="sm" asChild>
                        <a href="https://wa.me/255XXXXXXXXX" target="_blank" rel="noopener noreferrer">
                          <MessageSquare className="mr-2 shrink-0" size={18} />
                          WhatsApp Enquiry
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Minimalist centered with icon */}
      <section className={`py-20 md:py-28 ${isDark ? 'bg-neutral-900/50' : 'bg-gray-50/50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8 flex justify-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
              <MessageSquare className={isDark ? 'text-white' : 'text-gray-900'} size={32} />
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            {homepageContent.ctaTitle}
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-10">
            <Button size="lg" className={`rounded-full px-8 ${isDark ? 'bg-white text-black hover:bg-gray-200' : ''}`} asChild>
              <Link to="/contact">
                <MessageSquare className="mr-2" size={18} />
                Email Me
              </Link>
            </Button>
            <Button size="lg" variant="outline" className={`rounded-full px-8 bg-transparent ${isDark ? 'border-white/30 text-white hover:bg-white/10' : 'border-gray-300'}`} asChild>
              <a href="https://wa.me/255XXXXXXXXX" target="_blank" rel="noopener noreferrer">
                WhatsApp
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

const ModernDarkHome: React.FC<any> = ({ homepageContent, latestServices, portfolioItems }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Navigation spacer */}
      <div className="h-10"></div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-white/10">
          <div className="flex flex-col items-center text-center">
             <div className="mb-8 text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Creative Studio</div>
             
             <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight mb-8 leading-none uppercase">
                {homepageContent.heroTitle.split(' ').slice(0, 3).join(' ')}<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500">
                  {homepageContent.heroTitle.split(' ').slice(3).join(' ')}
                </span>
             </h1>
             
             <p className="max-w-md text-gray-400 text-sm md:text-base leading-relaxed mb-12 border-l border-white/20 pl-6 text-left self-center md:self-end md:mr-20">
                {homepageContent.heroSubtitle}
             </p>

             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
             
             <Link to="/clients" className="group relative flex items-center justify-center w-24 h-24 rounded-full border border-white/20 hover:border-white transition-all duration-500">
                <ArrowRight className="group-hover:rotate-45 transition-transform duration-500" />
                <div className="absolute inset-0 rounded-full border border-white opacity-0 group-hover:animate-ping"></div>
             </Link>
          </div>
      </section>

      {/* Services Section (Replaced 'Features') */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
         <div className="flex flex-col md:flex-row justify-between items-start mb-20">
             <h2 className="text-4xl md:text-5xl font-serif uppercase">Standard Services</h2>
             <p className="text-gray-400 max-w-xs mt-4 md:mt-0 text-sm">
                Launch your digital presence with ease. Select a package and get started immediately.
             </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/10 border border-white/10">
            {latestServices.map((service: any) => {
               const Icon = iconMap[service.icon] || Zap;
               return (
                   <div key={service.id} className="bg-black p-10 group hover:bg-neutral-900 transition-colors duration-500">
                       <div className="w-12 h-12 bg-neutral-900 rounded-lg flex items-center justify-center mb-8 text-white group-hover:text-purple-400 transition-colors">
                          <Icon size={20} strokeWidth={1.5} />
                       </div>
                       <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                       <p className="text-gray-500 text-sm mb-6 leading-relaxed h-10 line-clamp-2">{service.description}</p>
                       <div className="flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                           <span className="text-sm font-bold text-gray-300">{service.price}</span>
                           <Link to="/client-area" className="text-xs uppercase tracking-widest font-bold hover:text-purple-400 transition-colors">Buy Now</Link>
                       </div>
                   </div>
               )
            })}
         </div>
      </section>

      {/* Portfolio Section (Our Works) */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-20">
             <h2 className="text-4xl md:text-6xl font-serif uppercase mb-4">Our Works</h2>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {/* Large Feature */}
             {portfolioItems.length > 0 && (
                <div className="md:col-span-2 group relative h-[500px] rounded-3xl overflow-hidden">
                    <img src={portfolioItems[0].imageUrl} alt={portfolioItems[0].title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                        <div>
                            <span className="text-xs font-bold bg-white text-black px-3 py-1 rounded-full mb-3 inline-block">{portfolioItems[0].category}</span>
                            <h3 className="text-2xl font-bold">{portfolioItems[0].title}</h3>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                            <ArrowUpRight size={20} />
                        </div>
                    </div>
                </div>
             )}

             {/* Secondary Features */}
             {portfolioItems.slice(1, 3).map((item: any) => (
                 <div key={item.id} className="group relative h-[400px] rounded-3xl overflow-hidden">
                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 w-full flex justify-between items-end">
                        <div>
                             <span className="text-xs font-bold bg-white text-black px-3 py-1 rounded-full mb-3 inline-block">{item.category}</span>
                             <h3 className="text-xl font-bold">{item.title}</h3>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                             <ArrowUpRight size={16} />
                        </div>
                    </div>
                 </div>
             ))}
         </div>
         
         <div className="mt-12 text-center">
             <Link to="/clients" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest border-b border-white pb-1 hover:text-purple-400 hover:border-purple-400 transition-colors">
                View All Projects
             </Link>
         </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-neutral-900/50 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center px-4">
               <h2 className="text-4xl md:text-5xl font-serif uppercase mb-8 leading-tight">{homepageContent.ctaTitle}</h2>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                   <Link to="/contact" className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-colors">
                       Start Project
                   </Link>
                   <Link to="/services" className="border border-white/20 px-8 py-4 rounded-full font-bold hover:bg-white/10 transition-colors">
                       View Services
                   </Link>
               </div>
          </div>
      </section>
    </div>
  );
};

export default function HomePage() {
  const { services, homepageContent, settings, portfolioItems } = useAuth();

  // Get the latest 6 services (assuming newest are added to the end of the list)
  const latestServices = [...services].reverse().slice(0, 6);
  // Get latest 3 portfolio items
  const latestPortfolio = [...portfolioItems].reverse().slice(0, 3);

  const customServices = [
    {
      title: "WhatsApp API Automation",
      description: "Automate customer communication with WhatsApp Business API",
      icon: MessageSquare,
    },
    {
      title: "Content Strategy",
      description: "Comprehensive planning and strategy for your brand",
      icon: FileText,
    },
    {
      title: "AI Solutions",
      description: "Custom AI-powered solutions for your business",
      icon: Bot,
    },
  ]

  const clients = [
    { name: "National Bank" },
    { name: "Mattered" },
    { name: "Coca-Cola" },
    { name: "Adobe" },
    { name: "Subway" },
    { name: "Code Academy" },
  ]

  const isDark = settings.darkMode || settings.theme === 'modern-dark';

  // Render Theme based on Settings
  if (settings.theme === 'modern-dark') {
      return (
          <ModernDarkHome 
              homepageContent={homepageContent} 
              latestServices={latestServices} 
              portfolioItems={latestPortfolio}
          />
      );
  }

  return (
      <DefaultHome 
          homepageContent={homepageContent} 
          latestServices={latestServices} 
          customServices={customServices}
          clients={clients}
          isDark={isDark}
      />
  );
}