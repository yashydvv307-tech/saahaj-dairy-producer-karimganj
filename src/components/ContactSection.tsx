/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';
import { translations } from '../translations';
import { motion } from 'motion/react';
import { MapPin, Phone, MessageSquare, Mail, Calendar, ExternalLink } from 'lucide-react';

interface ContactSectionProps {
  language: Language;
  t?: any;
}

export default function ContactSection({ language, t: tProp }: ContactSectionProps) {
  const t = tProp || translations[language];

  return (
    <section id="contact-page" className="py-12 md:py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
            {t.contact}
          </h2>
          <p className="text-3xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">
            {t.contactPageTitle}
          </p>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t.contactSubtitle}
          </p>
          <div className="w-12 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* Info Grid split into Map and Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Quick Info Cards Column (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-slate-50 dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                {t.officeAddressLabel}
              </h4>
              
              <div className="flex items-start space-x-3.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-white">{t.companyFullName}</p>
                  <p className="mt-1 leading-relaxed">{t.locationAddress}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-850 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4 flex-grow flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                  {language === 'en' ? 'Direct Plant Support' : 'सीधा प्लांट संपर्क'}
                </h4>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Call Owner */}
                  <a
                    href="tel:9568761213"
                    id="btn-contact-call-owner"
                    className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500/40 transition-all"
                  >
                    <div className="p-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Cattle / BMC Coordinator</p>
                      <p className="font-semibold text-slate-800 dark:text-white">Call Owner: 9568761213</p>
                    </div>
                  </a>

                  {/* WhatsApp chat */}
                  <a
                    href="https://wa.me/919568761213?text=Hi%20Yogendra%20Singh%20ji,%20I%20want%20to%20inquire%20about%20Sahaj%20Dairy%20milk%20collection."
                    target="_blank"
                    rel="noopener noreferrer"
                    id="btn-contact-wa-owner"
                    className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-500/40 transition-all"
                  >
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp Instant Support</p>
                      <p className="font-semibold text-slate-800 dark:text-white">Chat on WhatsApp: 9568761213</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Operating hours */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-6 flex items-center space-x-3 text-xs text-slate-500">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>
                  {language === 'en' 
                    ? 'Plant Open: 06:00 AM - 10:00 AM & 05:00 PM - 09:00 PM (Daily)' 
                    : 'प्लांट समय: सुबह 06:00 - 10:00 और शाम 05:00 - रात 09:00 (दैनिक)'}
                </span>
              </div>
            </div>
          </div>

          {/* Styled Google Map Embed (7 cols) */}
          <div className="lg:col-span-7 bg-slate-100 dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-md flex flex-col min-h-[300px]">
            <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.googleMapsTitle}</span>
              </span>
              <a
                href="https://maps.google.com/?q=Karimganj,Mainpuri,Uttar+Pradesh,India"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 font-bold flex items-center space-x-1"
              >
                <span>Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            
            {/* Interactive map iframe representation */}
            <div className="flex-grow w-full h-full min-h-[250px] relative">
              <iframe
                title="Sahaj Dairy Chilling Center Google Maps location"
                src="https://maps.google.com/maps?q=Karimganj,Mainpuri,Uttar%20Pradesh,India&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="absolute inset-0 w-full h-full border-none opacity-90 grayscale-[15%] dark:grayscale-[30%] invert-0 dark:invert-[5%] dark:contrast-[100%]"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
              ></iframe>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
