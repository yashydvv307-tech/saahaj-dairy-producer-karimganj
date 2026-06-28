/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Theme } from '../types';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  theme: Theme;
  onThemeToggle: () => void;
}

export default function ThemeToggle({ theme, onThemeToggle }: ThemeToggleProps) {
  return (
    <button
      id="btn-theme-toggle"
      onClick={onThemeToggle}
      className="p-2 rounded-full bg-blue-50/80 dark:bg-slate-800/80 border border-blue-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 backdrop-blur-sm shadow-sm transition-all focus:outline-none"
      title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
    >
      {theme === 'light' ? (
        <Moon className="w-4 h-4 text-blue-600" />
      ) : (
        <Sun className="w-4 h-4 text-yellow-400" />
      )}
    </button>
  );
}
