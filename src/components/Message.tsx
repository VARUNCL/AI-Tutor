import React, { useState } from 'react';
import { Message as MessageType } from '../types';
import { User, Bot } from 'lucide-react';
import LoadingDots from './LoadingDots';

interface MessageProps {
  message: MessageType;
  isLoading?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isLoading = false }) => {
  const isUser = message.sender === 'user';
  const [rating, setRating] = useState<string>('');
  const [comments, setComments] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmitFeedback = async () => {
    if (!rating && !comments) {
      setSubmitted(true); // allow skip
      return;
    }
    setIsSubmitting(true);
    try {
      await fetch('http://185.136.234.250:5001/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: (message.aiResponse as any)?.response?.question || (message.aiResponse as any)?.question || '',
          response: (message.aiResponse as any)?.response ?? message.aiResponse ?? null,
          rating: rating ? Number(rating) : undefined,
          comment: comments || undefined,
        }),
      });
      setSubmitted(true);
    } catch (e) {
      setSubmitted(true); // silently accept
    } finally {
      setIsSubmitting(false);
    }
  };

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
            : `bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border ${
                message.isError ? 'border-red-300 dark:border-red-700' : 'border-gray-200 dark:border-gray-700'
              } rounded-bl-md`
        }`}>
          {isLoading ? (
            <LoadingDots />
          ) : (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
          )}
          {!isUser && !isLoading && !message.isError && !submitted && (
            <div className="mt-3 border-t pt-3 border-gray-200 dark:border-gray-700">
              <div className="text-xs text-gray-600 dark:text-gray-300 mb-2">Share feedback</div>
              <div className="flex items-center space-x-2 mb-2">
                <label className="text-xs text-gray-600 dark:text-gray-300">⭐ Rate (1-5):</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmitFeedback();
                  }}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder="3"
                />
              </div>
              <div className="mb-2">
                <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">💬 Any comments? (optional)</label>
                <input
                  type="text"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmitFeedback();
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  placeholder=""
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmitting}
                  className="px-3 py-1.5 text-sm rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white transition-colors"
                >
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;