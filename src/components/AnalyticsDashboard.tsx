/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language, Farmer, MilkEntry, Payment } from '../types';
import { translations } from '../translations';
import { motion } from 'motion/react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { Users, Droplets, Landmark, AlertCircle, TrendingUp, Compass } from 'lucide-react';

interface AnalyticsDashboardProps {
  language: Language;
  farmers: Farmer[];
  milkEntries: MilkEntry[];
  payments: Payment[];
}

export default function AnalyticsDashboard({
  language,
  farmers,
  milkEntries,
  payments,
}: AnalyticsDashboardProps) {
  const t = translations[language];

  // Calculations
  const totalFarmers = farmers.length;
  const totalMilk = Math.round(milkEntries.reduce((sum, entry) => sum + entry.quantity, 0) * 10) / 10;
  
  // Today is 2026-06-27 in the system time context
  const todayStr = '2026-06-27';
  const todayMilk = Math.round(milkEntries
    .filter(entry => entry.date === todayStr)
    .reduce((sum, entry) => sum + entry.quantity, 0) * 10) / 10;

  // Monthly collection (June 2026)
  const monthlyMilk = Math.round(milkEntries
    .filter(entry => entry.date.startsWith('2026-06'))
    .reduce((sum, entry) => sum + entry.quantity, 0) * 10) / 10;

  const totalValue = milkEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalPaid = payments.reduce((sum, pay) => sum + pay.amount, 0);
  const pendingPayments = Math.max(0, Math.round((totalValue - totalPaid) * 100) / 100);

  // 1. Village Wise Collection Distribution
  const villageDataMap: { [key: string]: { name: string; quantity: number; amount: number } } = {};
  milkEntries.forEach(entry => {
    const f = farmers.find(farm => farm.id === entry.farmerId);
    if (f) {
      const vName = language === 'en' ? f.village : f.villageHi;
      if (!villageDataMap[vName]) {
        villageDataMap[vName] = { name: vName, quantity: 0, amount: 0 };
      }
      villageDataMap[vName].quantity += entry.quantity;
      villageDataMap[vName].amount += entry.amount;
    }
  });
  const villageChartData = Object.values(villageDataMap).map(v => ({
    name: v.name,
    quantity: Math.round(v.quantity * 10) / 10,
    amount: Math.round(v.amount),
  }));

  // 2. Collection Trends Chart (Grouped by Date)
  const dateDataMap: { [date: string]: { date: string; morning: number; evening: number; total: number } } = {};
  milkEntries.forEach(entry => {
    const d = entry.date;
    if (!dateDataMap[d]) {
      dateDataMap[d] = { date: d, morning: 0, evening: 0, total: 0 };
    }
    if (entry.shift === 'morning') {
      dateDataMap[d].morning += entry.quantity;
    } else {
      dateDataMap[d].evening += entry.quantity;
    }
    dateDataMap[d].total += entry.quantity;
  });
  const trendsChartData = Object.keys(dateDataMap)
    .sort()
    .map(date => {
      const formattedDate = date.split('-').slice(1).join('/'); // MM/DD format
      return {
        date: formattedDate,
        morning: Math.round(dateDataMap[date].morning * 10) / 10,
        evening: Math.round(dateDataMap[date].evening * 10) / 10,
        total: Math.round(dateDataMap[date].total * 10) / 10,
      };
    });

  // 3. Fat vs SNF averages per village
  const villageQualityMap: { [key: string]: { count: number; fatSum: number; snfSum: number } } = {};
  milkEntries.forEach(entry => {
    const f = farmers.find(farm => farm.id === entry.farmerId);
    if (f) {
      const vName = language === 'en' ? f.village : f.villageHi;
      if (!villageQualityMap[vName]) {
        villageQualityMap[vName] = { count: 0, fatSum: 0, snfSum: 0 };
      }
      villageQualityMap[vName].count += 1;
      villageQualityMap[vName].fatSum += entry.fat;
      villageQualityMap[vName].snfSum += entry.snf;
    }
  });
  const qualityChartData = Object.keys(villageQualityMap).map(v => ({
    name: v,
    fat: Math.round((villageQualityMap[v].fatSum / villageQualityMap[v].count) * 100) / 100,
    snf: Math.round((villageQualityMap[v].snfSum / villageQualityMap[v].count) * 100) / 100,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#06b6d4', '#6366f1', '#ec4899', '#f59e0b'];

  return (
    <div className="space-y-8">
      {/* Top Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Today Collection */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
              {t.analyticsTodayCollection}
            </span>
            <div className="p-2 bg-white/10 rounded-xl">
              <Droplets className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">{todayMilk} L</h3>
            <p className="text-[10px] text-blue-100 mt-1">Date: {todayStr}</p>
          </div>
        </div>

        {/* Card 2: Registered Farmers */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.analyticsTotalFarmers}
            </span>
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-xl border border-blue-100 dark:border-blue-900/40">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{totalFarmers}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Cooperative members</p>
          </div>
        </div>

        {/* Card 3: Monthly Collection */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.analyticsMonthlyCollection}
            </span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-950 rounded-xl border border-emerald-100 dark:border-emerald-900/40">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{monthlyMilk} L</h3>
            <p className="text-[10px] text-slate-400 mt-1">June 2026</p>
          </div>
        </div>

        {/* Card 4: Total Payments Paid */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.analyticsTotalPaid}
            </span>
            <div className="p-2 bg-cyan-50 dark:bg-cyan-950 rounded-xl border border-cyan-100 dark:border-cyan-900/40">
              <Landmark className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">₹{totalPaid.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Cleared payouts</p>
          </div>
        </div>

        {/* Card 5: Cooperative Pending Payments */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {t.analyticsPendingBalance}
            </span>
            <div className="p-2 bg-rose-50 dark:bg-rose-950 rounded-xl border border-rose-100 dark:border-rose-900/40">
              <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">₹{pendingPayments.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Accrued credit ledger</p>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Chart 1: Daily Milk Collection Trends */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{t.collectionTrendsChart}</h4>
              <p className="text-xs text-slate-400">Consolidated morning vs evening chilling intakes</p>
            </div>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendsChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="morningGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="eveningGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="morning" name={language === 'en' ? 'Morning Shift' : 'सुबह की शिफ्ट'} stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#morningGrad)" />
                <Area type="monotone" dataKey="evening" name={language === 'en' ? 'Evening Shift' : 'शाम की शिफ्ट'} stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#eveningGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Village wise Milk Distribution */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{t.villageIntakeChart}</h4>
            <p className="text-xs text-slate-400">Total litres delivered by village centers</p>
          </div>
          
          <div className="h-56 w-full flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={villageChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="quantity"
                >
                  {villageChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} Litres`, 'Volume']} />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center display */}
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-slate-800 dark:text-white">{totalMilk}</span>
              <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Total Litres</span>
            </div>
          </div>

          {/* Custom Legends list */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            {villageChartData.map((item, index) => (
              <div key={item.name} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                <span className="truncate text-slate-600 dark:text-slate-300 font-medium">{item.name} ({item.quantity} L)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Row Quality Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Standards Panel */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{t.avgQuality}</h4>
            <p className="text-xs text-slate-400">Regional milk fat & solids-not-fat parameters</p>
          </div>

          <div className="space-y-4 my-6">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <span>Average Fat Quality</span>
                <span>6.2 %</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '62%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Cooperative target: 6.5% Fat (Standard buffalo ratio)</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                <span>Average SNF Quality</span>
                <span>8.9 %</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: '89%' }}></div>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Cooperative target: 9.0% Solid-Not-Fat (Standard density)</p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/30 flex items-start space-x-2.5">
            <Compass className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
            <p className="text-[11px] leading-relaxed text-blue-800 dark:text-blue-300 font-medium">
              Karimganj BMC maintains a strict quality matrix. Substandard milk below 3.5% Fat or 8.0% SNF triggers immediate corrective coaching for veterinary feed refinement.
            </p>
          </div>
        </div>

        {/* Quality spread by village chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">{t.qualitySpreadChart}</h4>
            <p className="text-xs text-slate-400">Comparing regional Fat vs SNF density ratios by village centers</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={qualityChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 10]} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="fat" name="Fat %" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="snf" name="SNF %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
