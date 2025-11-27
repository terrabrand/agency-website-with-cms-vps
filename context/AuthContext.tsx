import React, { createContext, useContext, useState, useEffect } from 'react';

// Mock Data Types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  password?: string; // Optional for storage, though security-wise this is just a demo
}

export interface Service {
  id: string;
  title: string;
  price: string;
  icon: string;
  tag: string;
  description: string;
}

export interface Order {
  id: string;
  serviceId: string;
  serviceTitle: string;
  price: string;
  date: string;
  status: 'Pending' | 'Active' | 'Completed';
  userId: string;
}

export interface Invoice {
  id: string;
  userId: string;
  userName: string;
  title: string;
  amount: string;
  date: string;
  dueDate: string;
  status: 'Pending' | 'Paid';
}

export interface TicketMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  attachment?: string; // Base64 string for image
  timestamp: string;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  serviceId: string; // 'others' or actual service ID
  serviceName: string;
  subject: string;
  status: 'Open' | 'Answered' | 'Closed';
  lastUpdated: string;
  messages: TicketMessage[];
}

export interface SystemSettings {
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  companyLogoUrl: string; // For Invoice/UI
  flutterwavePublicKey: string;
  paypalClientId: string;
  theme: 'default' | 'modern-dark'; // New Theme Setting
  darkMode: boolean; // Global Dark Mode Toggle
  
  // Social Media
  companyFacebook: string;
  companyInstagram: string;
  companyLinkedin: string;
}

export interface HomepageContent {
  heroTitle: string;
  heroSubtitle: string;
  servicesTitle: string;
  ctaTitle: string;
}

export interface ServicesContent {
  heroTitle: string;
  heroDescription: string;
  customSolutionsTitle: string;
  customSolutionsDescription: string;
}

export interface ClientsPageContent {
  heroTitle: string;
  heroImage: string;
  heroTags: string; // Comma separated

  // Top Stats
  stat1Title: string;
  stat1Subtitle: string;
  stat2Title: string;
  stat2Subtitle: string;
  stat3Title: string;
  stat3Subtitle: string;
  stat4Title: string;
  stat4Subtitle: string;

  // Project 1 (Safari)
  project1Title: string;
  project1Description: string;
  project1Image: string;
  project1Link: string;

  // Middle Stats
  midStat1Value: string;
  midStat1Label: string;
  midStat2Value: string;
  midStat2Label: string;
  midStat3Value: string;
  midStat3Label: string;
  midStat4Value: string;
  midStat4Label: string;

  // Project 2 (Workplackers)
  project2Title: string;
  project2Description: string;
  project2Bullets: string; // Newline separated
  project2Image: string;
  project2Link: string;
}

export interface AboutPageContent {
  heroTitleLine1: string;
  heroTitleLine2: string;
  heroTitleLine3: string;
  heroTitleLine4: string;
  heroTitleLine5: string;
  heroTitleLocation: string; // Highlighted
  heroImage: string;
  
  marqueeTags: string; // Comma separated

  introLabel: string;
  introTitle: string;
  introDescription: string;
  
  // Intro Stats
  introStat1Label: string; introStat1Value: string;
  introStat2Label: string; introStat2Value: string;
  introStat3Label: string; introStat3Value: string;

  // Big Grid Stats
  bigStat1Value: string; bigStat1Label: string;
  bigStat2Value: string; bigStat2Label: string;
  bigStat3Value: string; bigStat3Label: string;

  servicesTitle: string;
  servicesSubtitle: string;

  // Specific About Services
  service1Title: string; service1Desc: string;
  service2Title: string; service2Desc: string;
  service3Title: string; service3Desc: string;
  service4Title: string; service4Desc: string;

  recognitionTitle: string;
  recognitionSubtitle: string;

  // Awards (Fixed 4 slots for simplicity in CMS form)
  award1Title: string; award1Category: string; award1Year: string;
  award2Title: string; award2Category: string; award2Year: string;
  award3Title: string; award3Category: string; award3Year: string;
  award4Title: string; award4Category: string; award4Year: string;

  ctaTitle: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  tag: string;
  avatar?: string; // Base64 or URL
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  category: 'Technology' | 'Design' | 'Media';
  tags: string[];
  imageUrl: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  
  // Settings
  settings: SystemSettings;
  updateSettings: (newSettings: SystemSettings) => void;

  // CMS Content
  homepageContent: HomepageContent;
  updateHomepageContent: (content: HomepageContent) => void;
  servicesContent: ServicesContent;
  updateServicesContent: (content: ServicesContent) => void;
  clientsContent: ClientsPageContent;
  updateClientsContent: (content: ClientsPageContent) => void;
  aboutContent: AboutPageContent;
  updateAboutContent: (content: AboutPageContent) => void;

  // Service Methods
  services: Service[];
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (id: string, data: Partial<Service>) => void;
  deleteService: (id: string) => void;
  
  // Order Methods
  orders: Order[];
  placeOrder: (service: Service) => void;
  
  // User Management Methods
  users: User[];
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Invoice Methods
  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'status' | 'userName'>) => void;
  payInvoice: (id: string) => void;

  // Support Methods
  tickets: Ticket[];
  createTicket: (data: { serviceId: string, subject: string, message: string, attachment?: File }) => Promise<void>;
  replyToTicket: (ticketId: string, message: string, attachment?: File) => Promise<void>;
  closeTicket: (ticketId: string) => void;

  // Testimonial Methods
  testimonials: Testimonial[];
  addTestimonial: (data: Omit<Testimonial, 'id'>) => void;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => void;
  deleteTestimonial: (id: string) => void;

  // Portfolio Methods
  portfolioItems: PortfolioItem[];
  addPortfolioItem: (data: Omit<PortfolioItem, 'id'>) => void;
  updatePortfolioItem: (id: string, data: Partial<PortfolioItem>) => void;
  deletePortfolioItem: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial Mock Data matching the Services Page
const INITIAL_SERVICES: Service[] = [
  { 
    id: '1', 
    title: "Logo Design", 
    price: "200,000 TZS", 
    icon: "Palette", 
    tag: "Design", 
    description: "Professional brand identity and logo creation that makes you memorable." 
  },
  { 
    id: '2', 
    title: "Social Media Management", 
    price: "300,000 TZS/mo", 
    icon: "Share2", 
    tag: "Marketing", 
    description: "Complete social media strategy, content creation, and community management." 
  },
  { 
    id: '3', 
    title: "Website Creation", 
    price: "800,000 TZS", 
    icon: "Globe", 
    tag: "Development", 
    description: "Custom responsive website design and development for your business." 
  },
  { 
    id: '4', 
    title: "Digital Ads", 
    price: "250,000 TZS", 
    icon: "Zap", 
    tag: "Marketing", 
    description: "Reach your target audience with data-driven advertising campaigns." 
  },
  { 
    id: '5', 
    title: "Radio Jingles", 
    price: "150,000 TZS", 
    icon: "Radio", 
    tag: "Media", 
    description: "Professional audio branding for radio that captures your business essence." 
  }
];

const DEFAULT_SETTINGS: SystemSettings = {
  companyName: "RIC Tanzania",
  companyEmail: "info@rictanzania.co.tz",
  companyPhone: "+255 XXX XXX XXX",
  companyAddress: "Dar es Salaam, Tanzania",
  companyLogoUrl: "https://aistudiocdn.com/react@^19.2.0", // Placeholder if needed
  flutterwavePublicKey: "FLWPUBK_TEST-0887984b83e1ce7a3325b9945ead2ec9-X",
  paypalClientId: "test",
  theme: 'default',
  darkMode: false,
  companyFacebook: "https://facebook.com",
  companyInstagram: "https://instagram.com",
  companyLinkedin: "https://linkedin.com"
};

const INITIAL_HOMEPAGE_CONTENT: HomepageContent = {
  heroTitle: "Building digital products, brands, and experience.",
  heroSubtitle: "We help Tanzanian businesses thrive in the digital age with innovative solutions tailored to your needs.",
  servicesTitle: "Collaborate with brands and agencies to create impactful results.",
  ctaTitle: "Tell me about your next project"
};

const INITIAL_SERVICES_CONTENT: ServicesContent = {
  heroTitle: "Services that work like a Partner",
  heroDescription: "Great businesses deserve solutions that do it all, from creating brands and digital presence to helping you market and grow.",
  customSolutionsTitle: "Tailored to Your Needs",
  customSolutionsDescription: "Complex projects that require custom pricing and consultation"
};

const INITIAL_CLIENTS_CONTENT: ClientsPageContent = {
  heroTitle: "Sarah Ndege is Operations Manager at Safari Adventures TZ",
  heroImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  heroTags: "Tourism, Digital Strategy, WhatsApp Automation",
  
  stat1Title: "Apple Editor's Choice",
  stat1Subtitle: "Featured mobile app design",
  stat2Title: "Idea of the Day",
  stat2Subtitle: "Innovative web solutions",
  stat3Title: "Top Digital Agency",
  stat3Subtitle: "Tanzania 2024",
  stat4Title: "98% Success Rate",
  stat4Subtitle: "Client satisfaction",

  project1Title: "Designing a digital experience for Safari Adventures Tanzania",
  project1Description: "We worked with Safari Adventures to create a comprehensive mobile app that transformed how they connect with customers. The solution includes real-time booking, WhatsApp integration, and AI-powered customer support that handles inquiries in multiple languages.",
  project1Image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  project1Link: "/clients",

  midStat1Value: "200+",
  midStat1Label: "Happy Clients",
  midStat2Value: "500+",
  midStat2Label: "Projects Delivered",
  midStat3Value: "10+",
  midStat3Label: "Industries Served",
  midStat4Value: "95%",
  midStat4Label: "Client Satisfaction",

  project2Title: "Workplackers App",
  project2Description: "A mobile-first platform that revolutionizes how Tanzanian workers find employment opportunities. The app connects job seekers with employers, offering real-time notifications, in-app messaging, and integrated mobile money payments for application fees.",
  project2Bullets: "Community-based collaboration that makes finding work easier for over 250,000 members seeking a profound cultural experience\nAI-powered job matching that analyzes skills and experience\nSeamless mobile-first design optimized for low-bandwidth networks",
  project2Image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  project2Link: "/clients"
};

const INITIAL_ABOUT_CONTENT: AboutPageContent = {
  heroTitleLine1: "Hi, We're RIC",
  heroTitleLine2: "Tanzania.",
  heroTitleLine3: "A Digital",
  heroTitleLine4: "Agency",
  heroTitleLine5: "Based in",
  heroTitleLocation: "Dar es Salaam",
  heroImage: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  marqueeTags: "Design, Branding, Development, Strategy, Product Design, Motion Graphics, AI Solutions",
  
  introLabel: "RIC Tanzania",
  introTitle: "Leading digital agency and creative director.",
  introDescription: "We empower Tanzanian businesses with world-class digital solutions. From brand identity to cutting-edge AI automation, we combine international best practices with deep local market knowledge.",
  
  introStat1Label: "Location", introStat1Value: "Dar es Salaam",
  introStat2Label: "Experience", introStat2Value: "5+ Years",
  introStat3Label: "Since", introStat3Value: "2019",

  bigStat1Value: "5+", bigStat1Label: "Years of Experience",
  bigStat2Value: "150+", bigStat2Label: "Projects Completed",
  bigStat3Value: "80+", bigStat3Label: "Happy Clients",

  servicesTitle: "Services",
  servicesSubtitle: "Expertise & Capabilities",
  
  service1Title: "Design & Creative", service1Desc: "Crafting visually stunning designs that connect with your audience.",
  service2Title: "Development", service2Desc: "Building digital experiences with the latest technology and best practices.",
  service3Title: "Strategy", service3Desc: "Data-driven strategies to grow your brand and reach your goals.",
  service4Title: "AI Solutions", service4Desc: "Leveraging AI to automate and optimize your business processes.",

  recognitionTitle: "Recognition",
  recognitionSubtitle: "Achievements & Milestones",

  award1Title: "Top Digital Agency Tanzania", award1Category: "Business", award1Year: "2024",
  award2Title: "Best Social Media Campaign", award2Category: "Marketing", award2Year: "2023",
  award3Title: "Excellence in Web Development", award3Category: "Design", award3Year: "2023",
  award4Title: "Innovation in AI Solutions", award4Category: "Technology", award4Year: "2024",

  ctaTitle: "Tell me about your next project"
};

const INITIAL_TESTIMONIALS: Testimonial[] = [
    { id: '1', quote: "RIC Tanzania transformed our digital presence completely. The website they built has increased our customer inquiries by 300%.", name: "John Mwambu", role: "CEO", company: "Tanzania Tech Hub", tag: "Technology" },
    { id: '2', quote: "Their social media management has helped us reach customers across East Africa. Professional and results-driven team.", name: "Grace Kimaro", role: "Marketing Director", company: "Kilimanjaro Coffee Co.", tag: "Agriculture" },
    { id: '3', quote: "The logo and branding package exceeded our expectations. They truly understood our vision and brought it to life.", name: "Ahmed Hassan", role: "Managing Director", company: "Dar Construction Ltd", tag: "Construction" },
    { id: '4', quote: "Our WhatsApp automation has revolutionized customer service. We can now handle 10x more inquiries efficiently.", name: "Sarah Ndege", role: "Operations Manager", company: "Safari Adventures TZ", tag: "Tourism" },
    { id: '5', quote: "The digital ads campaign brought us customers from all over the world. ROI was exceptional!", name: "Fatma Ali", role: "Owner", company: "Zanzibar Spice Market", tag: "Retail" },
    { id: '6', quote: "Professional, timely, and excellent results. Their content strategy has positioned us as thought leaders.", name: "Dr. Peter Moshi", role: "Dean", company: "Tanzania Business School", tag: "Education" }
];

const INITIAL_PORTFOLIO: PortfolioItem[] = [
    { id: '1', title: "N26 Banking App", description: "Mobile app design that completely transformed how millions of users manage their finances.", tags: ["Mobile App", "FinTech", "UX Design"], category: "Technology", imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: '2', title: "WhatsApp Business API", description: "Custom WhatsApp automation system handling 10,000+ daily customer interactions.", tags: ["API Integration", "Automation", "CRM"], category: "Technology", imageUrl: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: '3', title: "E-Commerce Platform", description: "Scalable e-commerce system with mobile money integration for African markets.", tags: ["Web Development", "E-Commerce", "Payment"], category: "Technology", imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: '4', title: "Safari Adventures Brand", description: "Logo design, brand guidelines, and marketing materials that capture the essence of African adventure.", tags: ["Branding", "Logo Design", "Identity"], category: "Design", imageUrl: "https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: '5', title: "Kilimanjaro Coffee", description: "Modern packaging that honors traditional Tanzanian coffee heritage while appealing to global markets.", tags: ["Packaging", "Print Design", "Branding"], category: "Design", imageUrl: "https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: '6', title: "Dar Construction Web", description: "Clean, professional web design highlighting construction projects with stunning photography.", tags: ["Web Design", "UI/UX", "Corporate"], category: "Design", imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: '7', title: "Zanzibar Tourism", description: "Facebook, Instagram, and Google Ads campaign that increased tourism bookings by 180%.", tags: ["Digital Ads", "Social Media", "Campaign"], category: "Media", imageUrl: "https://images.unsplash.com/photo-1534764879204-748956cc18d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: '8', title: "Radio Jingles Bank", description: "Creative radio commercials in Swahili and English broadcast across major stations.", tags: ["Radio", "Audio Production", "Branding"], category: "Media", imageUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: '9', title: "Social Media Tech Hub", description: "Strategic content creation and community management across all social platforms.", tags: ["Social Media", "Content", "Growth"], category: "Media", imageUrl: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" }
];


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [homepageContent, setHomepageContent] = useState<HomepageContent>(INITIAL_HOMEPAGE_CONTENT);
  const [servicesContent, setServicesContent] = useState<ServicesContent>(INITIAL_SERVICES_CONTENT);
  const [clientsContent, setClientsContent] = useState<ClientsPageContent>(INITIAL_CLIENTS_CONTENT);
  const [aboutContent, setAboutContent] = useState<AboutPageContent>(INITIAL_ABOUT_CONTENT);
  
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // CMS State
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>(INITIAL_PORTFOLIO);

  useEffect(() => {
    // Check for persisted current user
    const storedUser = localStorage.getItem('ric_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load Settings
    const storedSettings = localStorage.getItem('ric_settings');
    if (storedSettings) setSettings(JSON.parse(storedSettings));

    // Load Homepage Content
    const storedHomepageContent = localStorage.getItem('ric_homepage_content');
    if (storedHomepageContent) setHomepageContent(JSON.parse(storedHomepageContent));

    // Load Services Content
    const storedServicesContent = localStorage.getItem('ric_services_content');
    if (storedServicesContent) setServicesContent(JSON.parse(storedServicesContent));

    // Load Clients Content
    const storedClientsContent = localStorage.getItem('ric_clients_content');
    if (storedClientsContent) setClientsContent(JSON.parse(storedClientsContent));

    // Load About Content
    const storedAboutContent = localStorage.getItem('ric_about_content');
    if (storedAboutContent) setAboutContent(JSON.parse(storedAboutContent));

    // Load services
    const storedServices = localStorage.getItem('ric_services');
    if (storedServices) setServices(JSON.parse(storedServices));

    // Load orders
    const storedOrders = localStorage.getItem('ric_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    // Load invoices
    const storedInvoices = localStorage.getItem('ric_invoices');
    if (storedInvoices) setInvoices(JSON.parse(storedInvoices));

    // Load tickets
    const storedTickets = localStorage.getItem('ric_tickets');
    if (storedTickets) setTickets(JSON.parse(storedTickets));

    // Load CMS Data
    const storedTestimonials = localStorage.getItem('ric_testimonials');
    if (storedTestimonials) setTestimonials(JSON.parse(storedTestimonials));

    const storedPortfolio = localStorage.getItem('ric_portfolio');
    if (storedPortfolio) setPortfolioItems(JSON.parse(storedPortfolio));

    // Load all users (mock database)
    const storedUsers = localStorage.getItem('ric_users_db');
    if (storedUsers) {
        setUsers(JSON.parse(storedUsers));
    } else {
        // Initialize with default admin if empty
        const defaultAdmin: User = { id: 'admin', name: 'RIC Admin', email: 'admin@rictanzania.co.tz', role: 'admin', password: 'admin123' };
        setUsers([defaultAdmin]);
        localStorage.setItem('ric_users_db', JSON.stringify([defaultAdmin]));
    }

    setIsLoading(false);
  }, []);

  // Sync data to local storage whenever state changes
  useEffect(() => {
    localStorage.setItem('ric_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ric_homepage_content', JSON.stringify(homepageContent));
  }, [homepageContent]);

  useEffect(() => {
    localStorage.setItem('ric_services_content', JSON.stringify(servicesContent));
  }, [servicesContent]);

  useEffect(() => {
    localStorage.setItem('ric_clients_content', JSON.stringify(clientsContent));
  }, [clientsContent]);

  useEffect(() => {
    localStorage.setItem('ric_about_content', JSON.stringify(aboutContent));
  }, [aboutContent]);

  useEffect(() => {
    if (services !== INITIAL_SERVICES) localStorage.setItem('ric_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('ric_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('ric_users_db', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ric_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('ric_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('ric_testimonials', JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem('ric_portfolio', JSON.stringify(portfolioItems));
  }, [portfolioItems]);

  // Helper to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Auth Logic
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    // Find in users state
    const foundUser = users.find(u => u.email === email && (u.password === password || u.id === 'admin')); 

    if (foundUser && foundUser.password === password) {
      const { password, ...sessionUser } = foundUser; 
      setUser(sessionUser as User);
      localStorage.setItem('ric_user', JSON.stringify(sessionUser));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const newUser: User = { id: Date.now().toString(), name, email, password, role: 'client' };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);

    // Auto login
    const { password: _, ...sessionUser } = newUser;
    setUser(sessionUser as User);
    localStorage.setItem('ric_user', JSON.stringify(sessionUser));
    
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ric_user');
  };

  // Settings Logic
  const updateSettings = (newSettings: SystemSettings) => {
    setSettings(newSettings);
  };

  // CMS Content Logic
  const updateHomepageContent = (content: HomepageContent) => {
    setHomepageContent(content);
  };

  const updateServicesContent = (content: ServicesContent) => {
    setServicesContent(content);
  };

  const updateClientsContent = (content: ClientsPageContent) => {
    setClientsContent(content);
  };

  const updateAboutContent = (content: AboutPageContent) => {
    setAboutContent(content);
  };

  // Service Logic
  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService = { ...serviceData, id: Date.now().toString() };
    setServices([...services, newService]);
  };

  const updateService = (id: string, data: Partial<Service>) => {
    setServices(services.map(s => s.id === id ? { ...s, ...data } : s));
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  // Order Logic
  const placeOrder = (service: Service, status: 'Pending' | 'Active' | 'Completed' = 'Pending') => {
    if (!user) return;
    const newOrder: Order = {
      id: Date.now().toString(),
      serviceId: service.id,
      serviceTitle: service.title,
      price: service.price,
      date: new Date().toLocaleDateString(),
      status: status,
      userId: user.id
    };
    setOrders([...orders, newOrder]);
  };

  // User Management Logic
  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser = { ...userData, id: Date.now().toString() };
    setUsers([...users, newUser]);
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
  };

  // Invoice Logic
  const createInvoice = (invoiceData: Omit<Invoice, 'id' | 'status' | 'userName'>) => {
    const targetUser = users.find(u => u.id === invoiceData.userId);
    const newInvoice: Invoice = {
      ...invoiceData,
      id: Date.now().toString(),
      userName: targetUser ? targetUser.name : 'Unknown',
      status: 'Pending'
    };
    setInvoices([...invoices, newInvoice]);
  };

  const payInvoice = (id: string) => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Paid' } : inv));
  };

  // Support Ticket Logic
  const createTicket = async (data: { serviceId: string, subject: string, message: string, attachment?: File }) => {
    if (!user) return;

    let attachmentBase64 = undefined;
    if (data.attachment) {
      try {
        attachmentBase64 = await fileToBase64(data.attachment);
      } catch (e) {
        console.error("Error converting file", e);
      }
    }

    const serviceName = data.serviceId === 'others' 
      ? 'General / Others' 
      : services.find(s => s.id === data.serviceId)?.title || 'Unknown Service';

    const newTicket: Ticket = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      serviceId: data.serviceId,
      serviceName,
      subject: data.subject,
      status: 'Open',
      lastUpdated: new Date().toLocaleString(),
      messages: [{
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        message: data.message,
        attachment: attachmentBase64,
        timestamp: new Date().toLocaleString()
      }]
    };
    setTickets([newTicket, ...tickets]);
  };

  const replyToTicket = async (ticketId: string, message: string, attachment?: File) => {
    if (!user) return;

    let attachmentBase64 = undefined;
    if (attachment) {
      try {
        attachmentBase64 = await fileToBase64(attachment);
      } catch (e) {
        console.error("Error converting file", e);
      }
    }

    const newMessage: TicketMessage = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      message,
      attachment: attachmentBase64,
      timestamp: new Date().toLocaleString()
    };

    setTickets(tickets.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: user.role === 'admin' ? 'Answered' : 'Open',
          lastUpdated: new Date().toLocaleString(),
          messages: [...t.messages, newMessage]
        };
      }
      return t;
    }));
  };

  const closeTicket = (ticketId: string) => {
    setTickets(tickets.map(t => t.id === ticketId ? { ...t, status: 'Closed' } : t));
  };

  // Testimonial Methods
  const addTestimonial = (data: Omit<Testimonial, 'id'>) => {
    setTestimonials([...testimonials, { ...data, id: Date.now().toString() }]);
  };

  const updateTestimonial = (id: string, data: Partial<Testimonial>) => {
    setTestimonials(testimonials.map(t => t.id === id ? { ...t, ...data } : t));
  };

  const deleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
  };

  // Portfolio Methods
  const addPortfolioItem = (data: Omit<PortfolioItem, 'id'>) => {
    setPortfolioItems([...portfolioItems, { ...data, id: Date.now().toString() }]);
  };

  const updatePortfolioItem = (id: string, data: Partial<PortfolioItem>) => {
    setPortfolioItems(portfolioItems.map(p => p.id === id ? { ...p, ...data } : p));
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolioItems(portfolioItems.filter(p => p.id !== id));
  };

  return (
    <AuthContext.Provider value={{ 
      user, login, register, logout, isLoading,
      settings, updateSettings,
      homepageContent, updateHomepageContent,
      servicesContent, updateServicesContent,
      clientsContent, updateClientsContent,
      aboutContent, updateAboutContent,
      services, addService, updateService, deleteService,
      orders, placeOrder,
      users, addUser, updateUser, deleteUser,
      invoices, createInvoice, payInvoice,
      tickets, createTicket, replyToTicket, closeTicket,
      testimonials, addTestimonial, updateTestimonial, deleteTestimonial,
      portfolioItems, addPortfolioItem, updatePortfolioItem, deletePortfolioItem
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};