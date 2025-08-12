import React from 'react';
import { Moon, Sun, RotateCcw, ChevronDown, Brain } from 'lucide-react';
import { GradeLevel } from '../types';

const GRADE_LEVELS: GradeLevel[] = [
  { value: 'grade-1', label: 'Grade 1' },
  { value: 'grade-2', label: 'Grade 2' },
  { value: 'grade-3', label: 'Grade 3' },
  { value: 'grade-4', label: 'Grade 4' },
  { value: 'grade-5', label: 'Grade 5' },
  { value: 'grade-6', label: 'Grade 6' },
  { value: 'grade-7', label: 'Grade 7' },
  { value: 'grade-8', label: 'Grade 8' },
  { value: 'grade-9', label: 'Grade 9' },
  { value: 'grade-10', label: 'Grade 10' },
  { value: 'grade-11', label: 'Grade 11' },
  { value: 'grade-12', label: 'Grade 12' },
  { value: 'college', label: 'College' },
  { value: 'custom', label: 'Custom' },
];

interface HeaderProps {
  isDark: boolean;
  toggleTheme: () => void;
  selectedGrade: string;
  setSelectedGrade: (grade: string) => void;
  onReset: () => void;
  isDropdownOpen: boolean;
  setIsDropdownOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  isDark,
  toggleTheme,
  selectedGrade,
  setSelectedGrade,
  onReset,
  isDropdownOpen,
  setIsDropdownOpen,
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
            {/* Grade Level Selector */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex items-center space-x-2 transition-colors duration-200 text-sm"
              >
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {GRADE_LEVELS.find(g => g.value === selectedGrade)?.label}
                </span>
                <ChevronDown size={14} className={`transform transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-1 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-48 overflow-y-auto">
                  {GRADE_LEVELS.map((grade) => (
                    <button
                      key={grade.value}
                      onClick={() => {
                        setSelectedGrade(grade.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150 ${
                        selectedGrade === grade.value 
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                          : 'text-gray-900 dark:text-gray-100'
                      }`}
                    >
                      {grade.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

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