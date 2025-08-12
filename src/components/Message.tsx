import React from 'react';
import { Message as MessageType } from '../types';
import { User, Bot } from 'lucide-react';
import LoadingDots from './LoadingDots';

interface MessageProps {
  message: MessageType;
  isLoading?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in`}>
      <div className={`flex max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2`}>
        <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-blue-500 text-white' 
              : 'bg-gradient-to-br from-purple-500 to-blue-600 text-white'
          }`}>
            {isUser ? <User size={16} /> : <Bot size={16} />}
          </div>
        </div>
        <div className={`rounded-2xl px-4 py-3 max-w-full shadow-sm ${
          isUser 
            ? 'bg-blue-500 text-white rounded-br-md' 
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-bl-md'
        }`}>
          {isLoading ? (
            <LoadingDots />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
          {message.gradeLevel && (
            <div className={`text-xs mt-2 opacity-75 ${isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
              Grade Level: {message.gradeLevel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;