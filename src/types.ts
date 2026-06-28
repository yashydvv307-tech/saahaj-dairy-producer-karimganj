/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = 'en' | 'hi';
export type Theme = 'light' | 'dark';
export type AppView = 'home' | 'analytics' | 'farmer-portal' | 'admin-portal' | 'gallery' | 'contact' | 'developer';

export interface Farmer {
  id: string; // e.g. "SHJ-101"
  name: string;
  nameHi: string;
  mobile: string;
  village: string;
  villageHi: string;
  createdAt: string;
  qrCodeUrl: string;
}

export interface MilkEntry {
  id: string;
  farmerId: string;
  date: string; // YYYY-MM-DD
  shift: 'morning' | 'evening';
  quantity: number; // Litres
  fat: number; // % (e.g., 6.5)
  snf: number; // % (e.g., 9.0)
  rate: number; // ₹ per litre
  amount: number; // ₹ total (rate * quantity)
  createdAt: string;
}

export interface Payment {
  id: string;
  farmerId: string;
  date: string; // YYYY-MM-DD
  amount: number; // ₹
  status: 'paid' | 'pending';
  paymentMethod: string;
  remarks: string;
}

export interface Village {
  id: string;
  name: string;
  nameHi: string;
  centerCode: string;
}

export interface Testimonial {
  id: string;
  name: string;
  nameHi: string;
  role: string;
  roleHi: string;
  village: string;
  villageHi: string;
  quote: string;
  quoteHi: string;
  avatarUrl: string;
}

export interface GalleryItem {
  id: string;
  category: 'owner' | 'bmc' | 'farmer' | 'collection' | 'events';
  title: string;
  titleHi: string;
  imageUrl: string;
  videoUrl?: string; // Optional URL for video support
  description: string;
  descriptionHi: string;
}

export interface Notice {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  titleHi: string;
  content: string;
  contentHi: string;
  isUrgent?: boolean;
}

export interface NotificationMsg {
  id: string;
  title: string;
  titleHi: string;
  message: string;
  messageHi: string;
  timestamp: string;
  isRead: boolean;
  type: 'info' | 'success' | 'alert';
}
