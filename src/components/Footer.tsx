/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';
import { translations } from '../translations';
import { Shield, Mail, Phone, MapPin, Heart } from 'lucide-react';

interface FooterProps {
  language: Language;
  t?: any;
}

export default function Footer({ language, t: tProp }: FooterProps) {
  const t = tProp || translations[language];

  return (
    <footer id="main-footer" className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-900">
          
          {/* Company Bio */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-blue-600 rounded-lg text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-white font-sans font-bold text-lg tracking-tight">
                {t.companyFullName}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              {language === 'en' 
                ? 'Empowering regional dairy farmers in Mainpuri, Uttar Pradesh, with transparent digital billing systems, immediate chilling infrastructure, and cooperative growth.'
                : 'मैनपुरी, उत्तर प्रदेश में दुग्ध उत्पादक किसानों को डिजिटल पारदर्शिता, त्वरित शीतलन बुनियादी ढांचा, और सहकारी विकास से सशक्त बनाना।'}
            </p>
          </div>

          {/* Plant & Owner Coordinates */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              {language === 'en' ? 'Chilling Plant & Office' : 'चिलिंग प्लांट और कार्यालय'}
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{t.locationAddress}</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{language === 'en' ? 'Owner Phone' : 'संचालक संपर्क'}: <a href={`tel:${t.whatsappUs}`} className="hover:text-white underline">{t.whatsappUs}</a></span>
              </div>
              <div className="text-slate-500 pl-6">
                Owner: {t.ownerName}
              </div>
            </div>
          </div>

          {/* Developer Quick Contacts */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">
              {language === 'en' ? 'Technical Support' : 'तकनीकी सहायता'}
            </h4>
            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center space-x-2.5">
                <Heart className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                <span>{t.designedBy}: <b className="text-slate-300">{t.devName}</b></span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`mailto:${t.devEmail}`} className="hover:text-white truncate underline">{t.devEmail}</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <a href={`tel:9756198223`} className="hover:text-white underline">9756198223</a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Rights Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <div>
            &copy; {new Date().getFullYear()} <b>{t.companyFullName}</b>. {t.copyrightText}
          </div>
          <div className="flex items-center space-x-1.5">
            <span>Powered by</span>
            <span className="text-blue-500 font-semibold">{t.devName} Solutions</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
