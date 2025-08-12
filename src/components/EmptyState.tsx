import React from 'react';
import { BookOpen, Users, Zap, MessageCircle } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-8">
          <MessageCircle className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Your Smart
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"> AI Tutor</span>
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Learn anything, anytime with personalized AI-powered tutoring tailored to your grade level
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Adaptive Learning</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Content tailored to your grade level
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">All Grade Levels</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              From Grade 1 to College level
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Instant Responses</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Get immediate explanations
            </p>
          </div>
        </div>

        <p className="text-gray-500 dark:text-gray-400">
          Start by asking a question below 👇
        </p>
      </div>
    </div>
  );
};

export default EmptyState;