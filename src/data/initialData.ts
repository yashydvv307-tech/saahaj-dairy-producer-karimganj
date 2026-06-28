/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Farmer, MilkEntry, Payment, Village, GalleryItem, Testimonial } from '../types';
import ownerPhoto from '../assets/images/bmc_owner_photo_1782622300140.jpg';

export const INITIAL_VILLAGES: Village[] = [
  { id: 'VIL-01', name: 'Karimganj', nameHi: 'करीमगंज', centerCode: 'SHJ-KMG' },
  { id: 'VIL-02', name: 'Kuraoli', nameHi: 'कुरावली', centerCode: 'SHJ-KRL' },
  { id: 'VIL-03', name: 'Ghiror', nameHi: 'घिरोर', centerCode: 'SHJ-GHR' },
  { id: 'VIL-04', name: 'Bhongaon', nameHi: 'भोंगांव', centerCode: 'SHJ-BHN' },
  { id: 'VIL-05', name: 'Kishni', nameHi: 'किशनी', centerCode: 'SHJ-KSN' },
];

export const INITIAL_FARMERS: Farmer[] = [
  {
    id: 'SHJ-101',
    name: 'Suresh Kumar',
    nameHi: 'सुरेश कुमार',
    mobile: '9876543210',
    village: 'Karimganj',
    villageHi: 'करीमगंज',
    createdAt: '2026-01-10',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SHJ-101',
  },
  {
    id: 'SHJ-102',
    name: 'Ram Naresh Yadav',
    nameHi: 'राम नरेश यादव',
    mobile: '9568761213', // Matches owner mobile or test farmer mobile
    village: 'Karimganj',
    villageHi: 'करीमगंज',
    createdAt: '2026-01-12',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SHJ-102',
  },
  {
    id: 'SHJ-103',
    name: 'Harish Chandra',
    nameHi: 'हरीश चंद्र',
    mobile: '9988776655',
    village: 'Kuraoli',
    villageHi: 'कुरावली',
    createdAt: '2026-01-15',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SHJ-103',
  },
  {
    id: 'SHJ-104',
    name: 'Rajender Prasad Singh',
    nameHi: 'राजेंद्र प्रसाद सिंह',
    mobile: '9412345678',
    village: 'Ghiror',
    villageHi: 'घिरोर',
    createdAt: '2026-02-01',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SHJ-104',
  },
  {
    id: 'SHJ-105',
    name: 'Dinesh Shakya',
    nameHi: 'दिनेश शाक्य',
    mobile: '9123456789',
    village: 'Bhongaon',
    villageHi: 'भोंगांव',
    createdAt: '2026-02-10',
    qrCodeUrl: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SHJ-105',
  }
];

// Standard Dairy Rate Matrix: Rate = (Fat * 7.0) + (SNF * 3.2)
export function calculateMilkRate(fat: number, snf: number): number {
  const rate = (fat * 7.0) + (snf * 3.2);
  return Math.round(rate * 100) / 100;
}

export const INITIAL_MILK_ENTRIES: MilkEntry[] = [
  // Farmer 101 - Suresh Kumar
  {
    id: 'ENT-001',
    farmerId: 'SHJ-101',
    date: '2026-06-25',
    shift: 'morning',
    quantity: 12.5,
    fat: 6.8,
    snf: 9.1,
    rate: calculateMilkRate(6.8, 9.1),
    amount: Math.round(12.5 * calculateMilkRate(6.8, 9.1) * 100) / 100,
    createdAt: '2026-06-25T07:30:00',
  },
  {
    id: 'ENT-002',
    farmerId: 'SHJ-101',
    date: '2026-06-25',
    shift: 'evening',
    quantity: 11.8,
    fat: 6.9,
    snf: 9.0,
    rate: calculateMilkRate(6.9, 9.0),
    amount: Math.round(11.8 * calculateMilkRate(6.9, 9.0) * 100) / 100,
    createdAt: '2026-06-25T18:45:00',
  },
  {
    id: 'ENT-003',
    farmerId: 'SHJ-101',
    date: '2026-06-26',
    shift: 'morning',
    quantity: 13.0,
    fat: 6.6,
    snf: 9.2,
    rate: calculateMilkRate(6.6, 9.2),
    amount: Math.round(13.0 * calculateMilkRate(6.6, 9.2) * 100) / 100,
    createdAt: '2026-06-26T07:15:00',
  },
  {
    id: 'ENT-004',
    farmerId: 'SHJ-101',
    date: '2026-06-26',
    shift: 'evening',
    quantity: 12.2,
    fat: 6.7,
    snf: 9.1,
    rate: calculateMilkRate(6.7, 9.1),
    amount: Math.round(12.2 * calculateMilkRate(6.7, 9.1) * 100) / 100,
    createdAt: '2026-06-26T18:30:00',
  },
  {
    id: 'ENT-005',
    farmerId: 'SHJ-101',
    date: '2026-06-27',
    shift: 'morning',
    quantity: 14.2,
    fat: 6.5,
    snf: 8.9,
    rate: calculateMilkRate(6.5, 8.9),
    amount: Math.round(14.2 * calculateMilkRate(6.5, 8.9) * 100) / 100,
    createdAt: '2026-06-27T07:22:00',
  },
  {
    id: 'ENT-006',
    farmerId: 'SHJ-101',
    date: '2026-06-27',
    shift: 'evening',
    quantity: 13.8,
    fat: 6.8,
    snf: 9.0,
    rate: calculateMilkRate(6.8, 9.0),
    amount: Math.round(13.8 * calculateMilkRate(6.8, 9.0) * 100) / 100,
    createdAt: '2026-06-27T18:25:00',
  },

  // Farmer 102 - Ram Naresh Yadav
  {
    id: 'ENT-007',
    farmerId: 'SHJ-102',
    date: '2026-06-25',
    shift: 'morning',
    quantity: 8.5,
    fat: 4.2,
    snf: 8.6,
    rate: calculateMilkRate(4.2, 8.6),
    amount: Math.round(8.5 * calculateMilkRate(4.2, 8.6) * 100) / 100,
    createdAt: '2026-06-25T07:45:00',
  },
  {
    id: 'ENT-008',
    farmerId: 'SHJ-102',
    date: '2026-06-25',
    shift: 'evening',
    quantity: 8.0,
    fat: 4.5,
    snf: 8.7,
    rate: calculateMilkRate(4.5, 8.7),
    amount: Math.round(8.0 * calculateMilkRate(4.5, 8.7) * 100) / 100,
    createdAt: '2026-06-25T19:00:00',
  },
  {
    id: 'ENT-009',
    farmerId: 'SHJ-102',
    date: '2026-06-26',
    shift: 'morning',
    quantity: 9.2,
    fat: 4.3,
    snf: 8.5,
    rate: calculateMilkRate(4.3, 8.5),
    amount: Math.round(9.2 * calculateMilkRate(4.3, 8.5) * 100) / 100,
    createdAt: '2026-06-26T07:40:00',
  },
  {
    id: 'ENT-010',
    farmerId: 'SHJ-102',
    date: '2026-06-26',
    shift: 'evening',
    quantity: 8.8,
    fat: 4.4,
    snf: 8.6,
    rate: calculateMilkRate(4.4, 8.6),
    amount: Math.round(8.8 * calculateMilkRate(4.4, 8.6) * 100) / 100,
    createdAt: '2026-06-26T18:50:00',
  },
  {
    id: 'ENT-011',
    farmerId: 'SHJ-102',
    date: '2026-06-27',
    shift: 'morning',
    quantity: 10.0,
    fat: 4.1,
    snf: 8.5,
    rate: calculateMilkRate(4.1, 8.5),
    amount: Math.round(10.0 * calculateMilkRate(4.1, 8.5) * 100) / 100,
    createdAt: '2026-06-27T07:50:00',
  },

  // Farmer 103 - Harish Chandra
  {
    id: 'ENT-012',
    farmerId: 'SHJ-103',
    date: '2026-06-25',
    shift: 'morning',
    quantity: 22.0,
    fat: 7.2,
    snf: 9.3,
    rate: calculateMilkRate(7.2, 9.3),
    amount: Math.round(22.0 * calculateMilkRate(7.2, 9.3) * 100) / 100,
    createdAt: '2026-06-25T07:10:00',
  },
  {
    id: 'ENT-013',
    farmerId: 'SHJ-103',
    date: '2026-06-26',
    shift: 'morning',
    quantity: 21.5,
    fat: 7.0,
    snf: 9.2,
    rate: calculateMilkRate(7.0, 9.2),
    amount: Math.round(21.5 * calculateMilkRate(7.0, 9.2) * 100) / 100,
    createdAt: '2026-06-26T07:05:00',
  },
  {
    id: 'ENT-014',
    farmerId: 'SHJ-103',
    date: '2026-06-27',
    shift: 'morning',
    quantity: 23.5,
    fat: 7.1,
    snf: 9.3,
    rate: calculateMilkRate(7.1, 9.3),
    amount: Math.round(23.5 * calculateMilkRate(7.1, 9.3) * 100) / 100,
    createdAt: '2026-06-27T07:10:00',
  },

  // Farmer 104 - Rajender Prasad Singh
  {
    id: 'ENT-015',
    farmerId: 'SHJ-104',
    date: '2026-06-25',
    shift: 'evening',
    quantity: 15.0,
    fat: 5.5,
    snf: 8.8,
    rate: calculateMilkRate(5.5, 8.8),
    amount: Math.round(15.0 * calculateMilkRate(5.5, 8.8) * 100) / 100,
    createdAt: '2026-06-25T18:15:00',
  },
  {
    id: 'ENT-016',
    farmerId: 'SHJ-104',
    date: '2026-06-26',
    shift: 'evening',
    quantity: 15.5,
    fat: 5.4,
    snf: 8.9,
    rate: calculateMilkRate(5.4, 8.9),
    amount: Math.round(15.5 * calculateMilkRate(5.4, 8.9) * 100) / 100,
    createdAt: '2026-06-26T18:20:00',
  },

  // Farmer 105 - Dinesh Shakya
  {
    id: 'ENT-017',
    farmerId: 'SHJ-105',
    date: '2026-06-26',
    shift: 'morning',
    quantity: 18.0,
    fat: 6.2,
    snf: 9.0,
    rate: calculateMilkRate(6.2, 9.0),
    amount: Math.round(18.0 * calculateMilkRate(6.2, 9.0) * 100) / 100,
    createdAt: '2026-06-26T07:35:00',
  },
  {
    id: 'ENT-018',
    farmerId: 'SHJ-105',
    date: '2026-06-27',
    shift: 'morning',
    quantity: 17.5,
    fat: 6.3,
    snf: 9.0,
    rate: calculateMilkRate(6.3, 9.0),
    amount: Math.round(17.5 * calculateMilkRate(6.3, 9.0) * 100) / 100,
    createdAt: '2026-06-27T07:42:00',
  }
];

export const INITIAL_PAYMENTS: Payment[] = [
  {
    id: 'PAY-201',
    farmerId: 'SHJ-101',
    date: '2026-06-20',
    amount: 3500,
    status: 'paid',
    paymentMethod: 'Direct Bank Transfer (IMPS/NEFT)',
    remarks: 'Clearance of milk supplies from June 10 - June 19',
  },
  {
    id: 'PAY-202',
    farmerId: 'SHJ-102',
    date: '2026-06-20',
    amount: 1800,
    status: 'paid',
    paymentMethod: 'Cash Payout',
    remarks: 'Clearance of cow milk supplies from June 10 - June 19',
  },
  {
    id: 'PAY-203',
    farmerId: 'SHJ-103',
    date: '2026-06-21',
    amount: 5000,
    status: 'paid',
    paymentMethod: 'UPI (PhonePe/GPay/Paytm)',
    remarks: 'Advance payout for high buffalo fat supply',
  },
  {
    id: 'PAY-204',
    farmerId: 'SHJ-101',
    date: '2026-06-26',
    amount: 1500,
    status: 'paid',
    paymentMethod: 'Direct Bank Transfer (IMPS/NEFT)',
    remarks: 'Partial ledger payout',
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'TST-01',
    name: 'Suresh Kumar Yadav',
    nameHi: 'सुरेश कुमार यादव',
    role: 'Progressive Dairy Farmer',
    roleHi: 'उन्नत दुग्ध उत्पादक',
    village: 'Karimganj',
    villageHi: 'करीमगंज',
    quote: "Sahaj Dairy's computerised weighing and instant fat calculation changed my life. Earlier we had to wait for hours and rates were non-transparent. Now, we get exact printouts!",
    quoteHi: 'सहज डेयरी के कम्प्यूटरीकृत कांटे और त्वरित फैट मशीन ने हमारा काम आसान कर दिया। पहले गैर-पारदर्शी तरीके से काम होता था। अब हमें तुरंत रसीद और पूरा दाम मिलता है।',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'TST-02',
    name: 'Rajesh Shakya',
    nameHi: 'राजेश शाक्य',
    role: 'Cooperative Member',
    roleHi: 'सहकारी सदस्य',
    village: 'Kuraoli',
    villageHi: 'कुरावली',
    quote: "Yogendra Singh ji's initiative of starting the BMC in Karimganj has saved us from milk spoiling during summer. Payouts are highly regular.",
    quoteHi: 'योगेंद्र सिंह जी द्वारा करीमगंज में बीएमसी की शुरुआत करने से गर्मियों में हमारा दूध खराब होने से बच जाता है। हमारा भुगतान भी हमेशा समय पर होता है।',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80',
  },
  {
    id: 'TST-03',
    name: 'Mahendra Singh',
    nameHi: 'महिपाल सिंह',
    role: 'Cattle Breeder',
    roleHi: 'पशुपालक',
    village: 'Ghiror',
    villageHi: 'घिरोर',
    quote: "The ability to check my weekly records on my mobile using this portal is extremely helpful. I can download PDF statements anytime.",
    quoteHi: 'मोबाइल पर अपना साप्ताहिक दुग्ध रिकॉर्ड देखने की सुविधा बेहद उपयोगी है। मैं जब चाहूं अपनी मासिक रिपोर्ट का पीडीएफ डाउनलोड कर सकता हूं।',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80',
  },
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'GAL-01',
    category: 'owner',
    title: 'Mr. Yogendra Singh at Plant Opening',
    titleHi: 'प्लांट उद्घाटन पर श्री योगेंद्र सिंह',
    imageUrl: ownerPhoto, // Office/Owner visual
    description: 'Founder Mr. Yogendra Singh overseeing bulk chiller integrations.',
    descriptionHi: 'संस्थापक श्री योगेंद्र सिंह बल्क चिलर एकीकरण की देखरेख करते हुए।'
  },
  {
    id: 'GAL-02',
    category: 'bmc',
    title: 'Bulk Milk Cooling Unit (2000L)',
    titleHi: 'बल्क मिल्क कूलिंग यूनिट (2000 लीटर)',
    imageUrl: 'https://images.unsplash.com/photo-1508736932470-34431e72e9a5?auto=format&fit=crop&w=800&h=600&q=80', // Chiller/Storage/Pipes
    description: 'Rapid cooling systems chilling fresh milk instantly to 4°C.',
    descriptionHi: 'ताजा दूध को तुरंत 4 डिग्री सेल्सियस तक ठंडा करने वाला रैपिड कूलिंग सिस्टम।'
  },
  {
    id: 'GAL-03',
    category: 'farmer',
    title: 'Cattle Welfare Meeting in Karimganj',
    titleHi: 'करीमगंज में पशु कल्याण बैठक',
    imageUrl: 'https://images.unsplash.com/photo-1595079676339-1534801ad6cf?auto=format&fit=crop&w=800&h=600&q=80', // Rural Indian gathering / meeting
    description: 'Farmers gathering for veterinary consulting workshops.',
    descriptionHi: 'पशु चिकित्सा सलाहकार कार्यशालाओं के लिए एकत्रित किसान।'
  },
  {
    id: 'GAL-04',
    category: 'collection',
    title: 'Digital Testing & Weighing Station',
    titleHi: 'डिजिटल परीक्षण और वजन स्टेशन',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&h=600&q=80', // Milk quality analysis/Tech
    description: 'State of the art milk analyser and weight records screen.',
    descriptionHi: 'अत्याधुनिक दूध विश्लेषक और वजन रिकॉर्ड स्क्रीन।'
  },
  {
    id: 'GAL-05',
    category: 'events',
    title: 'Annual Farmer Excellence Awards',
    titleHi: 'वार्षिक किसान उत्कृष्टता पुरस्कार',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&h=600&q=80', // Celebration/Meeting
    description: 'Honoring highest quality milk producers of the cooperative.',
    descriptionHi: 'सहकारी समिति के उच्चतम गुणवत्ता वाले दुग्ध उत्पादकों को सम्मानित करना।'
  },
  {
    id: 'GAL-06',
    category: 'farmer',
    title: 'Healthy Cows in Karimganj Fields',
    titleHi: 'करीमगंज के खेतों में स्वस्थ गायें',
    imageUrl: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&h=600&q=80', // Dairy cow
    description: 'Supporting high-grade dairy genetics for better SNF and Fat.',
    descriptionHi: 'बेहतर एसएनएफ और फैट के लिए उच्च गुणवत्ता वाले पशु अनुवंशिकी का समर्थन।'
  },
  {
    id: 'GAL-07',
    category: 'collection',
    title: 'Morning Milk Delivery Collection',
    titleHi: 'सुबह की दूध आपूर्ति संकलन',
    imageUrl: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=800&h=600&q=80', // Fresh farm milk cans
    description: 'Hygienic steel milk cans waiting for computerized analyzer entry.',
    descriptionHi: 'कम्प्यूटरीकृत विश्लेषक प्रविष्टि की प्रतीक्षा में स्वच्छ स्टील के दूध के डिब्बे।'
  }
];
