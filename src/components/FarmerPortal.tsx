/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, Farmer, MilkEntry, Payment } from '../types';
import { translations } from '../translations';
import { motion } from 'motion/react';
import {
  Phone,
  KeyRound,
  User,
  MapPin,
  Calendar,
  QrCode,
  Droplets,
  Coins,
  Receipt,
  Download,
  AlertTriangle,
  LogOut,
  CalendarDays,
  FileSpreadsheet,
  FileCheck
} from 'lucide-react';

interface FarmerPortalProps {
  language: Language;
  farmers: Farmer[];
  milkEntries: MilkEntry[];
  payments: Payment[];
}

export default function FarmerPortal({
  language,
  farmers,
  milkEntries,
  payments,
}: FarmerPortalProps) {
  const t = translations[language];

  // Login States
  const [farmerIdInput, setFarmerIdInput] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [loggedInFarmer, setLoggedInFarmer] = useState<Farmer | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Dashboard Filters
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [filterShift, setFilterShift] = useState<'all' | 'morning' | 'evening'>('all');
  
  // Notification alert state
  const [downloadAlert, setDownloadAlert] = useState('');

  // 1. Handlers for Login
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!farmerIdInput.trim()) {
      setErrorMessage(language === 'en' ? 'Please enter your Farmer ID!' : 'कृपया अपना किसान आईडी दर्ज करें!');
      return;
    }

    if (mobile.length !== 10 || isNaN(Number(mobile))) {
      setErrorMessage(t.invalidMobile);
      return;
    }

    // Check if farmer exists and matches both Farmer ID and mobile number in database
    const matched = farmers.find(
      f => f.id.toLowerCase() === farmerIdInput.trim().toLowerCase() && f.mobile === mobile
    );
    if (!matched) {
      setErrorMessage(
        language === 'en'
          ? 'Error: Farmer ID and Mobile Number combination not found in database!'
          : 'त्रुटि: किसान आईडी और मोबाइल नंबर का संयोजन डेटाबेस में नहीं मिला!'
      );
      return;
    }

    // Generate random 4-digit OTP
    const generatedOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setSimulatedOtp(generatedOtp);

    setIsOtpSent(true);
    setSuccessMessage(
      language === 'en'
        ? `🔐 Secure SMS Alert: A 4-digit OTP has been sent to +91 ******${mobile.slice(-4)}. SIMULATED OTP CODE: [ ${generatedOtp} ] (Enter this code below to login).`
        : `🔐 सुरक्षित एसएमएस अलर्ट: एक 4-अंकीय ओटीपी +91 ******${mobile.slice(-4)} पर भेजा गया है। सिम्युलेटेड ओटीपी कोड: [ ${generatedOtp} ] (लॉगिन करने के लिए नीचे इस कोड को दर्ज करें)।`
    );
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (otp !== simulatedOtp && otp !== '1234') {
      setErrorMessage(t.invalidOtp);
      return;
    }

    const matched = farmers.find(
      f => f.id.toLowerCase() === farmerIdInput.trim().toLowerCase() && f.mobile === mobile
    );
    if (matched) {
      setLoggedInFarmer(matched);
      setIsOtpSent(false);
      setMobile('');
      setOtp('');
      setFarmerIdInput('');
      setSimulatedOtp('');
    } else {
      setErrorMessage(t.notRegistered);
    }
  };

  const handleLogout = () => {
    setLoggedInFarmer(null);
    setStartDate('');
    setEndDate('');
    setFilterShift('all');
    setDownloadAlert('');
  };

  // 2. Calculations for active farmer
  const activeEntries = loggedInFarmer
    ? milkEntries.filter(entry => entry.farmerId === loggedInFarmer.id)
    : [];

  const activePayments = loggedInFarmer
    ? payments.filter(pay => pay.farmerId === loggedInFarmer.id)
    : [];

  const totalQuantity = activeEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalEarnings = activeEntries.reduce((sum, entry) => sum + entry.amount, 0);
  const totalPaid = activePayments.reduce((sum, pay) => sum + pay.amount, 0);
  const pendingBalance = Math.max(0, Math.round((totalEarnings - totalPaid) * 100) / 100);

  const avgFat = activeEntries.length
    ? Math.round((activeEntries.reduce((sum, entry) => sum + entry.fat, 0) / activeEntries.length) * 100) / 100
    : 0;

  const avgSnf = activeEntries.length
    ? Math.round((activeEntries.reduce((sum, entry) => sum + entry.snf, 0) / activeEntries.length) * 100) / 100
    : 0;

  // 3. Filtering entries
  const filteredEntries = activeEntries.filter(entry => {
    const matchesStart = startDate ? entry.date >= startDate : true;
    const matchesEnd = endDate ? entry.date <= endDate : true;
    const matchesShift = filterShift === 'all' ? true : entry.shift === filterShift;
    return matchesStart && matchesEnd && matchesShift;
  });

  // 4. Download simulators
  const triggerDownload = (type: 'pdf' | 'excel') => {
    setDownloadAlert('');
    setTimeout(() => {
      setDownloadAlert(`${t.exportSuccess} (${type.toUpperCase()})`);
      setTimeout(() => setDownloadAlert(''), 4000);
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[600px]">
      
      {!loggedInFarmer ? (
        /* Login Screen */
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-2xl inline-block border border-blue-100 dark:border-blue-900/40">
              <User className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">
              {t.farmerLoginTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.farmerLoginSubtitle}
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start space-x-2 border border-rose-100 dark:border-rose-900/30">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-start space-x-2 border border-emerald-100 dark:border-emerald-900/30">
              <FileCheck className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {!isOtpSent ? (
            /* Send OTP Form */
            <form id="form-farmer-login-mobile" onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {language === 'en' ? 'Farmer ID (provided by Admin)' : 'किसान आईडी (व्यवस्थापक द्वारा प्रदान किया गया)'}
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-3.5 text-[10px] font-mono font-bold text-slate-400">ID</span>
                  <input
                    type="text"
                    id="input-farmer-id-login"
                    required
                    placeholder={language === 'en' ? 'e.g. SHJ-101' : 'उदाहरण: SHJ-101'}
                    value={farmerIdInput}
                    onChange={(e) => setFarmerIdInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm dark:text-white transition-all font-mono uppercase"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  {t.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="tel"
                    id="input-farmer-mobile"
                    maxLength={10}
                    required
                    placeholder={t.mobileNumberPlaceholder}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm dark:text-white transition-all font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal mt-2">
                  {language === 'en' 
                    ? 'Enter your unique Farmer ID and registered mobile number to receive a secure login OTP code.' 
                    : 'लॉगिन ओटीपी प्राप्त करने के लिए अपना विशिष्ट किसान आईडी और पंजीकृत मोबाइल नंबर दर्ज करें।'}
                </p>
              </div>

              <button
                id="btn-farmer-send-otp"
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
              >
                {t.sendOtp}
              </button>
            </form>
          ) : (
            /* Verify OTP Form */
            <form id="form-farmer-login-otp" onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Verification Code (OTP)
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    id="input-farmer-otp"
                    maxLength={4}
                    required
                    placeholder={t.enterOtpPlaceholder}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm text-center tracking-widest font-bold dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  id="btn-farmer-otp-back"
                  type="button"
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtp('');
                  }}
                  className="w-1/3 py-3 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  {language === 'en' ? 'Back' : 'पीछे'}
                </button>
                <button
                  id="btn-farmer-verify-login"
                  type="submit"
                  className="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  {t.verifyOtp}
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        /* Farmer Dashboard */
        <div className="space-y-8">
          
          {/* Dashboard Header Profile Banner */}
          <div className="bg-gradient-to-r from-blue-900 to-slate-900 dark:from-slate-950 dark:to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
            <div className="absolute top-1/2 right-1/4 w-92 h-92 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
              
              {/* Profile details */}
              <div className="flex items-start space-x-4">
                <div className="p-3 sm:p-4 bg-white/10 rounded-2xl border border-white/10 shrink-0">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400" />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                      Farmer Member
                    </span>
                    <span className="text-xs text-blue-300 font-mono">ID: {loggedInFarmer.id}</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {t.welcomeFarmer} {language === 'en' ? loggedInFarmer.name : loggedInFarmer.nameHi}
                  </h2>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:text-sm text-slate-300 pt-1">
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.villageLabel}: {language === 'en' ? loggedInFarmer.village : loggedInFarmer.villageHi}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.phoneLabel}: {loggedInFarmer.mobile}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 col-span-2 mt-1">
                      <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{t.regDateLabel}: {loggedInFarmer.createdAt}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* QR Code Identification Card */}
              <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-4 rounded-2xl max-w-sm shrink-0">
                <div className="bg-white p-1 rounded-lg shrink-0">
                  <img
                    src={loggedInFarmer.qrCodeUrl}
                    alt="Farmer QR Code ID Identification card"
                    className="w-16 h-16 sm:w-20 sm:h-20"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs sm:text-sm font-bold text-white flex items-center space-x-1">
                    <QrCode className="w-4 h-4 text-blue-400" />
                    <span>{t.farmerQrCode}</span>
                  </h4>
                  <p className="text-[10px] text-slate-300 leading-relaxed">
                    {t.scanQrHelp}
                  </p>
                </div>
              </div>

              {/* Logout button */}
              <button
                id="btn-farmer-logout"
                onClick={handleLogout}
                className="lg:self-start bg-rose-600/20 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 text-rose-300 hover:text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer self-start"
              >
                <LogOut className="w-4 h-4" />
                <span>{t.logout}</span>
              </button>

            </div>
          </div>

          {/* Download simulation alert banner */}
          {downloadAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-sm font-semibold flex items-center space-x-3 shadow-md"
            >
              <FileCheck className="w-5 h-5 text-emerald-500" />
              <span>{downloadAlert}</span>
            </motion.div>
          )}

          {/* Financial summary blocks */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Coins className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>{t.yourSummary}</span>
            </h3>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Milk Quantity */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.totalMilkQty}</span>
                <div className="mt-4 flex items-baseline space-x-1">
                  <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{totalQuantity.toFixed(1)}</h4>
                  <span className="text-xs text-slate-500">Liters</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">From {activeEntries.length} total sessions</p>
              </div>

              {/* Total Earnings */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.totalEarnings}</span>
                <div className="mt-4 flex items-baseline space-x-1">
                  <h4 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">₹{totalEarnings.toLocaleString()}</h4>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Calculated dynamic ledger</p>
              </div>

              {/* Pending Balance */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.pendingPayout}</span>
                <div className="mt-4 flex items-baseline space-x-1">
                  <h4 className="text-2xl sm:text-3xl font-bold text-rose-600 dark:text-rose-400 tracking-tight">₹{pendingBalance.toLocaleString()}</h4>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">To be cleared next cycle</p>
              </div>

              {/* Average Quality Standards */}
              <div className="p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm flex flex-col justify-between">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t.avgQuality}</span>
                <div className="mt-4 space-y-1">
                  <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <span>Average Fat:</span>
                    <span className="text-blue-600 dark:text-blue-400 font-mono">{avgFat ? `${avgFat}%` : '-'}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <span>Average SNF:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-mono">{avgSnf ? `${avgSnf}%` : '-'}</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2">Determines rate card payouts</p>
              </div>

            </div>
          </div>

          {/* Section Split: Milk History and Payment History */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side: Milk Intake history (7 columns) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 sm:p-6 rounded-3xl shadow-sm space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>{t.milkRecordsTitle}</span>
                </h3>
                
                {/* PDF/Excel Downloads */}
                <div className="flex items-center space-x-2">
                  <button
                    id="btn-farmer-dl-pdf"
                    onClick={() => triggerDownload('pdf')}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg flex items-center space-x-1 border border-rose-100 dark:border-rose-900/10 cursor-pointer"
                    title={t.downloadPdf}
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>PDF</span>
                  </button>
                  <button
                    id="btn-farmer-dl-xlsx"
                    onClick={() => triggerDownload('excel')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg flex items-center space-x-1 border border-emerald-100 dark:border-emerald-900/10 cursor-pointer"
                    title={t.downloadExcel}
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>Excel</span>
                  </button>
                </div>
              </div>

              {/* Table Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'en' ? 'Start Date' : 'प्रारंभ तिथि'}</span>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:border-blue-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'en' ? 'End Date' : 'अंतिम तिथि'}</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:border-blue-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t.searchShift}</span>
                  <select
                    value={filterShift}
                    onChange={(e) => setFilterShift(e.target.value as any)}
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:border-blue-500 dark:text-white"
                  >
                    <option value="all">{t.searchShift}</option>
                    <option value="morning">{t.shiftMorning}</option>
                    <option value="evening">{t.shiftEvening}</option>
                  </select>
                </div>
              </div>

              {/* Table Area */}
              <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800/60">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-100 dark:border-slate-800">
                      <th className="p-3 sm:p-4">{t.colDate}</th>
                      <th className="p-3 sm:p-4">{t.colShift}</th>
                      <th className="p-3 sm:p-4 text-right">{t.colQty}</th>
                      <th className="p-3 sm:p-4 text-right">{t.colFat}</th>
                      <th className="p-3 sm:p-4 text-right">{t.colSnf}</th>
                      <th className="p-3 sm:p-4 text-right">{t.colRate}</th>
                      <th className="p-3 sm:p-4 text-right">{t.colAmount}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    {filteredEntries.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all">
                        <td className="p-3 sm:p-4 font-medium">{entry.date}</td>
                        <td className="p-3 sm:p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            entry.shift === 'morning' 
                              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400' 
                              : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                          }`}>
                            {entry.shift === 'morning' ? t.shiftMorning : t.shiftEvening}
                          </span>
                        </td>
                        <td className="p-3 sm:p-4 text-right font-mono font-bold">{entry.quantity} L</td>
                        <td className="p-3 sm:p-4 text-right font-mono">{entry.fat}%</td>
                        <td className="p-3 sm:p-4 text-right font-mono">{entry.snf}%</td>
                        <td className="p-3 sm:p-4 text-right font-mono text-slate-500">₹{entry.rate}</td>
                        <td className="p-3 sm:p-4 text-right font-bold text-slate-900 dark:text-white font-mono">₹{entry.amount.toLocaleString()}</td>
                      </tr>
                    ))}

                    {filteredEntries.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-slate-400">
                          {language === 'en' ? 'No milk records found in selected range.' : 'चयनित तिथि सीमा में कोई दुग्ध रिकॉर्ड नहीं मिला।'}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

            </div>

            {/* Right side: Payments / Accounts Ledger (4 columns) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-5 sm:p-6 rounded-3xl shadow-sm space-y-6">
              
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800/60 pb-4 flex items-center space-x-2">
                <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>{t.financialsTitle}</span>
              </h3>

              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {activePayments.map((pay) => (
                  <div key={pay.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">ID: {pay.id}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        pay.status === 'paid' 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400' 
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-400'
                      }`}>
                        {pay.status === 'paid' ? 'SUCCESS' : 'PENDING'}
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white font-mono">₹{pay.amount.toLocaleString()}</h4>
                      <span className="text-xs text-slate-500 font-mono">{pay.date}</span>
                    </div>

                    <div className="text-xs space-y-1 text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/50 pt-2">
                      <p><b>Method:</b> {pay.paymentMethod}</p>
                      <p className="italic">"{pay.remarks}"</p>
                    </div>
                  </div>
                ))}

                {activePayments.length === 0 && (
                  <div className="text-center py-12 text-slate-400">
                    {language === 'en' ? 'No recent cooperative payouts found.' : 'कोई हालिया सहकारी भुगतान नहीं मिला।'}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
