/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../translations';
import { motion } from 'motion/react';
import { Code2, Phone, Mail, MessageSquare, Send, CheckCircle2, Award } from 'lucide-react';

interface DeveloperSectionProps {
  language: Language;
}

export default function DeveloperSection({ language }: DeveloperSectionProps) {
  const t = translations[language];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert(language === 'en' ? 'Please fill in your Name and Phone Number.' : 'कृपया अपना नाम और मोबाइल नंबर दर्ज करें।');
      return;
    }
    setIsSubmitted(true);
    // Reset form
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <section id="developer-page" className="py-12 md:py-16 bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background soft lighting effects */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center justify-center space-x-1">
            <Code2 className="w-4 h-4" />
            <span>Developer Portfolio</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-sans font-bold text-white tracking-tight">
            {t.devTitle}
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 mx-auto rounded-full"></div>
        </div>

        {/* Content Split: Profile Card and Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Profile Card Column */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="bg-slate-800/55 backdrop-blur-md border border-slate-700/60 p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6 h-full flex flex-col justify-between">
              
              <div className="space-y-4">
                {/* Profile Header */}
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full blur opacity-75"></div>
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-slate-700 overflow-hidden border-2 border-slate-600 flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-blue-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center space-x-1.5">
                      <span>{t.devNameTitle}</span>
                      <Award className="w-4.5 h-4.5 text-emerald-400" />
                    </h3>
                    <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider mt-1">{t.devRole}</p>
                  </div>
                </div>

                {/* Display Message */}
                <div className="border-t border-slate-700/50 pt-4 space-y-3">
                  <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed">
                    "{t.devMessage}"
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {t.devMessageContact}
                  </p>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="space-y-3 pt-6 border-t border-slate-700/50">
                {/* Call Button */}
                <a
                  href={`tel:${t.devPhone}`}
                  id="btn-dev-call"
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-blue-600/20 hover:bg-blue-600 border border-blue-500/30 hover:border-blue-500 text-white font-semibold rounded-xl text-sm transition-all"
                >
                  <Phone className="w-4 h-4 text-blue-400 group-hover:text-white" />
                  <span>{language === 'en' ? 'Call Devansh' : 'देवांश को कॉल करें'} (+91 9756198223)</span>
                </a>

                {/* WhatsApp Button */}
                <a
                  href={`https://wa.me/919756198223?text=Hi%20Devansh,%20I%20saw%20your%20Sahaj%20Dairy%20Management%20Application%20and%20want%20to%20hire%20you.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="btn-dev-wa"
                  className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-500 text-white font-semibold rounded-xl text-sm transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'en' ? 'WhatsApp Devansh' : 'व्हाट्सएप चैट करें'}</span>
                </a>

                {/* Email Info */}
                <div className="flex items-center space-x-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-mono text-slate-300 truncate">{t.devEmail}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Contact Developer Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-slate-800/30 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl h-full flex flex-col justify-center">
              
              <h3 className="text-lg sm:text-xl font-bold mb-6 text-white border-b border-slate-700/50 pb-2">
                {t.devFormTitle}
              </h3>

              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-emerald-950/40 border border-emerald-800/50 p-6 rounded-2xl text-center space-y-4"
                >
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto text-white">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-400">{language === 'en' ? 'Submission Successful!' : 'सफलतापूर्वक भेजा गया!'}</h4>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {t.devFormSuccess}
                  </p>
                  <button
                    id="btn-dev-form-reset"
                    onClick={() => setIsSubmitted(false)}
                    className="text-xs font-bold text-blue-400 underline hover:text-blue-300"
                  >
                    {language === 'en' ? 'Send another inquiry' : 'दूसरी पूछताछ भेजें'}
                  </button>
                </motion.div>
              ) : (
                <form id="dev-contact-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">{t.senderName} <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder={language === 'en' ? 'Enter your name' : 'अपना नाम लिखें'}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white transition-all"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-400">{t.senderPhone} <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        required
                        placeholder={language === 'en' ? 'Enter phone number' : 'मोबाइल नंबर लिखें'}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">{t.senderEmail}</label>
                    <input
                      type="email"
                      placeholder="e.g. name@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-400">{t.senderMsg} <span className="text-red-500">*</span></label>
                    <textarea
                      rows={4}
                      required
                      placeholder={language === 'en' ? 'Write your custom web requirements or project queries here...' : 'अपनी वेबसाइट की आवश्यकताएं या प्रोजेक्ट के बारे में यहां लिखें...'}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-white transition-all resize-none"
                    />
                  </div>

                  <button
                    id="btn-dev-form-submit"
                    type="submit"
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t.sendInquiryBtn}</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
