import React from 'react';
import { ArrowRight, Sparkles, Palette, Code, Megaphone, Bot, Mail, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const About: React.FC = () => {
  const { aboutContent, settings } = useAuth();
  const isDark = settings.darkMode || settings.theme === 'modern-dark';
  const marqueeTags = aboutContent.marqueeTags.split(',').map(tag => tag.trim());

  return (
    <div className={`w-full font-sans transition-colors duration-300 ${isDark ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 md:pt-32 md:pb-32">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex-1 space-y-8">
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] uppercase ${isDark ? 'text-white' : 'text-gray-950'}`}>
              {aboutContent.heroTitleLine1} <br />
              {aboutContent.heroTitleLine2} <br />
              {aboutContent.heroTitleLine3} <br />
              {aboutContent.heroTitleLine4} <br />
              {aboutContent.heroTitleLine5} <span className={isDark ? 'text-gray-400' : 'text-gray-900'}>{aboutContent.heroTitleLocation}</span>
            </h1>
            
            <div className={`flex items-center space-x-3 text-xs md:text-sm font-bold tracking-widest uppercase mt-4 ${isDark ? 'text-gray-300' : 'text-gray-900'}`}>
              <span>● Design</span>
              <span>● Development</span>
              <span>● Strategy</span>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild className={`rounded-md px-8 py-6 text-sm font-bold uppercase tracking-wide ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-950 text-white hover:bg-gray-800'}`}>
                <Link to="/contact">Get a project?</Link>
              </Button>
              <Button asChild variant="outline" className={`rounded-md px-8 py-6 text-sm font-bold uppercase tracking-wide ${isDark ? 'bg-transparent border-white text-white hover:bg-white/10' : 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}`}>
                <Link to="/contact">Let's talk.</Link>
              </Button>
            </div>
          </div>
          
          <div className="flex-1 flex justify-center md:justify-end relative">
             <div className="w-72 h-72 md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] rounded-full overflow-hidden relative z-10 border-4 border-white shadow-2xl">
                <img 
                  src={aboutContent.heroImage} 
                  alt="RIC Tanzania Team" 
                  className="w-full h-full object-cover"
                />
             </div>
             {/* Abstract circle line */}
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] rounded-full border -z-0 hidden md:block ${isDark ? 'border-white/10' : 'border-gray-200'}`}></div>
          </div>
        </div>
      </section>

      {/* Marquee Bar */}
      <div className={`py-6 overflow-hidden ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
        <div className="flex w-max animate-marquee whitespace-nowrap text-sm font-bold tracking-widest uppercase">
          {[...Array(10)].map((_, i) => (
            <React.Fragment key={i}>
                {marqueeTags.map((tag, idx) => (
                    <span key={idx} className="mx-6">● {tag}</span>
                ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Intro Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 mb-20">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">{aboutContent.introLabel}</div>
            <h2 className={`text-4xl md:text-5xl font-bold leading-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {aboutContent.introTitle}
            </h2>
          </div>
          <div className="space-y-8">
            <p className={`text-lg leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {aboutContent.introDescription}
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div>
                <div className="text-xs font-bold uppercase text-gray-400 mb-1">{aboutContent.introStat1Label}</div>
                <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{aboutContent.introStat1Value}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-gray-400 mb-1">{aboutContent.introStat2Label}</div>
                <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{aboutContent.introStat2Value}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-gray-400 mb-1">{aboutContent.introStat3Label}</div>
                <div className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{aboutContent.introStat3Value}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-3 border divide-y md:divide-y-0 md:divide-x ${isDark ? 'border-white/10 divide-white/10' : 'border-gray-200 divide-gray-200'}`}>
           <div className="p-12 lg:p-16 text-center">
              <div className={`text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aboutContent.bigStat1Value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{aboutContent.bigStat1Label}</div>
           </div>
           <div className={`p-12 lg:p-16 text-center ${isDark ? 'bg-white text-black' : 'bg-black text-white'}`}>
              <div className="text-6xl font-bold mb-4">{aboutContent.bigStat2Value}</div>
              <div className={`text-xs font-bold uppercase tracking-widest ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{aboutContent.bigStat2Label}</div>
           </div>
           <div className="p-12 lg:p-16 text-center">
              <div className={`text-6xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aboutContent.bigStat3Value}</div>
              <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{aboutContent.bigStat3Label}</div>
           </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`py-24 ${isDark ? 'bg-neutral-900/30' : 'bg-gray-50/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
              </div>
              <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aboutContent.servicesTitle}</h2>
              <p className="text-gray-500 uppercase tracking-widest text-sm font-medium">{aboutContent.servicesSubtitle}</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Palette, title: aboutContent.service1Title, desc: aboutContent.service1Desc },
                { icon: Code, title: aboutContent.service2Title, desc: aboutContent.service2Desc },
                { icon: Megaphone, title: aboutContent.service3Title, desc: aboutContent.service3Desc },
                { icon: Bot, title: aboutContent.service4Title, desc: aboutContent.service4Desc },
              ].map((s, i) => (
                <div key={i} className={`p-8 rounded-2xl shadow-sm border transition duration-300 hover:shadow-md ${isDark ? 'bg-neutral-900 border-white/10 hover:border-white/20' : 'bg-white border-gray-100 hover:border-gray-200'}`}>
                   <s.icon className={`w-8 h-8 mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                   <h3 className={`text-lg font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>{s.title}</h3>
                   <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{s.desc}</p>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Recognition Section */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
         <div className="text-center mb-16">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 ${isDark ? 'bg-white/10' : 'bg-gray-100'}`}>
                <Sparkles className={`w-5 h-5 ${isDark ? 'text-white' : 'text-gray-900'}`} />
            </div>
            <h2 className={`text-4xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>{aboutContent.recognitionTitle}</h2>
            <p className="text-gray-500 uppercase tracking-widest text-sm font-medium">{aboutContent.recognitionSubtitle}</p>
         </div>

         <div className="space-y-4">
            {[
              { id: 1, title: aboutContent.award1Title, category: aboutContent.award1Category, year: aboutContent.award1Year },
              { id: 2, title: aboutContent.award2Title, category: aboutContent.award2Category, year: aboutContent.award2Year },
              { id: 3, title: aboutContent.award3Title, category: aboutContent.award3Category, year: aboutContent.award3Year },
              { id: 4, title: aboutContent.award4Title, category: aboutContent.award4Category, year: aboutContent.award4Year },
            ].map((award) => (
              <div key={award.id} className={`group flex items-center justify-between p-6 md:p-8 border rounded-2xl transition-all duration-300 hover:shadow-sm cursor-default ${
                  isDark 
                  ? 'bg-neutral-900 border-white/10 hover:border-white/30' 
                  : 'bg-white border-gray-100 hover:border-gray-300'
              }`}>
                 <div className="flex items-center gap-6 md:gap-8">
                    <div className={`w-10 h-10 flex items-center justify-center font-bold rounded-md flex-shrink-0 ${isDark ? 'bg-white text-black' : 'bg-gray-900 text-white'}`}>
                      {award.id}
                    </div>
                    <div>
                      <h3 className={`text-lg md:text-xl font-bold group-hover:opacity-80 ${isDark ? 'text-white' : 'text-gray-900'}`}>{award.title}</h3>
                      <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">{award.category}</p>
                    </div>
                 </div>
                 <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{award.year}</div>
              </div>
            ))}
         </div>
      </section>

      {/* CTA Section */}
      <section className={`py-24 text-center border-t ${isDark ? 'bg-neutral-900/30 border-white/10' : 'bg-gray-50/50 border-gray-100'}`}>
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 text-3xl shadow-sm ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>👋</div>
            <h2 className={`text-4xl md:text-5xl font-bold mb-10 tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {aboutContent.ctaTitle}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild className={`rounded-md px-8 py-6 text-base ${isDark ? 'bg-white text-black hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}>
                <Link to="/contact">
                   <Mail className="mr-2 h-5 w-5" /> Email Me
                </Link>
              </Button>
              <Button asChild variant="outline" className={`rounded-md px-8 py-6 text-base ${isDark ? 'bg-transparent text-white border-white/30 hover:bg-white/10' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-50'}`}>
                 <a href={`https://wa.me/${useAuth().settings.companyPhone.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer">
                   <MessageSquare className="mr-2 h-5 w-5" /> WhatsApp
                 </a>
              </Button>
            </div>
         </div>
      </section>

    </div>
  );
};

export default About;