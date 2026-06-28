/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Language, GalleryItem } from '../types';
import { translations } from '../translations';
import { GALLERY_ITEMS } from '../data/initialData';
import { motion, AnimatePresence } from 'motion/react';
import { Grid, Eye, Play, X, Film } from 'lucide-react';

interface GallerySectionProps {
  language: Language;
  galleryItems?: GalleryItem[];
}

type FilterCategory = 'all' | 'owner' | 'bmc' | 'farmer' | 'collection' | 'events';

export default function GallerySection({ language, galleryItems }: GallerySectionProps) {
  const t = translations[language];
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = [
    { value: 'all', label: t.allPhotos },
    { value: 'owner', label: t.catOwner },
    { value: 'bmc', label: t.catBmc },
    { value: 'farmer', label: t.catFarmer },
    { value: 'collection', label: t.catCollection },
    { value: 'events', label: t.catEvents }
  ];

  const items = galleryItems || GALLERY_ITEMS;

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter(item => item.category === activeCategory);

  return (
    <section id="gallery-page" className="py-12 md:py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-sm font-bold text-blue-600 dark:text-blue-400 tracking-wider uppercase flex items-center justify-center space-x-1.5">
            <Grid className="w-4 h-4" />
            <span>{t.gallery}</span>
          </h2>
          <p className="text-3xl font-sans font-bold text-slate-900 dark:text-white tracking-tight">
            {language === 'en' ? 'Explore Sahaj Dairy Photo Gallery' : 'सहज डेयरी फोटो गैलरी का अन्वेषण करें'}
          </p>
          <div className="w-12 h-1 bg-blue-600 dark:bg-blue-400 mx-auto rounded-full"></div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              id={`btn-gallery-cat-${cat.value}`}
              onClick={() => setActiveCategory(cat.value as FilterCategory)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 cursor-pointer ${
                activeCategory === cat.value
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Gallery Items Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pt-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item: GalleryItem) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-xl transition-all flex flex-col h-full cursor-pointer"
              >
                {/* Image/Video Area */}
                <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-slate-950">
                  <img
                    src={item.imageUrl}
                    alt={language === 'en' ? item.title : item.titleHi}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Play Overlay if video */}
                  {item.videoUrl ? (
                    <div className="absolute inset-0 bg-slate-950/25 flex items-center justify-center transition-all group-hover:bg-slate-950/40">
                      <div className="p-4 bg-white/90 dark:bg-slate-900/90 text-blue-600 dark:text-blue-400 rounded-full shadow-lg scale-100 group-hover:scale-110 transition-transform">
                        <Play className="w-6 h-6 fill-current pl-0.5" />
                      </div>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <span className="bg-white/90 dark:bg-slate-900/90 text-slate-850 dark:text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 shadow-md">
                        <Eye className="w-3.5 h-3.5" />
                        <span>{language === 'en' ? 'View Photo' : 'फोटो देखें'}</span>
                      </span>
                    </div>
                  )}

                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 bg-blue-600/95 dark:bg-blue-500/95 text-white px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase shadow-sm flex items-center space-x-1">
                    {item.videoUrl && <Film className="w-3 h-3" />}
                    <span>{categories.find(c => c.value === item.category)?.label || item.category}</span>
                  </div>
                </div>

                {/* Content Details Area */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {language === 'en' ? item.title : item.titleHi}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                      {language === 'en' ? item.description : item.descriptionHi}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-4 border-t border-slate-50 dark:border-slate-800/60 pt-3">
                    <span>ID: {item.id}</span>
                    {item.videoUrl && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase">
                        {language === 'en' ? 'VIDEO' : 'वीडियो'}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            {language === 'en' ? 'No items available in this section.' : 'इस अनुभाग में कोई फोटो उपलब्ध नहीं है।'}
          </div>
        )}

      </div>

      {/* Lightbox Modal Dialog (Photos + Videos Playback) */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {categories.find(c => c.value === selectedItem.category)?.label || selectedItem.category}
                  </span>
                  {selectedItem.videoUrl && (
                    <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                      {language === 'en' ? 'VIDEO' : 'वीडियो'}
                    </span>
                  )}
                </div>
                <button
                  id="btn-lightbox-close"
                  onClick={() => setSelectedItem(null)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-all text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Media Content Body */}
              <div className="bg-slate-950 aspect-video flex items-center justify-center relative">
                {selectedItem.videoUrl ? (
                  /* Video Player */
                  <video
                    src={selectedItem.videoUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full max-h-[60vh] object-contain"
                  />
                ) : (
                  /* Photo display */
                  <img
                    src={selectedItem.imageUrl}
                    alt={language === 'en' ? selectedItem.title : selectedItem.titleHi}
                    className="w-full h-full max-h-[60vh] object-contain"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Title & Description footer */}
              <div className="p-6 space-y-2 bg-white dark:bg-slate-900">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {language === 'en' ? selectedItem.title : selectedItem.titleHi}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {language === 'en' ? selectedItem.description : selectedItem.descriptionHi}
                </p>
                <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-50 dark:border-slate-800 mt-4 flex justify-between">
                  <span>ID: {selectedItem.id}</span>
                  {selectedItem.videoUrl && (
                    <span className="font-bold text-slate-500">{language === 'en' ? 'Source: Local Cooperative Archive' : 'स्रोत: स्थानीय सहकारी संग्रह'}</span>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
