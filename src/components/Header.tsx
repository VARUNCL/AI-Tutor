import React from 'react';
import { Moon, Sun, RotateCcw, Brain } from 'lucide-react';
import { AnswerMode } from '../types';

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  onReset: () => void;
  mode: AnswerMode;
  setMode: (m: AnswerMode) => void;
}

const Header: React.FC<HeaderProps> = ({
  isDark,
  toggleTheme,
  onReset,
  mode,
  setMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-4xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AI Tutor</h1>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-2">
            {/* Mode Selector */}
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as AnswerMode)}
              className="px-2 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors duration-200 text-sm text-gray-800 dark:text-gray-200"
              title="Answer mode"
            >
              <option value="easy">Easy</option>
              <option value="intermediate">Intermediate</option>
              <option value="advance">Advance</option>
            </select>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              title="Reset conversation"
            >
              <RotateCcw size={16} className="text-gray-600 dark:text-gray-400" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
              title="Toggle theme"
            >
              {isDark ? (
                <Sun size={16} className="text-yellow-500" />
              ) : (
                <Moon size={16} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;