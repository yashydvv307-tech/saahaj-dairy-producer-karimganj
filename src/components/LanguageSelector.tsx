/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Language } from '../types';
import { Languages } from 'lucide-react';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center space-x-1 sm:space-x-2 bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200/50 dark:border-slate-700/50 px-2 sm:px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm transition-all">
      <Languages className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      <button
        id="btn-lang-en"
        onClick={() => onLanguageChange('en')}
        className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
          currentLanguage === 'en'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        EN
      </button>
      <button
        id="btn-lang-hi"
        onClick={() => onLanguageChange('hi')}
        className={`px-2 py-0.5 rounded-full text-xs font-semibold transition-all ${
          currentLanguage === 'hi'
            ? 'bg-blue-600 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
        }`}
      >
        हिंदी
      </button>
    </div>
  );
}
