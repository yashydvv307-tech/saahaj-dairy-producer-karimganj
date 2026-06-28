/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, AppView } from '../types';
import { translations } from '../translations';
import { motion } from 'motion/react';
import { Users, Droplets, Snowflake, Home, Shield, ArrowRight } from 'lucide-react';

interface HeroProps {
  language: Language;
  onNavigate: (view: AppView) => void;
  stats: {
    totalFarmers: number;
    totalMilk: number;
    bmcCapacity: string;
    activeVillages: number;
  };
  t?: any;
}

export default function Hero({ language, onNavigate, stats, t: tProp }: HeroProps) {
  const t = tProp || translations[language];

  const statItems = [
    {
      id: 'stat-farmers',
      icon: Users,
      value: stats.totalFarmers,
      label: t.statsFarmers,
      sub: t.statsFarmersSub,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
      border: 'border-blue-100 dark:border-blue-900/30'
    },
    {
      id: 'stat-milk',
      icon: Droplets,
      value: `${stats.totalMilk.toLocaleString()} L`,
      label: t.statsMilkCollected,
      sub: t.statsMilkSub,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-100 dark:border-emerald-900/30'
    },
    {
      id: 'stat-bmc',
      icon: Snowflake,
      value: stats.bmcCapacity,
      label: t.statsBmcCapacity,
      sub: t.statsBmcSub,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      border: 'border-cyan-100 dark:border-cyan-900/30'
    },
    {
      id: 'stat-villages',
      icon: Home,
      value: stats.activeVillages,
      label: t.statsVillages,
      sub: t.statsVillagesSub,
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-100 dark:border-indigo-900/30'
    }
  ];

  return (
    <section id="hero-section" className="relative overflow-hidden py-12 md:py-20 lg:py-24 bg-gradient-to-b from-blue-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Decorative blurred blobs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-emerald-300/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Typography and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-emerald-100/80 dark:bg-emerald-950/50 border border-emerald-200/50 dark:border-emerald-800/30 px-3 py-1 rounded-full text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm font-semibold tracking-wide"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{t.companyFullName} • Mainpuri</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-sans font-bold tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              {t.heroTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
            >
              {t.heroSubtitle}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4 pt-2"
            >
              <button
                id="btn-hero-farmer"
                onClick={() => onNavigate('farmer-portal')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2 border border-blue-500/20 cursor-pointer"
              >
                <span>{t.enterPortal}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="btn-hero-admin"
                onClick={() => onNavigate('admin-portal')}
                className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{t.adminAccess}</span>
              </button>
            </motion.div>
          </div>

          {/* Right Column: Interactive Image Panel */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative z-10 overflow-hidden rounded-2xl border-4 border-white dark:border-slate-800 shadow-2xl aspect-[4/3] bg-slate-100"
            >
              <img
                src="https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80"
                alt="Fresh Organic Dairy Milk Collection"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent"></div>
              
              {/* Floating Overlay Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-4 rounded-xl border border-white/20 dark:border-slate-800/40 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500 text-white rounded-lg">
                    <Snowflake className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">Active Operations</h4>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">Rapid Chilling Center Live (4°C)</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Back Accent Card */}
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-blue-600/10 dark:bg-blue-400/5 rounded-2xl -z-10 transform -rotate-1"></div>
          </div>
        </div>

        {/* Bottom Panel: Dynamic Stats */}
        <div className="mt-16 lg:mt-24">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {statItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * idx + 0.3 }}
                  className={`p-4 sm:p-6 rounded-2xl border ${item.border} ${item.bg} flex flex-col justify-between shadow-sm hover:shadow-md transition-all`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {item.label}
                    </span>
                    <div className={`p-2 rounded-xl ${item.bg} border ${item.border}`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">
                      {item.value}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {item.sub}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
