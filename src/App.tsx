/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Language, Theme, AppView, Farmer, MilkEntry, Payment, Village, GalleryItem, Notice } from './types';
import { translations } from './translations';
import {
  INITIAL_FARMERS,
  INITIAL_MILK_ENTRIES,
  INITIAL_PAYMENTS,
  INITIAL_VILLAGES,
  GALLERY_ITEMS,
} from './data/initialData';

// Component Imports
import LanguageSelector from './components/LanguageSelector';
import ThemeToggle from './components/ThemeToggle';
import Hero from './components/Hero';
import AboutOwnerBMC from './components/AboutOwnerBMC';
import GallerySection from './components/GallerySection';
import DeveloperSection from './components/DeveloperSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import FarmerPortal from './components/FarmerPortal';
import AdminPortal from './components/AdminPortal';

// Lucide Icons
import {
  Home,
  BarChart3,
  User,
  ShieldAlert,
  Image as ImageIcon,
  PhoneCall,
  Code2,
  Menu,
  X,
  MessageSquare,
  Droplets,
  Phone
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 2. Cooperative Data State
  const [farmers, setFarmers] = useState<Farmer[]>(INITIAL_FARMERS);
  const [milkEntries, setMilkEntries] = useState<MilkEntry[]>(INITIAL_MILK_ENTRIES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);
  const [villages, setVillages] = useState<Village[]>(INITIAL_VILLAGES);

  // 3. Dynamic Website Content CMS
  const [websiteContent, setWebsiteContent] = useState(() => {
    const saved = localStorage.getItem('sahaj_dairy_website_content');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      en: {
        heroTitle: "Premium Dairy Farming & Cooperative Excellence",
        heroSubtitle: "Empowering rural dairy farmers of Karimganj, Mainpuri with absolute transparency, digital BMC collection, automated rate calculations, and timely milk payouts.",
        aboutSectionTitle: "Our Leadership & Infrastructure",
        aboutName: "Mr. Yogendra Singh",
        aboutRole: "Founder & BMC Owner",
        aboutPhone: "+91 9568761213",
        ownerIntroTitle: "Founder & Owner Message",
        ownerIntroBody: "Under the leadership of Mr. Yogendra Singh, Sahaj Dairy Producer Limited is transforming dairy farming in Karimganj, Mainpuri. Our Bulk Milk Cooling (BMC) center ensures that the milk collected from local farmers maintains the highest hygiene and quality parameters, bringing financial stability to local farming families.",
        bmcTitle: "Bulk Milk Chilling (BMC) Infrastructure",
        bmcBody1: "Equipped with state-of-the-art rapid refrigeration chillers, our BMC center rapidly cools milk to 4°C, preserving freshness and stopping bacterial growth instantly. Farmers get immediate digital receipts for their fat and SNF testing, calculated accurately via automated digital testers.",
        bmcBody2: "We are committed to absolute transparency, automated rate charts, electronic weighing scales, and regular payment cycles directly deposited or handed over seamlessly.",
        contactPageTitle: "Get in touch with our BMC Experts",
        contactSubtitle: "Have questions about our milk testing, fat rates, or daily payments? Call us directly or drop by our Karimganj chilling center.",
        locationAddress: "Karimganj, Mainpuri, Uttar Pradesh, India",
        workingHours: "Plant Open: 06:00 AM - 10:00 AM & 05:00 PM - 09:00 PM (Daily)",
      },
      hi: {
        heroTitle: "प्रीमियम डेयरी फार्मिंग और सहकारी उत्कृष्टता",
        heroSubtitle: "करीमगंज, मैनपुरी के ग्रामीण डेयरी किसानों को पूर्ण पारदर्शिता, डिजिटल बीएमसी संग्रह, स्वचालित दर गणना और समय पर दूध भुगतान के साथ सशक्त बनाना।",
        aboutSectionTitle: "हमारा नेतृत्व और बुनियादी ढांचा",
        aboutName: "श्री योगेंद्र सिंह",
        aboutRole: "संस्थापक और बीएमसी मालिक",
        aboutPhone: "+91 9568761213",
        ownerIntroTitle: "संस्थापक और मालिक का संदेश",
        ownerIntroBody: "श्री योगेंद्र सिंह के नेतृत्व में, सहज डेयरी प्रोड्यूसर लिमिटेड करीमगंज, मैनपुरी में डेयरी खेती को बदल रहा है। हमारा बल्क मिल्क कूलिंग (बीएमसी) केंद्र यह सुनिश्चित करता है कि स्थानीय किसानों से एकत्र किया गया दूध उच्चतम स्वच्छता और गुणवत्ता मानकों को बनाए रखे, जिससे स्थानीय किसान परिवारों में वित्तीय स्थिरता आए।",
        bmcTitle: "बल्क मिल्क चिलिंग (बीएमसी) बुनियादी ढांचा",
        bmcBody1: "अत्याधुनिक रैपिड रेफ्रिजरेशन चिलर्स से लैस, हमारा बीएमसी केंद्र दूध को तेजी से 4°C तक ठंडा करता है, जिससे ताजगी बनी रहती है और बैक्टीरिया की वृद्धि तुरंत रुक जाती है। किसानों को उनके वसा (फैट) और एसएनएफ (SNF) परीक्षण के लिए तत्काल डिजिटल रसीदें मिलती हैं, जिनकी गणना स्वचालित डिजिटल परीक्षकों के माध्यम से की जाती है।",
        bmcBody2: "हम पूर्ण पारदर्शिता, स्वचालित दर चार्ट, इलेक्ट्रॉनिक वजन तराजू, और नियमित भुगतान चक्र सीधे जमा या निर्बाध रूप से सौंपने के लिए प्रतिबद्ध हैं।",
        contactPageTitle: "हमारे बीएमसी विशेषज्ञों से संपर्क करें",
        contactSubtitle: "क्या आपके पास हमारे दूध परीक्षण, वसा दरों, या दैनिक भुगतानों के बारे में प्रश्न हैं? सीधे कॉल करें या करीमगंज चिलिंग सेंटर पर आएं।",
        locationAddress: "करीमगंज, मैनपुरी, उत्तर प्रदेश, भारत",
        workingHours: "प्लांट समय: सुबह 06:00 - 10:00 और शाम 05:00 - रात 09:00 (दैनिक)",
      }
    };
  });

  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem('sahaj_dairy_notices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'NOT-01',
        date: '2026-06-28',
        title: 'New Animal Feed Program Launched',
        titleHi: 'नया पशु चारा कार्यक्रम शुरू किया गया',
        content: 'Get high-yield mineral feed mixtures at 25% subsidy from Sahaj Dairy plant starting this Monday.',
        contentHi: 'इस सोमवार से सहज डेयरी प्लांट से 25% सब्सिडी पर उच्च गुणवत्ता वाला खनिज चारा मिश्रण प्राप्त करें।',
        isUrgent: true,
      },
      {
        id: 'NOT-02',
        date: '2026-06-25',
        title: 'Veterinary Camp on July 5th',
        titleHi: '5 जुलाई को पशु चिकित्सा शिविर',
        content: 'Free health screening and deworming medicine distribution camp for all registered cattle in Karimganj village.',
        contentHi: 'करीमगंज गांव में सभी पंजीकृत पशुओं के लिए मुफ्त स्वास्थ्य जांच और कृमिनाशक दवा वितरण शिविर।',
        isUrgent: false,
      },
    ];
  });

  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('sahaj_dairy_gallery');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return GALLERY_ITEMS;
  });

  const [rateMultipliers, setRateMultipliers] = useState(() => {
    const saved = localStorage.getItem('sahaj_dairy_rate_multipliers');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return { fat: 7.0, snf: 3.2 };
  });

  useEffect(() => {
    localStorage.setItem('sahaj_dairy_website_content', JSON.stringify(websiteContent));
  }, [websiteContent]);

  useEffect(() => {
    localStorage.setItem('sahaj_dairy_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('sahaj_dairy_gallery', JSON.stringify(galleryItems));
  }, [galleryItems]);

  useEffect(() => {
    localStorage.setItem('sahaj_dairy_rate_multipliers', JSON.stringify(rateMultipliers));
  }, [rateMultipliers]);

  const stats = {
    totalFarmers: farmers.length,
    totalMilk: Math.round(milkEntries.reduce((sum, e) => sum + e.quantity, 0)),
    bmcCapacity: '5,000 Liters',
    activeVillages: villages.length,
  };

  // 3. Theme Toggle Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 4. Data Modifier Handlers
  const handleAddFarmer = (farmer: Farmer) => {
    setFarmers(prev => [...prev, farmer]);
  };

  const handleEditFarmer = (updated: Farmer) => {
    setFarmers(prev => prev.map(f => f.id === updated.id ? updated : f));
  };

  const handleDeleteFarmer = (id: string) => {
    setFarmers(prev => prev.filter(f => f.id !== id));
    setMilkEntries(prev => prev.filter(e => e.farmerId !== id));
    setPayments(prev => prev.filter(p => p.farmerId !== id));
  };

  const handleAddMilkEntry = (entry: MilkEntry) => {
    setMilkEntries(prev => [...prev, entry]);
  };

  const handleAddPayment = (payment: Payment) => {
    setPayments(prev => [...prev, payment]);
  };

  const handleAddVillage = (village: Village) => {
    setVillages(prev => [...prev, village]);
  };

  const handleRestoreBackup = (
    newFarmers: Farmer[],
    newMilkEntries: MilkEntry[],
    newPayments: Payment[],
    newVillages: Village[]
  ) => {
    setFarmers(newFarmers);
    setMilkEntries(newMilkEntries);
    setPayments(newPayments);
    setVillages(newVillages);
  };

  const defaultT = translations[language];
  const t = {
    ...defaultT,
    ...websiteContent[language]
  };

  // Helper to close mobile drawer on view selection
  const changeView = (view: AppView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Nav Items Schema
  const navItems = [
    { id: 'home', label: t.home, icon: Home },
    { id: 'analytics', label: language === 'en' ? 'BMC Analytics' : 'बीएमसी विश्लेषण', icon: BarChart3 },
    { id: 'farmer-portal', label: t.farmerPortal, icon: User },
    { id: 'admin-portal', label: t.adminPortal, icon: ShieldAlert },
    { id: 'gallery', label: t.gallery, icon: ImageIcon },
    { id: 'contact', label: t.contact, icon: PhoneCall },
    { id: 'developer', label: 'Developer', icon: Code2 },
  ];

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen text-slate-800 dark:text-slate-100 flex flex-col justify-between transition-colors duration-300 antialiased font-sans">
      
      {/* Premium Glassmorphic Header */}
      <header className="sticky top-0 z-50 bg-white/85 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            
            {/* Logo Brand Brand */}
            <div 
              onClick={() => changeView('home')} 
              className="flex items-center space-x-2.5 cursor-pointer shrink-0"
              id="logo-brand-header"
            >
              <div className="p-2.5 bg-blue-600 rounded-2xl text-white shadow-md flex items-center justify-center">
                <Droplets className="w-5.5 h-5.5 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-slate-900 dark:text-white text-base sm:text-lg tracking-tight leading-none">
                  {t.appName}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider mt-0.5">
                  Mainpuri, UP
                </span>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-item-${item.id}`}
                    onClick={() => changeView(item.id as AppView)}
                    className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-sm font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Language & Theme & Mobile Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              <ThemeToggle theme={theme} onThemeToggle={() => setTheme(theme === 'light' ? 'dark' : 'light')} />
              <LanguageSelector currentLanguage={language} onLanguageChange={setLanguage} />

              {/* Mobile Drawer trigger */}
              <button
                id="btn-mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl focus:outline-none focus:bg-slate-50 dark:focus:bg-slate-900"
              >
                {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white dark:bg-slate-950 border-b border-slate-100 dark:border-slate-900 py-4 px-4 space-y-2 animate-fade-in transition-all">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => changeView(item.id as AppView)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold text-left transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4.5 h-4.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-grow">
        
        {currentView === 'home' && (
          <div className="animate-fade-in">
            {/* 1. Hero Banner */}
            <Hero language={language} onNavigate={changeView} stats={stats} t={t} />
            
            {/* 2. Core Owner Intro & BMC Infrastructure */}
            <AboutOwnerBMC language={language} t={t} />

            {/* 3. Filterable Gallery Panel */}
            <div className="py-12 bg-slate-50 dark:bg-slate-950">
              <GallerySection language={language} galleryItems={galleryItems} />
            </div>

            {/* 4. Contact Section with map */}
            <ContactSection language={language} t={t} />
          </div>
        )}

        {currentView === 'analytics' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            <div className="mb-6 space-y-1">
              <h2 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">
                {t.analyticsOverview}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Live operational metrics from Karimganj chilling plant
              </p>
            </div>
            <AnalyticsDashboard
              language={language}
              farmers={farmers}
              milkEntries={milkEntries}
              payments={payments}
            />
          </div>
        )}

        {currentView === 'farmer-portal' && (
          <div className="animate-fade-in">
            <FarmerPortal
              language={language}
              farmers={farmers}
              milkEntries={milkEntries}
              payments={payments}
            />
          </div>
        )}

        {currentView === 'admin-portal' && (
          <div className="animate-fade-in">
            <AdminPortal
              language={language}
              farmers={farmers}
              milkEntries={milkEntries}
              payments={payments}
              villages={villages}
              onAddFarmer={handleAddFarmer}
              onEditFarmer={handleEditFarmer}
              onDeleteFarmer={handleDeleteFarmer}
              onAddMilkEntry={handleAddMilkEntry}
              onAddPayment={handleAddPayment}
              onAddVillage={handleAddVillage}
              onRestoreBackup={handleRestoreBackup}
              websiteContent={websiteContent}
              onUpdateWebsiteContent={setWebsiteContent}
              notices={notices}
              onUpdateNotices={setNotices}
              galleryItems={galleryItems}
              onUpdateGalleryItems={setGalleryItems}
              rateMultipliers={rateMultipliers}
              onUpdateRateMultipliers={setRateMultipliers}
            />
          </div>
        )}

        {currentView === 'gallery' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <GallerySection language={language} galleryItems={galleryItems} />
          </div>
        )}

        {currentView === 'contact' && (
          <div className="animate-fade-in">
            <ContactSection language={language} />
          </div>
        )}

        {currentView === 'developer' && (
          <div className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <DeveloperSection language={language} />
          </div>
        )}

      </main>

      {/* Floating Action Button Matrix */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-3">
        {/* Call Now */}
        <a
          href="tel:9568761213"
          id="btn-floating-call"
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer flex items-center justify-center border border-white/20"
          title={language === 'en' ? 'Call Owner Mr. Yogendra Singh' : 'मालिक श्री योगेंद्र सिंह को कॉल करें'}
        >
          <Phone className="w-5.5 h-5.5" />
        </a>

        {/* WhatsApp Instant */}
        <a
          href="https://wa.me/919568761213?text=Hi%20Yogendra%20Singh%20ji,%20I%20want%20to%20inquire%20about%20Sahaj%20Dairy%20milk%20collection."
          target="_blank"
          rel="noopener noreferrer"
          id="btn-floating-whatsapp"
          className="p-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg transition-transform hover:scale-110 cursor-pointer flex items-center justify-center border border-white/20"
          title={language === 'en' ? 'Chat on WhatsApp' : 'व्हाट्सएप चैट करें'}
        >
          <MessageSquare className="w-5.5 h-5.5" />
        </a>
      </div>

      {/* Structured Footer */}
      <Footer language={language} />

    </div>
  );
}
