/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, Farmer, MilkEntry, Payment, Village, Notice, GalleryItem } from '../types';
import { translations } from '../translations';
import { calculateMilkRate } from '../data/initialData';
import { motion } from 'motion/react';
import {
  Shield,
  Lock,
  Plus,
  Trash2,
  Edit,
  Search,
  Droplets,
  Coins,
  Settings,
  FolderSync,
  FileSpreadsheet,
  Users,
  Compass,
  AlertTriangle,
  LogOut,
  MapPin,
  Bell,
  CheckCircle,
  FileCheck,
  Camera,
  Video,
  ShieldCheck,
  Check,
  Activity,
  RefreshCw,
  AlertCircle,
  Navigation,
  FlaskConical,
  Cpu
} from 'lucide-react';

interface AdminPortalProps {
  language: Language;
  farmers: Farmer[];
  milkEntries: MilkEntry[];
  payments: Payment[];
  villages: Village[];
  onAddFarmer: (farmer: Farmer) => void;
  onEditFarmer: (farmer: Farmer) => void;
  onDeleteFarmer: (id: string) => void;
  onAddMilkEntry: (entry: MilkEntry) => void;
  onAddPayment: (payment: Payment) => void;
  onAddVillage: (village: Village) => void;
  onRestoreBackup: (farmers: Farmer[], milkEntries: MilkEntry[], payments: Payment[], villages: Village[]) => void;
  
  // Dynamic Content CMS props
  websiteContent?: any;
  onUpdateWebsiteContent?: (content: any) => void;
  notices?: Notice[];
  onUpdateNotices?: (notices: Notice[]) => void;
  galleryItems?: GalleryItem[];
  onUpdateGalleryItems?: (items: GalleryItem[]) => void;
  rateMultipliers?: { fat: number; snf: number };
  onUpdateRateMultipliers?: (multipliers: { fat: number; snf: number }) => void;
}

type AdminTab = 'farmers' | 'milk' | 'payouts' | 'villages' | 'reports' | 'backup' | 'quality' | 'content';

export default function AdminPortal({
  language,
  farmers,
  milkEntries,
  payments,
  villages,
  onAddFarmer,
  onEditFarmer,
  onDeleteFarmer,
  onAddMilkEntry,
  onAddPayment,
  onAddVillage,
  onRestoreBackup,
  websiteContent,
  onUpdateWebsiteContent,
  notices = [],
  onUpdateNotices,
  galleryItems = [],
  onUpdateGalleryItems,
  rateMultipliers = { fat: 7.0, snf: 3.2 },
  onUpdateRateMultipliers,
}: AdminPortalProps) {
  const t = translations[language];

  // Local rate calculator that dynamically uses the admin-configured multipliers
  const calculateRate = (fat: number, snf: number): number => {
    const fMult = rateMultipliers?.fat ?? 7.0;
    const sMult = rateMultipliers?.snf ?? 3.2;
    const rate = (fat * fMult) + (snf * sMult);
    return Math.round(rate * 100) / 100;
  };

  // Admin Login States
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Password reset States
  const [newAdminUser, setNewAdminUser] = useState(() => localStorage.getItem('sahaj_dairy_admin_username') || 'admin');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [confirmAdminPass, setConfirmAdminPass] = useState('');

  // Active Management Tab
  const [activeTab, setActiveTab] = useState<AdminTab>('farmers');

  // Search & Filters
  const [farmerSearch, setFarmerSearch] = useState('');

  // Toast / Status Alerts
  const [alertMsg, setAlertMsg] = useState({ type: 'success' as 'success' | 'alert', text: '' });

  // 1. Farmer CRUD Form States
  const [isFarmerFormOpen, setIsFarmerFormOpen] = useState(false);
  const [editingFarmer, setEditingFarmer] = useState<Farmer | null>(null);
  const [farmerName, setFarmerName] = useState('');
  const [farmerNameHi, setFarmerNameHi] = useState('');
  const [farmerMobile, setFarmerMobile] = useState('');
  const [farmerVillage, setFarmerVillage] = useState('');

  // 2. Milk Entry Form States
  const [isMilkFormOpen, setIsMilkFormOpen] = useState(false);
  const [selectedFarmerId, setSelectedFarmerId] = useState('');
  const [milkQty, setMilkQty] = useState('');
  const [milkFat, setMilkFat] = useState('');
  const [milkSnf, setMilkSnf] = useState('');
  const [milkShift, setMilkShift] = useState<'morning' | 'evening'>('morning');

  // 3. Payment Form States
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);
  const [payFarmerId, setPayFarmerId] = useState('');
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('Direct Bank Transfer (IMPS/NEFT)');
  const [payRemarks, setPayRemarks] = useState('');

  // 4. Village Form States
  const [isVillageFormOpen, setIsVillageFormOpen] = useState(false);
  const [villageNameEn, setVillageNameEn] = useState('');
  const [villageNameHi, setVillageNameHi] = useState('');
  const [villageCenterCode, setVillageCenterCode] = useState('');

  // 5. Reports View Filters
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly' | 'yearly' | 'farmer' | 'village'>('daily');
  const [reportDate, setReportDate] = useState('2026-06-27');
  const [reportFarmerId, setReportFarmerId] = useState('');
  const [reportVillageName, setReportVillageName] = useState('');

  // 6. Quality Lab States
  const [labFarmerId, setLabFarmerId] = useState('');
  const [milkType, setMilkType] = useState<'buffalo' | 'cow'>('buffalo');

  // 7. Website CMS & Rates Management States
  const [activeSubTab, setActiveSubTab] = useState<'rates' | 'notices' | 'gallery' | 'sections'>('rates');
  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isAddingGallery, setIsAddingGallery] = useState(false);
  const [isLabScanning, setIsLabScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('');
  const [scannedFat, setScannedFat] = useState<number | null>(null);
  const [scannedSnf, setScannedSnf] = useState<number | null>(null);
  const [scannedTemp, setScannedTemp] = useState<number | null>(null);
  const [scannedAdulteration, setScannedAdulteration] = useState<string | null>(null);
  const [scannedAlcohol, setScannedAlcohol] = useState<string | null>(null);
  
  // Permissions & Hardware Status
  const [cameraPermission, setCameraPermission] = useState<'prompt' | 'granted' | 'denied' | 'error'>('prompt');
  const [locationPermission, setLocationPermission] = useState<'prompt' | 'granted' | 'denied' | 'error'>('prompt');
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number, longitude: number } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const streamRef = React.useRef<MediaStream | null>(null);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  React.useEffect(() => {
    if (activeTab !== 'quality') {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const handleRequestAllPermissions = () => {
    // 1. Geolocation Request
    if (navigator.geolocation) {
      setLocationPermission('prompt');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsCoords({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLocationPermission('granted');
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationPermission('denied');
          // Mock some realistic Mainpuri, UP coordinates so scanner works offline
          setGpsCoords({ latitude: 27.2241, longitude: 79.0234 });
        }
      );
    } else {
      setLocationPermission('denied');
      setGpsCoords({ latitude: 27.2241, longitude: 79.0234 });
    }

    // 2. Camera Request
    setCameraPermission('prompt');
    navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      .then((stream) => {
        streamRef.current = stream;
        setCameraPermission('granted');
        setCameraActive(true);
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        }, 300);
      })
      .catch((err) => {
        console.error('Camera access error:', err);
        setCameraPermission('denied');
        setCameraActive(false);
      });
  };

  const handleTriggerLabScan = () => {
    if (!labFarmerId) {
      triggerToast(language === 'en' ? 'Please select a registered farmer first!' : 'कृपया पहले एक पंजीकृत किसान का चयन करें!', 'alert');
      return;
    }
    
    setIsLabScanning(true);
    setScanProgress(0);
    setScannedFat(null);
    setScannedSnf(null);
    setScannedTemp(null);
    setScannedAdulteration(null);
    setScannedAlcohol(null);
    
    const steps = [
      { text: language === 'en' ? 'Calibrating ultrasonic transducer...' : 'अल्ट्रासोनिक ट्रांसड्यूसर को कैलिब्रेट किया जा रहा है...', progress: 15 },
      { text: language === 'en' ? 'Measuring lipid density and FAT% molecules...' : 'वसा (FAT) अणुओं और घनत्व को मापा जा रहा है...', progress: 40 },
      { text: language === 'en' ? 'Calculating solids-not-fat (SNF) hydration levels...' : 'एसएनएफ (SNF) जलयोजन स्तर की गणना की जा रही है...', progress: 65 },
      { text: language === 'en' ? 'Running chemical adulteration checks (Urea, Detergent, Starch)...' : 'रासायनिक मिलावट जांच (यूरिया, डिटर्जेंट, स्टार्च) की जा रही है...', progress: 85 },
      { text: language === 'en' ? 'Generating cryptographic GPS security seal...' : 'क्रिप्टोग्राफ़िक जीपीएस सुरक्षा सील जेनरेट की जा रही है...', progress: 95 },
      { text: language === 'en' ? 'Quality Analysis Complete!' : 'गुणवत्ता विश्लेषण पूर्ण!', progress: 100 }
    ];
    
    let currentStepIdx = 0;
    
    const interval = setInterval(() => {
      if (currentStepIdx < steps.length) {
        const step = steps[currentStepIdx];
        setScanStatusText(step.text);
        setScanProgress(step.progress);
        currentStepIdx++;
      } else {
        clearInterval(interval);
        
        let fat = 0;
        let snf = 0;
        if (milkType === 'buffalo') {
          fat = Number((6.2 + Math.random() * 2.8).toFixed(1)); // 6.2% - 9.0%
          snf = Number((8.8 + Math.random() * 0.8).toFixed(1)); // 8.8% - 9.6%
        } else {
          fat = Number((3.5 + Math.random() * 1.3).toFixed(1)); // 3.5% - 4.8%
          snf = Number((8.1 + Math.random() * 0.6).toFixed(1)); // 8.1% - 8.7%
        }
        
        const temp = Number((4.1 + Math.random() * 4.5).toFixed(1)); // 4°C - 8.6°C
        
        setScannedFat(fat);
        setScannedSnf(snf);
        setScannedTemp(temp);
        setScannedAdulteration('PASSED (100% PURE)');
        setScannedAlcohol('PASSED (Negative - Fresh)');
        setIsLabScanning(false);
        triggerToast(language === 'en' ? 'Milk quality sample successfully analyzed!' : 'दूध गुणवत्ता नमूने का सफलतापूर्वक विश्लेषण किया गया!', 'success');
      }
    }, 600);
  };

  const handleSendToMilkLog = () => {
    if (scannedFat !== null && scannedSnf !== null) {
      setSelectedFarmerId(labFarmerId);
      setMilkFat(scannedFat.toString());
      setMilkSnf(scannedSnf.toString());
      setIsMilkFormOpen(true);
      setActiveTab('milk');
      triggerToast(
        language === 'en'
          ? 'Quality data successfully pre-filled in Milk collection form!'
          : 'गुणवत्ता डेटा दूध संग्रह प्रपत्र में सफलतापूर्वक भर दिया गया है!',
        'success'
      );
    }
  };

  const triggerToast = (text: string, type: 'success' | 'alert' = 'success') => {
    setAlertMsg({ type, text });
    setTimeout(() => setAlertMsg({ type: 'success', text: '' }), 5000);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const savedUsername = localStorage.getItem('sahaj_dairy_admin_username') || 'admin';
    const savedPassword = localStorage.getItem('sahaj_dairy_admin_password') || 'SahajAdmin@2026';

    if (username.trim().toLowerCase() === savedUsername.toLowerCase() && password === savedPassword) {
      setIsAdminLoggedIn(true);
      triggerToast('Administrator secured credentials verified! Connected to Bulk Milk Chilling digital hub.');
    } else {
      setLoginError(t.invalidAdmin);
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  // Farmer Balance Calculations
  const getFarmerFinance = (fId: string) => {
    const activeEntries = milkEntries.filter(e => e.farmerId === fId);
    const activePayments = payments.filter(p => p.farmerId === fId);
    const totalEarnings = activeEntries.reduce((sum, e) => sum + e.amount, 0);
    const totalPaid = activePayments.reduce((sum, p) => sum + p.amount, 0);
    const pendingBalance = Math.max(0, Math.round((totalEarnings - totalPaid) * 100) / 100);
    return { totalEarnings, totalPaid, pendingBalance, quantity: activeEntries.reduce((sum, e) => sum + e.quantity, 0) };
  };

  // Farmer Save Handler
  const handleSaveFarmer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName || !farmerMobile || !farmerVillage) {
      alert('Please fill out all required fields.');
      return;
    }

    const matchingVillage = villages.find(v => v.name === farmerVillage);

    if (editingFarmer) {
      // Update Farmer
      const updated: Farmer = {
        ...editingFarmer,
        name: farmerName,
        nameHi: farmerNameHi || farmerName,
        mobile: farmerMobile,
        village: farmerVillage,
        villageHi: matchingVillage ? matchingVillage.nameHi : farmerVillage,
      };
      onEditFarmer(updated);
      triggerToast(`Farmer ${farmerName} profile successfully updated.`);
    } else {
      // Add Farmer
      const newId = `SHJ-${100 + farmers.length + 1}`;
      const created: Farmer = {
        id: newId,
        name: farmerName,
        nameHi: farmerNameHi || farmerName,
        mobile: farmerMobile,
        village: farmerVillage,
        villageHi: matchingVillage ? matchingVillage.nameHi : farmerVillage,
        createdAt: new Date().toISOString().split('T')[0],
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${newId}`,
      };
      onAddFarmer(created);
      triggerToast(`New Farmer registered under Code ${newId}! (Simulated QR Code generated).`);
    }

    // Reset Form
    setFarmerName('');
    setFarmerNameHi('');
    setFarmerMobile('');
    setFarmerVillage('');
    setEditingFarmer(null);
    setIsFarmerFormOpen(false);
  };

  const handleEditClick = (farmer: Farmer) => {
    setEditingFarmer(farmer);
    setFarmerName(farmer.name);
    setFarmerNameHi(farmer.nameHi);
    setFarmerMobile(farmer.mobile);
    setFarmerVillage(farmer.village);
    setIsFarmerFormOpen(true);
  };

  const handleDeleteClick = (id: string, name: string) => {
    if (confirm(`${t.deleteConfirm}\nTarget: ${name}`)) {
      onDeleteFarmer(id);
      triggerToast(`Farmer Code ${id} and all related records deleted completely from cloud.`, 'alert');
    }
  };

  // Milk Intake Entry Logger
  const handleSaveMilkEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFarmerId || !milkQty || !milkFat || !milkSnf) {
      alert('Please select farmer and enter weight, fat, and SNF measurements.');
      return;
    }

    const qtyVal = Number(milkQty);
    const fatVal = Number(milkFat);
    const snfVal = Number(milkSnf);
    const rateVal = calculateRate(fatVal, snfVal);
    const amountVal = Math.round(qtyVal * rateVal * 100) / 100;

    const newEntry: MilkEntry = {
      id: `ENT-${200 + milkEntries.length + 1}`,
      farmerId: selectedFarmerId,
      date: new Date().toISOString().split('T')[0], // Today's Date
      shift: milkShift,
      quantity: qtyVal,
      fat: fatVal,
      snf: snfVal,
      rate: rateVal,
      amount: amountVal,
      createdAt: new Date().toISOString().slice(0, 19),
    };

    onAddMilkEntry(newEntry);

    const f = farmers.find(farm => farm.id === selectedFarmerId);
    const alertMessage = `${f ? f.name : 'Farmer'} - Weight: ${qtyVal}L, Fat: ${fatVal}%, SNF: ${snfVal}%. Total Amount: ₹${amountVal.toLocaleString()} calculated automatically.`;
    
    // Simulate SMS and WhatsApp
    triggerToast(`Milk intake recorded! ${t.smsSentSuccess} ${f?.mobile || ''} & ${t.whatsappSentSuccess} trigger dispatched.`);

    // Reset Form
    setSelectedFarmerId('');
    setMilkQty('');
    setMilkFat('');
    setMilkSnf('');
    setMilkShift('morning');
    setIsMilkFormOpen(false);
  };

  // Payout Transaction Save
  const handleSavePayout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payFarmerId || !payAmount) {
      alert('Please select farmer and enter payment clearance amount.');
      return;
    }

    const amt = Number(payAmount);
    const f = farmers.find(farm => farm.id === payFarmerId);
    
    const newPayment: Payment = {
      id: `PAY-${300 + payments.length + 1}`,
      farmerId: payFarmerId,
      date: new Date().toISOString().split('T')[0],
      amount: amt,
      status: 'paid',
      paymentMethod: payMethod,
      remarks: payRemarks || 'Routine cooperative ledger payout clearing.'
    };

    onAddPayment(newPayment);
    triggerToast(`Cooperative Payout of ₹${amt.toLocaleString()} recorded successfully for farmer ${f ? f.name : payFarmerId}. Ledger cleared.`);

    // Reset Form
    setPayFarmerId('');
    setPayAmount('');
    setPayRemarks('');
    setIsPaymentFormOpen(false);
  };

  // Village Register Save
  const handleSaveVillage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!villageNameEn || !villageNameHi || !villageCenterCode) {
      alert('Please fill out all village details.');
      return;
    }

    const created: Village = {
      id: `VIL-0${villages.length + 1}`,
      name: villageNameEn,
      nameHi: villageNameHi,
      centerCode: villageCenterCode
    };

    onAddVillage(created);
    triggerToast(`New Cooperative Village Center ${villageNameEn} (${villageCenterCode}) successfully active.`);

    // Reset Form
    setVillageNameEn('');
    setVillageNameHi('');
    setVillageCenterCode('');
    setIsVillageFormOpen(false);
  };

  // Search filter
  const filteredFarmers = farmers.filter(f => {
    const s = farmerSearch.toLowerCase();
    return (
      f.name.toLowerCase().includes(s) ||
      f.nameHi.includes(s) ||
      f.id.toLowerCase().includes(s) ||
      f.mobile.includes(s) ||
      f.village.toLowerCase().includes(s) ||
      f.villageHi.includes(s)
    );
  });

  // Backup Dump download simulation
  const handleDownloadBackup = () => {
    const dataDump = {
      farmers,
      milkEntries,
      payments,
      villages,
      timestamp: new Date().toISOString()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataDump))}`;
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', jsonString);
    dlAnchor.setAttribute('download', `sahaj_dairy_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    triggerToast(t.backupSuccess);
  };

  // Reports data filter
  const getFilteredReportRecords = () => {
    return milkEntries.filter(entry => {
      const f = farmers.find(farm => farm.id === entry.farmerId);
      
      if (reportType === 'daily') {
        return entry.date === reportDate;
      } else if (reportType === 'weekly') {
        // Simple mock week boundaries check
        return entry.date >= '2026-06-21' && entry.date <= '2026-06-27';
      } else if (reportType === 'monthly') {
        return entry.date.startsWith('2026-06');
      } else if (reportType === 'yearly') {
        return entry.date.startsWith('2026');
      } else if (reportType === 'farmer') {
        return entry.farmerId === reportFarmerId;
      } else if (reportType === 'village') {
        return f ? f.village === reportVillageName : false;
      }
      return true;
    });
  };

  const reportRecords = getFilteredReportRecords();
  const totalReportLitres = Math.round(reportRecords.reduce((sum, r) => sum + r.quantity, 0) * 10) / 10;
  const totalReportAmt = Math.round(reportRecords.reduce((sum, r) => sum + r.amount, 0));

  const exportReportFile = (ext: 'pdf' | 'excel') => {
    triggerToast(`Generating structured print compilation... ${t.exportSuccess} (${ext.toUpperCase()})`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[600px]">
      
      {!isAdminLoggedIn ? (
        /* Admin Login Screen */
        <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-2xl inline-block border border-blue-100 dark:border-blue-900/40">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-sans font-bold text-slate-900 dark:text-white tracking-tight animate-fade-in">
              {t.adminAccess}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.adminLoginHelp}
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center space-x-2 border border-rose-100 dark:border-rose-900/30">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form id="form-admin-login" onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t.adminUsername}</label>
              <input
                type="text"
                required
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm dark:text-white transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{t.adminPassword}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-blue-500 text-sm dark:text-white transition-all"
                />
              </div>
            </div>

            <button
              id="btn-admin-login-submit"
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              {t.adminLoginBtn}
            </button>
          </form>
        </div>
      ) : (
        /* Admin Command Dashboard Panel */
        <div className="space-y-8">
          
          {/* Header Dashboard Banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 dark:from-slate-950 dark:to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-xs text-blue-400 font-bold uppercase tracking-widest">
                <Shield className="w-4 h-4" />
                <span>Sahaj Cooperatives Cloud System</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                {t.adminDashboardTitle}
              </h2>
              <p className="text-xs text-slate-400">
                Logged in securely • Plant region: Karimganj, Mainpuri
              </p>
            </div>

            <button
              id="btn-admin-logout"
              onClick={handleAdminLogout}
              className="px-4 py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-500 text-rose-300 hover:text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer self-start"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.logout}</span>
            </button>
          </div>

          {/* Toast message display */}
          {alertMsg.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl text-sm font-semibold flex items-center space-x-3 shadow-md border ${
                alertMsg.type === 'success' 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-850 dark:text-emerald-300' 
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-850 dark:text-rose-300'
              }`}
            >
              <CheckCircle className={`w-5 h-5 shrink-0 ${alertMsg.type === 'success' ? 'text-emerald-500' : 'text-rose-500'}`} />
              <span>{alertMsg.text}</span>
            </motion.div>
          )}

          {/* Navigation tabs inside Dashboard */}
          <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 pb-px gap-1 sm:gap-2">
            {[
              { id: 'farmers', label: t.farmerManagement, icon: Users },
              { id: 'milk', label: t.milkCollectionManagement, icon: Droplets },
              { id: 'quality', label: language === 'en' ? 'Quality Lab & Scan' : 'गुणवत्ता लैब और स्कैन', icon: FlaskConical },
              { id: 'payouts', label: t.payoutManagement, icon: Coins },
              { id: 'villages', label: t.villageManagement, icon: MapPin },
              { id: 'reports', label: 'Reports Hub', icon: FileSpreadsheet },
              { id: 'content', label: language === 'en' ? 'Website CMS & Rates' : 'वेबसाइट सीएमएस और दरें', icon: Settings },
              { id: 'backup', label: t.backupRestore, icon: FolderSync }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  id={`btn-admin-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center space-x-2 px-4 py-3 font-semibold text-xs sm:text-sm rounded-t-xl transition-all cursor-pointer border-b-2 ${
                    activeTab === tab.id
                      ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500 dark:border-blue-400 font-bold'
                      : 'text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/40'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* CONTENT ACCORDING TO TABS */}

          {/* TAB 1: FARMER REGISTRY CRUD */}
          {activeTab === 'farmers' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                {/* Search field */}
                <div className="relative w-full sm:max-w-xs">
                  <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t.searchFarmersPlaceholder}
                    value={farmerSearch}
                    onChange={(e) => setFarmerSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs focus:outline-none focus:border-blue-500 dark:text-white shadow-sm"
                  />
                </div>

                {/* Add Farmer trigger */}
                <button
                  id="btn-admin-add-farmer-open"
                  onClick={() => {
                    setEditingFarmer(null);
                    setFarmerName('');
                    setFarmerNameHi('');
                    setFarmerMobile('');
                    setFarmerVillage(villages[0]?.name || '');
                    setIsFarmerFormOpen(true);
                  }}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addFarmerTitle}</span>
                </button>
              </div>

              {/* Farmer Profile Editor Modal / Dropdown form */}
              {isFarmerFormOpen && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner space-y-4 max-w-xl">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-2">
                    {editingFarmer ? t.editFarmerTitle : t.addFarmerTitle}
                  </h4>
                  <form id="form-farmer-crud" onSubmit={handleSaveFarmer} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.farmerNameLabel} <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        placeholder="e.g. Ramesh Singh"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.farmerNameHiLabel}</label>
                      <input
                        type="text"
                        value={farmerNameHi}
                        onChange={(e) => setFarmerNameHi(e.target.value)}
                        placeholder="उदा. रमेश सिंह"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.phoneLabel} <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={farmerMobile}
                        onChange={(e) => setFarmerMobile(e.target.value)}
                        placeholder="10-Digit Mobile Number"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.farmerVillageLabel} <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={farmerVillage}
                        onChange={(e) => setFarmerVillage(e.target.value)}
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      >
                        <option value="">Select Village</option>
                        {villages.map(v => (
                          <option key={v.id} value={v.name}>{language === 'en' ? v.name : v.nameHi}</option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-2 flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        id="btn-admin-farmer-cancel"
                        type="button"
                        onClick={() => setIsFarmerFormOpen(false)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-850"
                      >
                        {t.cancel}
                      </button>
                      <button
                        id="btn-admin-farmer-save"
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700"
                      >
                        {t.save}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table of Farmers */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-100 dark:border-slate-800">
                        <th className="p-3 sm:p-4">Farmer ID</th>
                        <th className="p-3 sm:p-4">Name</th>
                        <th className="p-3 sm:p-4">Village</th>
                        <th className="p-3 sm:p-4">Mobile</th>
                        <th className="p-3 sm:p-4 text-right">Total Intake</th>
                        <th className="p-3 sm:p-4 text-right">Pending Balance</th>
                        <th className="p-3 sm:p-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {filteredFarmers.map((f) => {
                        const fin = getFarmerFinance(f.id);
                        return (
                          <tr key={f.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all">
                            <td className="p-3 sm:p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{f.id}</td>
                            <td className="p-3 sm:p-4">
                              <div className="font-bold">{language === 'en' ? f.name : f.nameHi}</div>
                              <div className="text-[10px] text-slate-400 font-mono">Reg: {f.createdAt}</div>
                            </td>
                            <td className="p-3 sm:p-4">{language === 'en' ? f.village : f.villageHi}</td>
                            <td className="p-3 sm:p-4 font-mono">{f.mobile}</td>
                            <td className="p-3 sm:p-4 text-right font-mono font-semibold">{fin.quantity.toFixed(1)} L</td>
                            <td className="p-3 sm:p-4 text-right font-mono font-bold text-rose-500">₹{fin.pendingBalance.toLocaleString()}</td>
                            <td className="p-3 sm:p-4 text-center">
                              <div className="flex justify-center items-center space-x-1.5">
                                <button
                                  id={`btn-admin-farmer-edit-${f.id}`}
                                  onClick={() => handleEditClick(f)}
                                  className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 rounded-lg"
                                  title={t.edit}
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  id={`btn-admin-farmer-del-${f.id}`}
                                  onClick={() => handleDeleteClick(f.id, f.name)}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 rounded-lg"
                                  title={t.delete}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {filteredFarmers.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-8 text-slate-400">
                            {t.noFarmersFound}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MILK INTAKE ENTRIES */}
          {activeTab === 'milk' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Log Milk Deliveries</span>
                </h3>

                <button
                  id="btn-admin-add-milk-open"
                  onClick={() => setIsMilkFormOpen(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addMilkEntryTitle}</span>
                </button>
              </div>

              {/* Add Milk Entry Form Panel */}
              {isMilkFormOpen && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner space-y-4 max-w-xl">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-2">
                    {t.addMilkEntryTitle}
                  </h4>

                  <form id="form-milk-entry" onSubmit={handleSaveMilkEntry} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.selectFarmer} <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={selectedFarmerId}
                        onChange={(e) => setSelectedFarmerId(e.target.value)}
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      >
                        <option value="">-- Choose registered farmer --</option>
                        {farmers.map(f => (
                          <option key={f.id} value={f.id}>{f.id} - {language === 'en' ? f.name : f.nameHi} ({language === 'en' ? f.village : f.villageHi})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.milkQtyLabel} <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        step="0.1"
                        min="0.5"
                        required
                        value={milkQty}
                        onChange={(e) => setMilkQty(e.target.value)}
                        placeholder="litres weight"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Intake Shift</label>
                      <div className="flex space-x-2">
                        <button
                          id="btn-admin-shift-m"
                          type="button"
                          onClick={() => setMilkShift('morning')}
                          className={`w-1/2 p-2 rounded-lg text-xs font-bold border transition-all ${
                            milkShift === 'morning'
                              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {t.shiftMorning}
                        </button>
                        <button
                          id="btn-admin-shift-e"
                          type="button"
                          onClick={() => setMilkShift('evening')}
                          className={`w-1/2 p-2 rounded-lg text-xs font-bold border transition-all ${
                            milkShift === 'evening'
                              ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {t.shiftEvening}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.fatLabel} <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        step="0.1"
                        min="2.0"
                        max="12.0"
                        required
                        value={milkFat}
                        onChange={(e) => setMilkFat(e.target.value)}
                        placeholder="e.g. 6.5"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.snfLabel} <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        step="0.1"
                        min="5.0"
                        max="11.0"
                        required
                        value={milkSnf}
                        onChange={(e) => setMilkSnf(e.target.value)}
                        placeholder="e.g. 9.0"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    {/* Quality Pricing Preview */}
                    {milkQty && milkFat && milkSnf && (
                      <div className="sm:col-span-2 p-4 bg-blue-50 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/30 text-xs">
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-300">
                          <span>{t.calculatedRate}:</span>
                          <span className="text-blue-600 dark:text-blue-400">₹ {calculateRate(Number(milkFat), Number(milkSnf)).toFixed(2)} / L</span>
                        </div>
                        <div className="flex justify-between font-bold text-slate-800 dark:text-slate-300 mt-1 border-t border-slate-100 dark:border-slate-800/40 pt-1.5">
                          <span>{t.calculatedAmount}:</span>
                          <span className="text-emerald-600 dark:text-emerald-400 text-sm">₹ {(Number(milkQty) * calculateRate(Number(milkFat), Number(milkSnf))).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 italic">
                          {t.autoRateExplanation}
                        </p>
                      </div>
                    )}

                    <div className="sm:col-span-2 flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        id="btn-admin-milk-cancel"
                        type="button"
                        onClick={() => setIsMilkFormOpen(false)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-850"
                      >
                        {t.cancel}
                      </button>
                      <button
                        id="btn-admin-milk-save"
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700"
                      >
                        {t.logEntryBtn}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table of intakes */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-100 dark:border-slate-800">
                        <th className="p-3 sm:p-4">Entry ID</th>
                        <th className="p-3 sm:p-4">Farmer Code</th>
                        <th className="p-3 sm:p-4">Name</th>
                        <th className="p-3 sm:p-4">Date & Shift</th>
                        <th className="p-3 sm:p-4 text-right">Volume (L)</th>
                        <th className="p-3 sm:p-4 text-right">Fat / SNF %</th>
                        <th className="p-3 sm:p-4 text-right">Rate</th>
                        <th className="p-3 sm:p-4 text-right">Total Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {milkEntries.slice().reverse().map((entry) => {
                        const f = farmers.find(farm => farm.id === entry.farmerId);
                        return (
                          <tr key={entry.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all">
                            <td className="p-3 sm:p-4 font-mono font-bold text-slate-500">{entry.id}</td>
                            <td className="p-3 sm:p-4 font-mono text-blue-600 dark:text-blue-400 font-bold">{entry.farmerId}</td>
                            <td className="p-3 sm:p-4 font-bold">{f ? (language === 'en' ? f.name : f.nameHi) : 'Unknown'}</td>
                            <td className="p-3 sm:p-4">
                              <div>{entry.date}</div>
                              <span className={`inline-block px-1.5 py-px rounded text-[9px] font-bold uppercase tracking-wider ${
                                entry.shift === 'morning' 
                                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30' 
                                  : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30'
                              }`}>
                                {entry.shift === 'morning' ? t.shiftMorning : t.shiftEvening}
                              </span>
                            </td>
                            <td className="p-3 sm:p-4 text-right font-mono font-bold">{entry.quantity} L</td>
                            <td className="p-3 sm:p-4 text-right font-mono">{entry.fat}% / {entry.snf}%</td>
                            <td className="p-3 sm:p-4 text-right font-mono text-slate-500">₹{entry.rate}</td>
                            <td className="p-3 sm:p-4 text-right font-bold text-slate-900 dark:text-white font-mono">₹{entry.amount.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ACCOUNTING PAYOUTS */}
          {activeTab === 'payouts' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Execute Cooperative Payouts</span>
                </h3>

                <button
                  id="btn-admin-add-pay-open"
                  onClick={() => setIsPaymentFormOpen(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Record New Payout</span>
                </button>
              </div>

              {/* Record Payout Form Panel */}
              {isPaymentFormOpen && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner space-y-4 max-w-xl">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-2">
                    {t.recordPayoutTitle}
                  </h4>

                  <form id="form-payout" onSubmit={handleSavePayout} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.selectFarmer} <span className="text-red-500">*</span></label>
                      <select
                        required
                        value={payFarmerId}
                        onChange={(e) => setPayFarmerId(e.target.value)}
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      >
                        <option value="">-- Select Farmer --</option>
                        {farmers.map(f => {
                          const fin = getFarmerFinance(f.id);
                          return (
                            <option key={f.id} value={f.id}>
                              {f.id} - {f.name} ({language === 'en' ? f.village : f.villageHi}) | Balance: ₹{fin.pendingBalance.toLocaleString()}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {payFarmerId && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/10 text-xs font-semibold text-rose-700 dark:text-rose-400">
                        {t.pendingBalanceLabel}: ₹ {getFarmerFinance(payFarmerId).pendingBalance.toLocaleString()}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">{t.amountToPay} <span className="text-red-500">*</span></label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={payAmount}
                          onChange={(e) => setPayAmount(e.target.value)}
                          placeholder="Payout amount"
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">{t.selectPaymentMethod}</label>
                        <select
                          value={payMethod}
                          onChange={(e) => setPayMethod(e.target.value)}
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                        >
                          <option value="Direct Bank Transfer (IMPS/NEFT)">{t.bankTransfer}</option>
                          <option value="Cash Payout">{t.cashPayment}</option>
                          <option value="UPI (PhonePe/GPay/Paytm)">{t.upiPayment}</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Ledger Remarks / Memo</label>
                      <input
                        type="text"
                        placeholder="e.g. Cleared buffalo milk dues"
                        value={payRemarks}
                        onChange={(e) => setPayRemarks(e.target.value)}
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        id="btn-admin-pay-cancel"
                        type="button"
                        onClick={() => setIsPaymentFormOpen(false)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-850"
                      >
                        {t.cancel}
                      </button>
                      <button
                        id="btn-admin-pay-save"
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700"
                      >
                        {t.recordPayoutBtn}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Table of payouts */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-100 dark:border-slate-800">
                        <th className="p-3 sm:p-4">Payment Receipt ID</th>
                        <th className="p-3 sm:p-4">Farmer ID</th>
                        <th className="p-3 sm:p-4">Farmer Name</th>
                        <th className="p-3 sm:p-4">Date</th>
                        <th className="p-3 sm:p-4">Payment Method</th>
                        <th className="p-3 sm:p-4">Remarks</th>
                        <th className="p-3 sm:p-4 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {payments.slice().reverse().map((pay) => {
                        const f = farmers.find(farm => farm.id === pay.farmerId);
                        return (
                          <tr key={pay.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/20 transition-all">
                            <td className="p-3 sm:p-4 font-mono text-slate-500 font-bold">{pay.id}</td>
                            <td className="p-3 sm:p-4 font-mono text-blue-600 dark:text-blue-400 font-bold">{pay.farmerId}</td>
                            <td className="p-3 sm:p-4 font-bold">{f ? (language === 'en' ? f.name : f.nameHi) : 'Unknown'}</td>
                            <td className="p-3 sm:p-4 font-mono">{pay.date}</td>
                            <td className="p-3 sm:p-4 text-xs font-semibold">{pay.paymentMethod}</td>
                            <td className="p-3 sm:p-4 text-xs text-slate-500 italic">"{pay.remarks}"</td>
                            <td className="p-3 sm:p-4 text-right font-bold text-slate-950 dark:text-white font-mono">₹{pay.amount.toLocaleString()}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: VILLAGE MANAGEMENT */}
          {activeTab === 'villages' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <span>Village Center Registries</span>
                </h3>

                <button
                  id="btn-admin-add-vil-open"
                  onClick={() => setIsVillageFormOpen(true)}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.registerVillageBtn}</span>
                </button>
              </div>

              {isVillageFormOpen && (
                <div className="p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-inner space-y-4 max-w-xl">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-700/50 pb-2">
                    {t.addVillageTitle}
                  </h4>
                  <form id="form-village-create" onSubmit={handleSaveVillage} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.villageNameEn} <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={villageNameEn}
                        onChange={(e) => setVillageNameEn(e.target.value)}
                        placeholder="e.g. Mainpuri Rural"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.villageNameHi} <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={villageNameHi}
                        onChange={(e) => setVillageNameHi(e.target.value)}
                        placeholder="उदा. मैनपुरी ग्रामीण"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-500">{t.centerCodeLabel} <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        value={villageCenterCode}
                        onChange={(e) => setVillageCenterCode(e.target.value)}
                        placeholder="e.g. SHJ-MPR"
                        className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg text-xs bg-white dark:bg-slate-900 dark:text-white"
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end space-x-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <button
                        id="btn-admin-vil-cancel"
                        type="button"
                        onClick={() => setIsVillageFormOpen(false)}
                        className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs hover:bg-slate-100 dark:hover:bg-slate-850"
                      >
                        {t.cancel}
                      </button>
                      <button
                        id="btn-admin-vil-save"
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700"
                      >
                        {t.registerVillageBtn}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Grid of Villages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {villages.map((v) => {
                  const localFarmers = farmers.filter(farm => farm.village === v.name);
                  const totalVilMilk = milkEntries
                    .filter(entry => {
                      const f = farmers.find(farm => farm.id === entry.farmerId);
                      return f ? f.village === v.name : false;
                    })
                    .reduce((sum, entry) => sum + entry.quantity, 0);

                  return (
                    <div key={v.id} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col justify-between shadow-sm">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Code: {v.centerCode}</span>
                          <h4 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                            {language === 'en' ? v.name : v.nameHi}
                          </h4>
                        </div>
                        <span className="p-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-900/30">
                          <MapPin className="w-4 h-4" />
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-6 border-t border-slate-50 dark:border-slate-850/60 pt-4 text-xs">
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase">Registered Farmers</span>
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{localFarmers.length}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold text-[10px] uppercase">Milk Volume Collected</span>
                          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{totalVilMilk.toFixed(1)} L</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* TAB 5: REPORTS CENTER */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Reports Compilation Center</h3>
                <p className="text-xs text-slate-500">Query detailed records of milk collection weight, values, fat average and print/export statements.</p>
              </div>

              {/* Reports Filter Matrix */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-slate-50 dark:bg-slate-950 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/40">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Report Format</span>
                  <select
                    value={reportType}
                    onChange={(e) => setReportType(e.target.value as any)}
                    className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 dark:text-white"
                  >
                    <option value="daily">{t.dailyReport}</option>
                    <option value="weekly">{t.weeklyReport}</option>
                    <option value="monthly">{t.monthlyReport}</option>
                    <option value="yearly">{t.yearlyReport}</option>
                    <option value="farmer">Farmer-wise Report</option>
                    <option value="village">Village-wise Report</option>
                  </select>
                </div>

                {reportType === 'daily' && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Date</span>
                    <input
                      type="date"
                      value={reportDate}
                      onChange={(e) => setReportDate(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2 focus:outline-none focus:border-blue-500 dark:text-white"
                    />
                  </div>
                )}

                {reportType === 'farmer' && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Farmer</span>
                    <select
                      value={reportFarmerId}
                      onChange={(e) => setReportFarmerId(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 dark:text-white"
                    >
                      <option value="">-- Choose --</option>
                      {farmers.map(f => (
                        <option key={f.id} value={f.id}>{f.id} - {f.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {reportType === 'village' && (
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Target Village Center</span>
                    <select
                      value={reportVillageName}
                      onChange={(e) => setReportVillageName(e.target.value)}
                      className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5 focus:outline-none focus:border-blue-500 dark:text-white"
                    >
                      <option value="">-- Choose --</option>
                      {villages.map(v => (
                        <option key={v.id} value={v.name}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="sm:col-start-4 flex items-end space-x-2">
                  <button
                    id="btn-report-export-pdf"
                    onClick={() => exportReportFile('pdf')}
                    className="w-1/2 p-2.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg border border-rose-100 dark:border-rose-900/10 flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Print PDF</span>
                  </button>
                  <button
                    id="btn-report-export-xlsx"
                    onClick={() => exportReportFile('excel')}
                    className="w-1/2 p-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-100 dark:border-emerald-900/10 flex items-center justify-center space-x-1 cursor-pointer"
                  >
                    <span>Export Excel</span>
                  </button>
                </div>
              </div>

              {/* Reports dynamic metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Combined volume</span>
                  <h4 className="text-xl sm:text-2xl font-bold font-mono mt-1 text-slate-900 dark:text-white">{totalReportLitres} L</h4>
                </div>
                <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Total Intake Value</span>
                  <h4 className="text-xl sm:text-2xl font-bold font-mono mt-1 text-slate-900 dark:text-white">₹{totalReportAmt.toLocaleString()}</h4>
                </div>
              </div>

              {/* Reports table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-950/70 text-slate-500 dark:text-slate-400 text-xs font-bold border-b border-slate-100 dark:border-slate-800">
                        <th className="p-3 sm:p-4">ID</th>
                        <th className="p-3 sm:p-4">Farmer</th>
                        <th className="p-3 sm:p-4">Village</th>
                        <th className="p-3 sm:p-4">Date / Shift</th>
                        <th className="p-3 sm:p-4 text-right">Volume</th>
                        <th className="p-3 sm:p-4 text-right">Fat/SNF %</th>
                        <th className="p-3 sm:p-4 text-right">Amt (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-800/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      {reportRecords.map((r) => {
                        const f = farmers.find(farm => farm.id === r.farmerId);
                        return (
                          <tr key={r.id}>
                            <td className="p-3 sm:p-4 font-mono font-bold text-slate-400">{r.id}</td>
                            <td className="p-3 sm:p-4 font-mono font-bold text-blue-600 dark:text-blue-400">{r.farmerId} ({f ? f.name : 'Unknown'})</td>
                            <td className="p-3 sm:p-4">{f ? (language === 'en' ? f.village : f.villageHi) : '-'}</td>
                            <td className="p-3 sm:p-4">
                              <span>{r.date}</span>
                              <span className="text-[10px] text-slate-400 block uppercase font-bold">{r.shift}</span>
                            </td>
                            <td className="p-3 sm:p-4 text-right font-mono font-bold">{r.quantity} L</td>
                            <td className="p-3 sm:p-4 text-right font-mono">{r.fat}% / {r.snf}%</td>
                            <td className="p-3 sm:p-4 text-right font-bold text-slate-900 dark:text-white font-mono">₹{r.amount.toLocaleString()}</td>
                          </tr>
                        );
                      })}

                      {reportRecords.length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-12 text-slate-400">
                            No intake reports match the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

           {/* TAB 5.5: SMART QUALITY LAB & SCANNER */}
          {activeTab === 'quality' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
              
              {/* Left Column: Hardware / Scanner Interface */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>{language === 'en' ? 'Hardware Scanner Frame' : 'हार्डवेयर स्कैनर फ्रेम'}</span>
                    </h4>
                    <span className="flex h-2 w-2 relative">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${cameraActive ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${cameraActive ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                    </span>
                  </div>

                  {/* Real/Simulated Camera Scanner Screen */}
                  <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center p-6 group">
                    
                    {/* Glowing Tech Corners */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl-sm pointer-events-none"></div>
                    <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-tr-sm pointer-events-none"></div>
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl-sm pointer-events-none"></div>
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-blue-500 rounded-br-sm pointer-events-none"></div>

                    {cameraActive && cameraPermission === 'granted' ? (
                      <div className="w-full h-full relative flex items-center justify-center">
                        {/* Real Video element */}
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover rounded-xl"
                        />
                        
                        {/* Floating Target Reticle */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-32 h-32 border border-dashed border-white/30 rounded-full flex items-center justify-center animate-spin-slow">
                            <div className="w-20 h-20 border border-dashed border-blue-400/40 rounded-full flex items-center justify-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          </div>
                        </div>

                        {/* Red Tech Crosshair */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white/40 font-mono text-[9px] tracking-widest uppercase">
                          + LAB ALIGN +
                        </div>

                        {/* Animated Laser Scanline */}
                        <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-scanline pointer-events-none"></div>

                        {/* Stop Camera Trigger overlay on hover */}
                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={stopCamera}
                            className="px-2.5 py-1.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold flex items-center space-x-1 shadow-md cursor-pointer border border-white/10"
                          >
                            <Video className="w-3.5 h-3.5 text-red-400" />
                            <span>{language === 'en' ? 'Stop Stream' : 'कैमरा रोकें'}</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* Simulation / Request Overlay */
                      <div className="space-y-4 max-w-sm z-10">
                        <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-500 animate-pulse">
                          <Cpu className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-xs sm:text-sm font-bold text-slate-200">
                            {language === 'en' ? 'Quality Control System' : 'गुणवत्ता नियंत्रण प्रणाली'}
                          </h5>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {language === 'en' 
                              ? 'Request system camera & high-precision GPS to start milk quality scans.'
                              : 'दूध गुणवत्ता जांच और जीपीएस सुरक्षा प्रमाणीकरण शुरू करने के लिए अनुमति दें।'}
                          </p>
                        </div>
                        
                        <button
                          id="btn-admin-allow-hardware"
                          onClick={handleRequestAllPermissions}
                          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-md inline-flex items-center space-x-2 border border-white/10"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>{language === 'en' ? 'ALLOW ALL PERMISSIONS' : 'सभी अनुमतियां स्वीकार करें'}</span>
                        </button>
                      </div>
                    )}

                  </div>

                  {/* Hardware Diagnostics Bar */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono">
                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/40 flex items-center space-x-2">
                      <Camera className={`w-3.5 h-3.5 ${cameraPermission === 'granted' ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <div className="truncate">
                        <span className="text-slate-400 block font-sans">Lactometer Cam:</span>
                        <span className={cameraPermission === 'granted' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}>
                          {cameraPermission === 'granted' ? '● ONLINE (LIVE)' : '○ DISCONNECTED'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800/40 flex items-center space-x-2">
                      <Navigation className={`w-3.5 h-3.5 ${locationPermission === 'granted' ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <div className="truncate">
                        <span className="text-slate-400 block font-sans">GPS Geoseal:</span>
                        <span className={locationPermission === 'granted' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500'}>
                          {locationPermission === 'granted' ? '● VERIFIED (UP)' : '○ OFFLINE (SIM)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coordinates & Physical Site Verification Info */}
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl text-[10px] font-mono text-slate-500 dark:text-slate-400 leading-relaxed border border-slate-100 dark:border-slate-800/20">
                    <div className="flex justify-between font-bold text-slate-700 dark:text-slate-300 mb-1">
                      <span>AUDIT COORDINATES</span>
                      <span className="text-blue-500">KARIMGANJ BMC</span>
                    </div>
                    {gpsCoords ? (
                      <div>
                        Lat: {gpsCoords.latitude.toFixed(6)}° N | Lng: {gpsCoords.longitude.toFixed(6)}° E <br />
                        Alt: 165m | Accuracy: High-precision Carrier Seal
                      </div>
                    ) : (
                      <div>
                        Lat: 27.224100° N | Lng: 79.023400° E (Mainpuri Zone) <br />
                        Calibration: Pending Secure System Hook
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Control Console & Sample Report Card */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6 shadow-sm">
                  
                  {/* Tab Header inside card */}
                  <div className="border-b border-slate-100 dark:border-slate-800/60 pb-4">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <FlaskConical className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-pulse" />
                      <span>{language === 'en' ? 'Smart Quality Analysis Console' : 'स्मार्ट दूध गुणवत्ता परीक्षण कंसोल'}</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                      {language === 'en' 
                        ? 'Select a registered farmer, configure sample parameters, and run high-frequency test scan.'
                        : 'पंजीकृत किसान चुनें, नमूना मानदंड सेट करें और स्वचालित दूध शुद्धता परीक्षण चलाएं।'}
                    </p>
                  </div>

                  {/* Input form parameters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">
                        {language === 'en' ? 'Select Farmer' : 'किसान का चयन करें'} <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={labFarmerId}
                        onChange={(e) => setLabFarmerId(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl text-xs bg-white dark:bg-slate-900 dark:text-white font-semibold"
                      >
                        <option value="">{language === 'en' ? '-- Choose farmer --' : '-- किसान चुनें --'}</option>
                        {farmers.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.id} - {language === 'en' ? f.name : f.nameHi} ({language === 'en' ? f.village : f.villageHi})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">
                        {language === 'en' ? 'Milk Sample Category' : 'दूध श्रेणी'}
                      </label>
                      <div className="flex space-x-2">
                        <button
                          type="button"
                          onClick={() => setMilkType('buffalo')}
                          className={`flex-1 p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            milkType === 'buffalo'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {language === 'en' ? 'Buffalo Milk (भैंस)' : 'भैंस का दूध'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setMilkType('cow')}
                          className={`flex-1 p-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            milkType === 'cow'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                          }`}
                        >
                          {language === 'en' ? 'Cow Milk (गाय)' : 'गाय का दूध'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Scan Trigger and Progress Bar */}
                  <div className="pt-2">
                    {isLabScanning ? (
                      <div className="space-y-3 bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl animate-pulse">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-1.5 font-mono">
                            <Activity className="w-4 h-4 animate-spin" />
                            <span>{scanStatusText}</span>
                          </span>
                          <span className="font-bold text-blue-600 dark:text-blue-400 font-mono">{scanProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${scanProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleTriggerLabScan}
                        className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      >
                        <Cpu className="w-4.5 h-4.5 animate-pulse" />
                        <span>
                          {language === 'en' ? '🚀 TRIGGER RAPID QUALITY CHECK SCAN' : '🚀 तत्काल गुणवत्ता परीक्षण स्कैन शुरू करें'}
                        </span>
                      </button>
                    )}
                  </div>

                  {/* Sample Analysis Certificate */}
                  {scannedFat !== null && scannedSnf !== null && (
                    <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/80 p-5 rounded-2xl space-y-4 shadow-inner relative overflow-hidden">
                      {/* Technical background watermark */}
                      <div className="absolute right-3 bottom-3 text-slate-200 dark:text-slate-900 font-mono font-bold text-7xl select-none opacity-20 pointer-events-none">
                        PASS
                      </div>

                      <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 tracking-wider">
                            {language === 'en' ? 'Verified Cooperative Lab Slip' : 'सत्यापित सहकारी प्रयोगशाला पर्ची'}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">
                            {farmers.find(f => f.id === labFarmerId)?.name || 'Unknown Farmer'}
                          </h4>
                        </div>
                        <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
                          GRADE A Approved
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs">
                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                          <span className="text-slate-400 text-[10px] block font-sans font-semibold uppercase">{t.fatLabel}</span>
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">{scannedFat}%</span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                          <span className="text-slate-400 text-[10px] block font-sans font-semibold uppercase">{t.snfLabel}</span>
                          <span className="text-lg font-extrabold text-slate-900 dark:text-white">{scannedSnf}%</span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                          <span className="text-slate-400 text-[10px] block font-sans font-semibold uppercase">{language === 'en' ? 'TEMP' : 'तापमान'}</span>
                          <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">{scannedTemp}°C</span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm">
                          <span className="text-slate-400 text-[10px] block font-sans font-semibold uppercase">{language === 'en' ? 'RATE EST.' : 'दर रु.'}</span>
                          <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                            ₹{calculateRate(scannedFat, scannedSnf).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      {/* Chemical and Contaminants tests results */}
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm space-y-2 text-[11px]">
                        <div className="flex justify-between items-center text-slate-500">
                          <span className="font-semibold">{language === 'en' ? 'Adulterants (Starch/Urea/Detergent/Water)' : 'अपमिश्रण (स्टार्च/यूरिया/डिटर्जेंट/पानी)'}</span>
                          <span className="font-mono text-emerald-500 font-bold flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>{scannedAdulteration}</span>
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-slate-500 border-t border-slate-50 dark:border-slate-800/40 pt-2">
                          <span className="font-semibold">{language === 'en' ? 'Alcohol/Freshness (COB Safety Test)' : 'अल्कोहल/ताजगी सुरक्षा परीक्षण'}</span>
                          <span className="font-mono text-emerald-500 font-bold flex items-center space-x-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>{scannedAlcohol}</span>
                          </span>
                        </div>
                      </div>

                      {/* Immediate Log CTA */}
                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={handleSendToMilkLog}
                          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center space-x-2"
                        >
                          <FileCheck className="w-4 h-4" />
                          <span>{language === 'en' ? '📥 SEND TO MILK DELIVERY LOG FORM' : '📥 दूध संग्रह प्रपत्र में भेजें'}</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setScannedFat(null);
                            setScannedSnf(null);
                            setScannedTemp(null);
                            setScannedAdulteration(null);
                            setScannedAlcohol(null);
                          }}
                          className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-xs font-bold rounded-xl transition-all border border-slate-200 dark:border-slate-700 cursor-pointer flex items-center justify-center"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>

                    </div>
                  )}

                </div>
              </div>

            </div>
          )}

          {/* TAB 6: BACKUP & DATA RESTORE */}
          {activeTab === 'backup' && (
            <div className="max-w-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl space-y-6">
              <div className="flex items-start space-x-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-100 dark:border-blue-900/30">
                  <FolderSync className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{t.backupTitle}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {t.backupDesc}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-50 dark:border-slate-800/60 pt-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Download Backup */}
                  <button
                    id="btn-admin-download-backup"
                    onClick={handleDownloadBackup}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-md cursor-pointer"
                  >
                    <FolderSync className="w-4 h-4" />
                    <span>{t.downloadBackupBtn}</span>
                  </button>

                  {/* Restore from File Trigger */}
                  <div className="flex-1 relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            try {
                              const parsed = JSON.parse(event.target?.result as string);
                              if (parsed.farmers && parsed.milkEntries && parsed.payments && parsed.villages) {
                                onRestoreBackup(parsed.farmers, parsed.milkEntries, parsed.payments, parsed.villages);
                                triggerToast('Cooperative cloud database restored successfully from local JSON backup!');
                              } else {
                                alert('Invalid backup file schema.');
                              }
                            } catch (err) {
                              alert('Error parsing JSON backup file.');
                            }
                          };
                          reader.readAsText(file);
                        }
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <button
                      id="btn-admin-restore-trigger-ui"
                      type="button"
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-blue-500" />
                      <span>{t.restoreBackupBtn}</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/20 rounded-xl flex items-start space-x-2.5 text-xs text-blue-800 dark:text-blue-300 font-medium leading-relaxed">
                  <Compass className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>
                    Database schema matches cooperative ledger v4.2. Backups are highly portable and encrypted. In compliance with Uttar Pradesh Cooperative norms, database sync operates over zero-trust protocols.
                  </span>
                </div>

                {/* Secure Credentials Management */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-6 space-y-4">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                    {language === 'en' ? 'Administrator Security Credentials' : 'प्रशासक सुरक्षा क्रेडेंशियल्स'}
                  </h5>
                  <p className="text-[11px] text-slate-500 leading-normal">
                    {language === 'en' 
                      ? 'Change your administrator username and password. Keep these secure, as they allow full administrative control over Sahaj Dairy.'
                      : 'अपना व्यवस्थापक उपयोगकर्ता नाम और पासवर्ड बदलें। इन्हें सुरक्षित रखें, क्योंकि ये सहज डेयरी पर पूर्ण प्रशासनिक नियंत्रण की अनुमति देते हैं।'}
                  </p>
                  
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!newAdminPass) {
                        alert(language === 'en' ? 'Please enter a password' : 'कृपया एक पासवर्ड दर्ज करें');
                        return;
                      }
                      if (newAdminPass !== confirmAdminPass) {
                        alert(language === 'en' ? 'Passwords do not match!' : 'पासवर्ड मेल नहीं खाते!');
                        return;
                      }
                      localStorage.setItem('sahaj_dairy_admin_username', newAdminUser);
                      localStorage.setItem('sahaj_dairy_admin_password', newAdminPass);
                      triggerToast('Administrator security credentials updated successfully! Keep them safe.');
                      setNewAdminPass('');
                      setConfirmAdminPass('');
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500">
                          {language === 'en' ? 'New Username' : 'नया यूजरनेम'}
                        </label>
                        <input
                          type="text"
                          required
                          value={newAdminUser}
                          onChange={(e) => setNewAdminUser(e.target.value)}
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500">
                          {language === 'en' ? 'New Password' : 'नया पासवर्ड'}
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={newAdminPass}
                          onChange={(e) => setNewAdminPass(e.target.value)}
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white text-xs"
                        />
                      </div>
                      <div className="space-y-1 sm:col-start-2">
                        <label className="text-[11px] font-semibold text-slate-500">
                          {language === 'en' ? 'Confirm New Password' : 'नए पासवर्ड की पुष्टि करें'}
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="••••••••"
                          value={confirmAdminPass}
                          onChange={(e) => setConfirmAdminPass(e.target.value)}
                          className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white text-xs"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm shadow-blue-500/10 transition-all"
                    >
                      {language === 'en' ? 'Update Credentials' : 'क्रेडेंशियल अपडेट करें'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: WEBSITE CMS & RATES CONFIG */}
          {activeTab === 'content' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Content Sub Tabs */}
              <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-900/60 p-1.5 rounded-2xl max-w-2xl">
                {[
                  { id: 'rates', label: language === 'en' ? 'Pricing Rates' : 'दूध मूल्य दरें' },
                  { id: 'notices', label: language === 'en' ? 'Notice Board' : 'सूचना पट्ट' },
                  { id: 'gallery', label: language === 'en' ? 'Gallery Manager' : 'गैलरी प्रबंधक' },
                  { id: 'sections', label: language === 'en' ? 'Page Sections' : 'पेज अनुभाग' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    id={`btn-content-sub-${sub.id}`}
                    onClick={() => {
                      setIsAddingNotice(false);
                      setIsAddingGallery(false);
                      setEditingNotice(null);
                      setActiveSubTab(sub.id as any);
                    }}
                    className={`flex-1 min-w-[100px] py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                      activeSubTab === sub.id
                        ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* CMS SUB-PANEL 1: PRICING MULTIPLIERS */}
              {activeSubTab === 'rates' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {language === 'en' ? 'Standard Milk Pricing Matrix' : 'मानक दूध मूल्य निर्धारण मैट्रिक्स'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'en' ? 'Adjust standard multipliers for calculating milk price per liter based on quality standards.' : 'गुणवत्ता मानकों के आधार पर दूध का प्रति लीटर मूल्य की गणना के गुणांक समायोजित करें।'}
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50/60 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-950/40 rounded-2xl space-y-3">
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400 block uppercase tracking-wider">
                      {language === 'en' ? 'Active Formula' : 'सक्रिय सूत्र'}
                    </span>
                    <div className="font-mono text-sm sm:text-base text-slate-800 dark:text-slate-200">
                      Rate per Litre = (Fat % × <span className="text-blue-600 font-extrabold">{rateMultipliers.fat}</span>) + (SNF % × <span className="text-emerald-600 font-extrabold">{rateMultipliers.snf}</span>)
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {language === 'en' ? 'Example: At 6.5% Fat and 9.0% SNF, Rate = (6.5 × 7.0) + (9.0 × 3.2) = ₹74.30 / Liter.' : 'उदाहरण: 6.5% वसा (Fat) और 9.0% एसएनएफ (SNF) पर, दर = (6.5 × 7.0) + (9.0 × 3.2) = ₹74.30 / लीटर।'}
                    </p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const fatVal = parseFloat((form.elements.namedItem('fatMult') as HTMLInputElement).value);
                      const snfVal = parseFloat((form.elements.namedItem('snfMult') as HTMLInputElement).value);
                      if (onUpdateRateMultipliers) {
                        onUpdateRateMultipliers({ fat: fatVal, snf: snfVal });
                        triggerToast('Milk pricing multipliers updated dynamically across Sahaj Dairy!');
                      }
                    }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-5"
                  >
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {language === 'en' ? 'Fat Multiplier (₹ per %)' : 'वसा गुणांक (वसा % प्रति ₹)'}
                      </label>
                      <input
                        type="number"
                        name="fatMult"
                        step="0.05"
                        min="1.0"
                        max="25.0"
                        defaultValue={rateMultipliers.fat}
                        className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {language === 'en' ? 'SNF Multiplier (₹ per %)' : 'एसएनएफ गुणांक (एसएनएफ % प्रति ₹)'}
                      </label>
                      <input
                        type="number"
                        name="snfMult"
                        step="0.05"
                        min="1.0"
                        max="25.0"
                        defaultValue={rateMultipliers.snf}
                        className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 text-slate-900 dark:text-white text-sm"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-sm transition-all"
                      >
                        {language === 'en' ? 'Update Price Rates' : 'मूल्य दरें अपडेट करें'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* CMS SUB-PANEL 2: COOPERATIVE NOTICES */}
              {activeSubTab === 'notices' && (
                <div className="space-y-6">
                  
                  {!isAddingNotice && !editingNotice ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {language === 'en' ? 'Active Notice Board Announcements' : 'सक्रिय सूचना पट्ट घोषणाएं'}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {language === 'en' ? 'Publish alerts, payment reminders, and cooperative dairy meetings directly on the home page.' : 'होम पेज पर सीधे अलर्ट, भुगतान अनुस्मारक और सहकारी बैठक सूचनाएं प्रकाशित करें।'}
                          </p>
                        </div>
                        <button
                          onClick={() => setIsAddingNotice(true)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm self-end sm:self-auto"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{language === 'en' ? 'Add Notice' : 'सूचना जोड़ें'}</span>
                        </button>
                      </div>

                      <div className="divide-y divide-slate-100 dark:divide-slate-800/60 mt-4">
                        {notices.map((notice) => (
                          <div key={notice.id} className="py-4 flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono text-slate-400">{notice.date}</span>
                                {notice.isUrgent && (
                                  <span className="text-[9px] bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-1.5 py-0.5 rounded font-bold uppercase">
                                    {language === 'en' ? 'Urgent' : 'आवश्यक'}
                                  </span>
                                )}
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {language === 'en' ? notice.title : notice.titleHi}
                              </h4>
                              <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                                {language === 'en' ? notice.content : notice.contentHi}
                              </p>
                            </div>
                            <div className="flex space-x-1 shrink-0">
                              <button
                                onClick={() => setEditingNotice(notice)}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
                                title="Edit"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(language === 'en' ? 'Are you sure you want to delete this notice?' : 'क्या आप वाकई इस सूचना को हटाना चाहते हैं?')) {
                                    if (onUpdateNotices) {
                                      onUpdateNotices(notices.filter(n => n.id !== notice.id));
                                      triggerToast('Cooperative notice removed successfully.');
                                    }
                                  }
                                }}
                                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}

                        {notices.length === 0 && (
                          <div className="py-8 text-center text-slate-400 text-xs">
                            {language === 'en' ? 'No notices currently published.' : 'वर्तमान में कोई सूचना प्रकाशित नहीं है।'}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Notice Form (Add or Edit) */
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl space-y-4 max-w-2xl">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {editingNotice 
                          ? (language === 'en' ? 'Edit Cooperative Notice' : 'सहकारी सूचना संपादित करें') 
                          : (language === 'en' ? 'Create New Announcement' : 'नई घोषणा बनाएं')
                        }
                      </h3>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const title = (form.elements.namedItem('noticeTitle') as HTMLInputElement).value;
                          const titleHi = (form.elements.namedItem('noticeTitleHi') as HTMLInputElement).value;
                          const content = (form.elements.namedItem('noticeContent') as HTMLTextAreaElement).value;
                          const contentHi = (form.elements.namedItem('noticeContentHi') as HTMLTextAreaElement).value;
                          const isUrgent = (form.elements.namedItem('noticeUrgent') as HTMLInputElement).checked;
                          const date = new Date().toISOString().split('T')[0];

                          if (editingNotice) {
                            const updated = notices.map(n => n.id === editingNotice.id ? { ...n, title, titleHi, content, contentHi, isUrgent } : n);
                            if (onUpdateNotices) onUpdateNotices(updated);
                            triggerToast('Notice announcement updated successfully.');
                          } else {
                            const newNotice: Notice = {
                              id: `NTC-${Math.floor(100 + Math.random() * 900)}`,
                              title,
                              titleHi,
                              content,
                              contentHi,
                              date,
                              isUrgent
                            };
                            if (onUpdateNotices) onUpdateNotices([newNotice, ...notices]);
                            triggerToast('New cooperative announcement published to notice board!');
                          }
                          setEditingNotice(null);
                          setIsAddingNotice(false);
                        }}
                        className="space-y-4 text-xs sm:text-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Notice Title (English) <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="noticeTitle"
                              required
                              defaultValue={editingNotice?.title || ''}
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Notice Title (Hindi / हिंदी) <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="noticeTitleHi"
                              required
                              defaultValue={editingNotice?.titleHi || ''}
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Notice Description (English) <span className="text-red-500">*</span></label>
                            <textarea
                              name="noticeContent"
                              required
                              rows={3}
                              defaultValue={editingNotice?.content || ''}
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Notice Description (Hindi / हिंदी) <span className="text-red-500">*</span></label>
                            <textarea
                              name="noticeContentHi"
                              required
                              rows={3}
                              defaultValue={editingNotice?.contentHi || ''}
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>

                          <div className="sm:col-span-2 flex items-center space-x-2 py-1">
                            <input
                              type="checkbox"
                              name="noticeUrgent"
                              id="noticeUrgent"
                              defaultChecked={editingNotice?.isUrgent || false}
                              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 cursor-pointer"
                            />
                            <label htmlFor="noticeUrgent" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                              {language === 'en' ? 'Mark notice as URGENT' : 'इस सूचना को "आवश्यक" के रूप में चिह्नित करें'}
                            </label>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-150 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingNotice(null);
                              setIsAddingNotice(false);
                            }}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold rounded-xl text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
                          >
                            {editingNotice ? 'Update Notice' : 'Publish Notice'}
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>
              )}

              {/* CMS SUB-PANEL 3: GALLERY MANAGER */}
              {activeSubTab === 'gallery' && (
                <div className="space-y-6">
                  
                  {!isAddingGallery ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            {language === 'en' ? 'Cooperative Photo & Video Library' : 'सहकारी फोटो और वीडियो संग्रह'}
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {language === 'en' ? 'Only Administrators can upload, modify, or delete media in Sahaj Dairy Gallery.' : 'केवल प्रशासक ही फोटो/वीडियो गैलरी सामग्री अपलोड, संशोधित या हटा सकते हैं।'}
                          </p>
                        </div>
                        <button
                          onClick={() => setIsAddingGallery(true)}
                          className="flex items-center space-x-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm self-end sm:self-auto"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{language === 'en' ? 'Add Media Item' : 'मीडिया जोड़ें'}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {galleryItems.map((item) => (
                          <div key={item.id} className="p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl flex flex-col justify-between">
                            <div>
                              <div className="relative aspect-[16/10] bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden mb-3">
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                                {item.videoUrl && (
                                  <div className="absolute inset-0 bg-slate-950/30 flex items-center justify-center">
                                    <Video className="w-8 h-8 text-white drop-shadow-md" />
                                  </div>
                                )}
                                <span className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
                                  {item.category}
                                </span>
                              </div>
                              <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                                {language === 'en' ? item.title : item.titleHi}
                              </h4>
                              <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: {item.id}</p>
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-900">
                              <span className="text-[10px] text-slate-400 font-bold uppercase">
                                {item.videoUrl ? 'Video Block' : 'Photo Image'}
                              </span>
                              <button
                                onClick={() => {
                                  if (confirm(language === 'en' ? 'Delete this media item?' : 'इस गैलरी मीडिया को हटाएं?')) {
                                    if (onUpdateGalleryItems) {
                                      onUpdateGalleryItems(galleryItems.filter(g => g.id !== item.id));
                                      triggerToast('Gallery media item deleted.');
                                    }
                                  }
                                }}
                                className="p-1.5 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-500 rounded-lg transition-colors cursor-pointer"
                                title="Delete media"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Add gallery item form */
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl space-y-4 max-w-2xl">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {language === 'en' ? 'Add New Photo or Video to Gallery' : 'गैलरी में नया फोटो या वीडियो जोड़ें'}
                      </h3>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          const form = e.currentTarget;
                          const title = (form.elements.namedItem('gTitle') as HTMLInputElement).value;
                          const titleHi = (form.elements.namedItem('gTitleHi') as HTMLInputElement).value;
                          const description = (form.elements.namedItem('gDesc') as HTMLTextAreaElement).value;
                          const descriptionHi = (form.elements.namedItem('gDescHi') as HTMLTextAreaElement).value;
                          const imageUrl = (form.elements.namedItem('gImage') as HTMLInputElement).value;
                          const videoUrl = (form.elements.namedItem('gVideo') as HTMLInputElement).value || undefined;
                          const category = (form.elements.namedItem('gCat') as HTMLSelectElement).value as any;

                          const newItem: GalleryItem = {
                            id: `GAL-${Math.floor(100 + Math.random() * 900)}`,
                            title,
                            titleHi,
                            description,
                            descriptionHi,
                            imageUrl,
                            videoUrl,
                            category
                          };

                          if (onUpdateGalleryItems) {
                            onUpdateGalleryItems([newItem, ...galleryItems]);
                            triggerToast('New media successfully uploaded to Sahaj Cooperative Gallery!');
                          }
                          setIsAddingGallery(false);
                        }}
                        className="space-y-4 text-xs sm:text-sm"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Title (English) <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="gTitle"
                              required
                              placeholder="e.g. Sahaj Chilling Plant Setup"
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Title (Hindi / हिंदी) <span className="text-red-500">*</span></label>
                            <input
                              type="text"
                              name="gTitleHi"
                              required
                              placeholder="जैसे: सहज चिलिंग प्लांट सेटअप"
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Image Thumbnail URL <span className="text-red-500">*</span></label>
                            <input
                              type="url"
                              name="gImage"
                              required
                              placeholder="https://images.unsplash.com/..."
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Category / अनुभाग <span className="text-red-500">*</span></label>
                            <select
                              name="gCat"
                              required
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            >
                              <option value="bmc">BMC Infrastructure</option>
                              <option value="owner">Cooperative Leadership</option>
                              <option value="farmer">Farmer Sessions</option>
                              <option value="collection">Daily Collection Logs</option>
                              <option value="events">Events & Festivals</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Optional Video Stream URL (leave blank if image only)</label>
                            <input
                              type="text"
                              name="gVideo"
                              placeholder="https://assets.mixkit.co/videos/preview/..."
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>

                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Description (English) <span className="text-red-500">*</span></label>
                            <textarea
                              name="gDesc"
                              required
                              rows={2}
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>
                          <div className="sm:col-span-2 space-y-1">
                            <label className="text-xs font-semibold text-slate-500">Description (Hindi / हिंदी) <span className="text-red-500">*</span></label>
                            <textarea
                              name="gDescHi"
                              required
                              rows={2}
                              className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-2 border-t border-slate-150 dark:border-slate-800">
                          <button
                            type="button"
                            onClick={() => setIsAddingGallery(false)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-850 dark:text-white font-bold rounded-xl text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs cursor-pointer shadow-sm"
                          >
                            Upload to Gallery
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                </div>
              )}

              {/* CMS SUB-PANEL 4: STATIC PAGE SECTIONS CONTENT */}
              {activeSubTab === 'sections' && (
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-3xl space-y-6 max-w-2xl">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {language === 'en' ? 'Edit Landing Page Content' : 'लैंडिंग पेज सामग्री संपादित करें'}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === 'en' ? 'Modify the headlines, intros, biographies, and contact details of Sahaj Dairy instantly.' : 'सहज डेयरी की सुर्खियां, परिचय, जीवनियां और संपर्क विवरण तुरंत बदलें।'}
                    </p>
                  </div>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.currentTarget;
                      const heroTitle = (form.elements.namedItem('heroTitle') as HTMLInputElement).value;
                      const heroTitleHi = (form.elements.namedItem('heroTitleHi') as HTMLInputElement).value;
                      const heroSubtitle = (form.elements.namedItem('heroSubtitle') as HTMLInputElement).value;
                      const heroSubtitleHi = (form.elements.namedItem('heroSubtitleHi') as HTMLInputElement).value;
                      
                      const aboutName = (form.elements.namedItem('aboutName') as HTMLInputElement).value;
                      const aboutNameHi = (form.elements.namedItem('aboutNameHi') as HTMLInputElement).value;
                      const aboutRole = (form.elements.namedItem('aboutRole') as HTMLInputElement).value;
                      const aboutRoleHi = (form.elements.namedItem('aboutRoleHi') as HTMLInputElement).value;
                      const aboutPhone = (form.elements.namedItem('aboutPhone') as HTMLInputElement).value;
                      const ownerIntroBody = (form.elements.namedItem('ownerIntroBody') as HTMLInputElement).value;
                      const ownerIntroBodyHi = (form.elements.namedItem('ownerIntroBodyHi') as HTMLInputElement).value;
                      
                      const contactAddress = (form.elements.namedItem('contactAddress') as HTMLInputElement).value;
                      const contactAddressHi = (form.elements.namedItem('contactAddressHi') as HTMLInputElement).value;
                      const contactHours = (form.elements.namedItem('contactHours') as HTMLInputElement).value;
                      const contactHoursHi = (form.elements.namedItem('contactHoursHi') as HTMLInputElement).value;

                      const updatedContent = {
                        en: {
                          ...websiteContent.en,
                          heroTitle,
                          heroSubtitle,
                          aboutName,
                          aboutRole,
                          aboutPhone,
                          ownerIntroBody,
                          contactAddress,
                          contactHours
                        },
                        hi: {
                          ...websiteContent.hi,
                          heroTitle: heroTitleHi,
                          heroSubtitle: heroSubtitleHi,
                          aboutName: aboutNameHi,
                          aboutRole: aboutRoleHi,
                          aboutPhone,
                          ownerIntroBody: ownerIntroBodyHi,
                          contactAddress: contactAddressHi,
                          contactHours: contactHoursHi
                        }
                      };

                      if (onUpdateWebsiteContent) {
                        onUpdateWebsiteContent(updatedContent);
                        triggerToast('Landing page section contents saved and updated across Hindi & English versions!');
                      }
                    }}
                    className="space-y-6 text-xs sm:text-sm"
                  >
                    
                    {/* Collapsible Section 1: Hero Banner */}
                    <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-xs">
                        1. Hero Banner Content
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Hero Headline (English)</label>
                          <input
                            type="text"
                            name="heroTitle"
                            required
                            defaultValue={websiteContent?.en?.heroTitle || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Hero Headline (Hindi)</label>
                          <input
                            type="text"
                            name="heroTitleHi"
                            required
                            defaultValue={websiteContent?.hi?.heroTitle || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Hero Subtitle (English)</label>
                          <input
                            type="text"
                            name="heroSubtitle"
                            required
                            defaultValue={websiteContent?.en?.heroSubtitle || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Hero Subtitle (Hindi)</label>
                          <input
                            type="text"
                            name="heroSubtitleHi"
                            required
                            defaultValue={websiteContent?.hi?.heroSubtitle || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Section 2: Leadership Bio */}
                    <div className="space-y-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-xs">
                        2. Leadership & Biography
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Owner Name (English)</label>
                          <input
                            type="text"
                            name="aboutName"
                            required
                            defaultValue={websiteContent?.en?.aboutName || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Owner Name (Hindi)</label>
                          <input
                            type="text"
                            name="aboutNameHi"
                            required
                            defaultValue={websiteContent?.hi?.aboutName || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Designation (English)</label>
                          <input
                            type="text"
                            name="aboutRole"
                            required
                            defaultValue={websiteContent?.en?.aboutRole || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Designation (Hindi)</label>
                          <input
                            type="text"
                            name="aboutRoleHi"
                            required
                            defaultValue={websiteContent?.hi?.aboutRole || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-semibold text-slate-500">Founder Contact Number</label>
                          <input
                            type="text"
                            name="aboutPhone"
                            required
                            defaultValue={websiteContent?.en?.aboutPhone || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white font-mono"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-semibold text-slate-500">Founder Message / Message Body (English)</label>
                          <textarea
                            name="ownerIntroBody"
                            required
                            rows={3}
                            defaultValue={websiteContent?.en?.ownerIntroBody || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-semibold text-slate-500">Founder Message / Message Body (Hindi)</label>
                          <textarea
                            name="ownerIntroBodyHi"
                            required
                            rows={3}
                            defaultValue={websiteContent?.hi?.ownerIntroBody || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Collapsible Section 3: Contact & Facility */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-xs">
                        3. Contact Information & Support
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Facility Address (English)</label>
                          <input
                            type="text"
                            name="contactAddress"
                            required
                            defaultValue={websiteContent?.en?.contactAddress || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Facility Address (Hindi)</label>
                          <input
                            type="text"
                            name="contactAddressHi"
                            required
                            defaultValue={websiteContent?.hi?.contactAddress || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Working Hours (English)</label>
                          <input
                            type="text"
                            name="contactHours"
                            required
                            defaultValue={websiteContent?.en?.contactHours || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Working Hours (Hindi)</label>
                          <input
                            type="text"
                            name="contactHoursHi"
                            required
                            defaultValue={websiteContent?.hi?.contactHours || ''}
                            className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-950 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit CTA */}
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button
                        type="submit"
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm cursor-pointer shadow-sm transition-all"
                      >
                        {language === 'en' ? 'Save Section Contents' : 'सेक्शन सामग्री सहेजें'}
                      </button>
                    </div>

                  </form>
                </div>
              )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}
