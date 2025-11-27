import React from 'react';
import { ArrowRight, Star, Award, Lightbulb, TrendingUp, Smartphone, Globe, PenTool, Radio, Layout, CheckCircle, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Clients: React.FC = () => {
  const { testimonials, portfolioItems, clientsContent, settings } = useAuth();
  const isDark = settings.darkMode || settings.theme === 'modern-dark';

  return (
    <div className={`w-full font-sans transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      
      {/* Hero Section - Sarah Ndege */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="w-full md:w-1/2 space-y-6">
            <h1 className={`text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight whitespace-pre-wrap ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {clientsContent.heroTitle}
            </h1>
            
            <div className="flex flex-wrap gap-3">
               {clientsContent.heroTags.split(',').map((tag, i) => (
                  <span key={i} className={`px-4 py-1.5 rounded-full text-sm font-bold ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>{tag.trim()}</span>
               ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative">
             <div className={`w-72 h-72 md:w-[450px] md:h-[450px] rounded-full overflow-hidden relative z-10 ${isDark ? 'bg-neutral-800' : 'bg-gray-100'}`}>
                <img 
                  src={clientsContent.heroImage} 
                  alt="Hero" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                />
             </div>
          </div>
        </div>

        {/* Awards/Stats Strip */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center gap-2">
                <Smartphone size={32} className="mb-2" />
                <div className="font-bold text-sm">{clientsContent.stat1Title}</div>
                <div className="text-xs text-gray-500">{clientsContent.stat1Subtitle}</div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Lightbulb size={32} className="mb-2" />
                <div className="font-bold text-sm">{clientsContent.stat2Title}</div>
                <div className="text-xs text-gray-500">{clientsContent.stat2Subtitle}</div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <Star size={32} className="mb-2" />
                <div className="font-bold text-sm">{clientsContent.stat3Title}</div>
                <div className="text-xs text-gray-500">{clientsContent.stat3Subtitle}</div>
            </div>
            <div className="flex flex-col items-center gap-2">
                <TrendingUp size={32} className="mb-2" />
                <div className="font-bold text-sm">{clientsContent.stat4Title}</div>
                <div className="text-xs text-gray-500">{clientsContent.stat4Subtitle}</div>
            </div>
        </div>
      </section>

      {/* Featured Project - Dark Section (Always Dark) */}
      <section className="bg-[#111111] text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col lg:flex-row gap-16 items-center">
              <div className="w-full lg:w-1/2">
                 <img 
                    src={clientsContent.project1Image} 
                    alt="Featured Project" 
                    className="rounded-xl shadow-2xl opacity-90"
                 />
              </div>
              <div className="w-full lg:w-1/2 space-y-6">
                 <div className="text-xs font-bold tracking-widest text-gray-400 uppercase">Featured Project</div>
                 <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                    {clientsContent.project1Title}
                 </h2>
                 <div className="flex items-center space-x-1 text-white">
                    {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                    <span className="ml-2 text-sm font-medium">5.0</span>
                 </div>
                 <p className="text-gray-400 text-lg leading-relaxed">
                    {clientsContent.project1Description}
                 </p>
                 <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6 mt-4" asChild>
                    <a href={clientsContent.project1Link} target="_blank" rel="noopener noreferrer">
                      Read Full Case Study <ArrowRight size={16} className="ml-2" />
                    </a>
                 </Button>
              </div>
           </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={`py-16 border-b ${isDark ? 'bg-neutral-900 border-white/10' : 'bg-gray-50 border-gray-200'}`}>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
               <div>
                  <div className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{clientsContent.midStat1Value}</div>
                  <div className="text-sm text-gray-500">{clientsContent.midStat1Label}</div>
               </div>
               <div>
                  <div className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{clientsContent.midStat2Value}</div>
                  <div className="text-sm text-gray-500">{clientsContent.midStat2Label}</div>
               </div>
               <div>
                  <div className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{clientsContent.midStat3Value}</div>
                  <div className="text-sm text-gray-500">{clientsContent.midStat3Label}</div>
               </div>
               <div>
                  <div className={`text-4xl font-bold mb-1 ${isDark ? 'text-white' : 'text-gray-900'}`}>{clientsContent.midStat4Value}</div>
                  <div className="text-sm text-gray-500">{clientsContent.midStat4Label}</div>
               </div>
            </div>
         </div>
      </section>

      {/* Case Study 2 - Workplackers */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="flex flex-col-reverse md:flex-row gap-16 items-center">
             <div className="w-full md:w-1/2 space-y-6">
                 <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-600'}`}>Case Study</div>
                 <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{clientsContent.project2Title}</h2>
                 <div className={`flex items-center space-x-1 ${isDark ? 'text-white' : 'text-black'}`}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    <span className="ml-2 text-sm font-medium">5.0</span>
                 </div>
                 <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                   {clientsContent.project2Description}
                 </p>
                 <ul className={`space-y-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {clientsContent.project2Bullets.split('\n').map((bullet, i) => (
                        <li key={i} className="flex items-start gap-2">
                           <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${isDark ? 'bg-white' : 'bg-black'}`} />
                           {bullet.trim()}
                        </li>
                    ))}
                 </ul>
                 <Button variant="outline" className={`mt-4 rounded ${isDark ? 'bg-transparent border-white text-white hover:bg-white/10' : 'border-gray-300'}`} asChild>
                    <a href={clientsContent.project2Link} target="_blank" rel="noopener noreferrer">
                        View Project Details <ArrowRight size={16} className="ml-2" />
                    </a>
                 </Button>
             </div>
             <div className={`w-full md:w-1/2 rounded-2xl p-8 lg:p-12 ${isDark ? 'bg-neutral-900' : 'bg-gray-50'}`}>
                <img 
                   src={clientsContent.project2Image} 
                   alt="Case Study" 
                   className="rounded-xl shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500"
                />
             </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className={`py-24 ${isDark ? 'bg-neutral-900' : 'bg-gray-50'}`}>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className={`text-3xl font-bold text-center mb-16 ${isDark ? 'text-white' : 'text-gray-900'}`}>What Our Clients Say</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((t) => (
                    <div key={t.id} className={`p-8 rounded-xl shadow-sm border flex flex-col h-full ${isDark ? 'bg-black border-white/10' : 'bg-white border-gray-100'}`}>
                        <div className="text-4xl text-gray-300 font-serif mb-4">”</div>
                        <p className={`mb-6 flex-grow text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.quote}</p>
                        <div className="flex items-center gap-4 mt-auto">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs overflow-hidden ${isDark ? 'bg-white/10 text-gray-300' : 'bg-gray-200 text-gray-500'}`}>
                                {t.avatar ? (
                                    <img src={t.avatar} alt={t.name} className="w-full h-full object-cover"/>
                                ) : (
                                    t.name.split(' ').map(n => n[0]).join('')
                                )}
                            </div>
                            <div>
                                <div className={`font-bold text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.name}</div>
                                <div className="text-xs text-gray-500">{t.company}</div>
                            </div>
                        </div>
                        <div className={`mt-4 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-50'}`}>
                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-50 text-gray-400'}`}>{t.tag}</span>
                        </div>
                    </div>
                ))}
            </div>
         </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>Portfolio</h2>
            <p className="text-gray-500">Recognition & Accomplishments</p>
         </div>

         {/* Category: Technology */}
         {['Technology', 'Design', 'Media'].map((category) => {
             const items = portfolioItems.filter(p => p.category === category);
             if (items.length === 0) return null;

             return (
                 <div key={category} className="mb-20">
                    <div className="flex justify-between items-end mb-8">
                        <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{category}</h3>
                        <span className={`text-sm border rounded-full px-3 py-1 ${isDark ? 'text-gray-400 border-white/20' : 'text-gray-500 border-gray-200'}`}>{items.length} Projects</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {items.map((p) => (
                            <div key={p.id} className="group">
                                <div className={`rounded-xl overflow-hidden mb-4 h-64 ${isDark ? 'bg-neutral-900' : 'bg-gray-100'}`}>
                                    <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {p.tags.map((tag, t) => (
                                        <span key={t} className={`text-xs font-bold px-2 py-1 rounded ${isDark ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-600'}`}>{tag}</span>
                                    ))}
                                </div>
                                <h4 className={`font-bold text-lg mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{p.title}</h4>
                                <p className="text-sm text-gray-500">{p.description}</p>
                            </div>
                        ))}
                    </div>
                 </div>
             );
         })}
      </section>

      {/* Footer CTA */}
      <section className="bg-[#111111] text-white py-24 text-center">
         <div className="max-w-3xl mx-auto px-4">
             <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Our Growing List of Success Stories</h2>
             <p className="text-gray-400 mb-10 text-lg">Let's discuss how we can help your business thrive in the digital age</p>
             <Button className="bg-white text-black hover:bg-gray-200 rounded px-8 py-6 text-base font-bold" asChild>
                <Link to="/contact">
                   Get Free Consultation
                </Link>
             </Button>
         </div>
      </section>

    </div>
  );
};

export default Clients;