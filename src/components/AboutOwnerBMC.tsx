/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';
import { translations } from '../translations';
import { motion } from 'motion/react';
import { Award, ShieldAlert, Sparkles, TrendingUp, CheckCircle, Flame, Leaf, HelpCircle, Phone } from 'lucide-react';
import ownerPhoto from '../assets/images/bmc_owner_photo_1782622300140.jpg';

interface AboutOwnerBMCProps {
  language: Language;
  t?: any;
}

export default function AboutOwnerBMC({ language, t: tProp }: AboutOwnerBMCProps) {
  const t = tProp || translations[language];

  const services = [
    {
      id: 'service-1',
      title: t.service1Title,
      desc: t.service1Desc,
      icon: Sparkles,
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      id: 'service-2',
      title: t.service2Title,
      desc: t.service2Desc,
      icon: TrendingUp,
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    },
    {
      id: 'service-3',
      title: t.service3Title,
      desc: t.service3Desc,
      icon: Award,
      color: 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20'
    },
    {
      id: 'service-4',
      title: t.service4Title,
      desc: t.service4Desc,
      icon: CheckCircle,
      color: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20'
    }
  ];

  const benefits = [
    t.benefit1,
    t.benefit2,
    t.benefit3,
    t.benefit4
  ];

  return (
    <section id="about-section" className="py-16 md:py-24 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-base font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase">
            {t.appName}
          </h2>
          <p className="text-3xl sm:text-4xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">
            {t.aboutSectionTitle}
          </p>
          <div className="w-16 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* 1. Owner Introduction Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Owner Photo Panel */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-600 to-emerald-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition duration-300"></div>
              <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-[280px] sm:w-[320px] shadow-xl">
                <img
                  src={ownerPhoto}
                  alt="Mr. Yogendra Singh - Sahaj Dairy Founder"
                  className="w-full h-80 object-cover object-top scale-105 group-hover:scale-100 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="p-5 text-center bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700/50 space-y-1.5">
                  <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                    {t.aboutName || t.ownerName}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {t.aboutRole || t.ownerDesignation}
                  </p>
                  {t.aboutPhone && (
                    <div className="flex items-center justify-center space-x-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono font-bold bg-slate-50 dark:bg-slate-900/60 py-1 px-2.5 rounded-full border border-slate-100 dark:border-slate-800 max-w-fit mx-auto">
                      <Phone className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{t.aboutPhone}</span>
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {t.locationAddress.split(',').slice(0, 3).join(',')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Owner Text Block */}
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.ownerIntroTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
              {t.ownerIntroBody}
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex items-start space-x-3">
                <div className="mt-1 p-1 bg-blue-100 dark:bg-blue-950 rounded text-blue-600 dark:text-blue-400">
                  <Leaf className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">100% Purity</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Chemical-free cooling chain</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-1 p-1 bg-emerald-100 dark:bg-emerald-950 rounded text-emerald-600 dark:text-emerald-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Empowered Farmers</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Transparent billing & weights</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. BMC Technology Block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-8">
          {/* BMC Info Left */}
          <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              {t.bmcTitle}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.bmcBody1}
            </p>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {t.bmcBody2}
            </p>
          </div>

          {/* BMC Image Right */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <div className="relative overflow-hidden rounded-2xl shadow-xl aspect-[4/3] bg-slate-100 max-w-md border border-slate-200 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&h=450&q=80"
                alt="Bulk Milk Chiller tank stainless steel"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 left-3 bg-blue-600/90 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                Mainpuri Chilling Center
              </div>
            </div>
          </div>
        </div>

        {/* 3. Services Grid */}
        <div className="space-y-12 pt-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {t.servicesTitle}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Our computerized testing systems guarantee accuracy down to 0.1% Fat & SNF.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((svc) => {
              const Icon = svc.icon;
              return (
                <div key={svc.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/70 hover:border-blue-400/50 dark:hover:border-blue-500/30 transition-all shadow-sm">
                  <div className={`p-3 rounded-xl inline-block border ${svc.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {svc.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-300 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. Benefits, Mission & Vision Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Left: Mission & Vision */}
          <div className="lg:col-span-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold flex items-center space-x-2">
              <Award className="w-6 h-6 text-emerald-400" />
              <span>{t.missionTitle}</span>
            </h3>
            
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Our Mission</h4>
                <p className="text-sm sm:text-base mt-1 text-blue-50 leading-relaxed">{t.missionText}</p>
              </div>
              <div className="bg-white/10 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">Our Vision</h4>
                <p className="text-sm sm:text-base mt-1 text-blue-50 leading-relaxed">{t.visionText}</p>
              </div>
            </div>
          </div>

          {/* Right: Farmer Benefits */}
          <div className="lg:col-span-6 bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-3xl p-6 sm:p-8 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-emerald-900 dark:text-emerald-300 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <span>{t.benefitsTitle}</span>
            </h3>

            <div className="space-y-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start space-x-3 bg-white dark:bg-slate-900/40 p-3 sm:p-4 rounded-xl border border-emerald-100/50 dark:border-emerald-900/10 shadow-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
