import React, { useState, useRef, useEffect } from 'react';
import { Message as MessageType, AnswerMode } from '../types';
import Message from './Message';
import Header from './Header';
import ChatInput from './ChatInput';
import EmptyState from './EmptyState';
import ChatHistorySidebar from './ChatHistorySidebar';
import { useTheme } from '../hooks/useTheme';
import { useChatHistory } from '../hooks/useChatHistory';

// Removed grade levels

const ChatInterface: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [mode, setMode] = useState<AnswerMode>('intermediate');
  const {
    sessions,
    currentSessionId,
    isSidebarOpen,
    createNewSession,
    deleteSession,
    renameSession,
    updateSessionMessages,
    getCurrentSession,
    setCurrentSessionId,
    toggleSidebar,
  } = useChatHistory();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Sync current session messages into local state when session changes
  useEffect(() => {
    const session = getCurrentSession();
    setMessages(session?.messages || []);
  }, [currentSessionId]);

  // Keep session storage updated when local messages change
  useEffect(() => {
    if (!currentSessionId) return;
    updateSessionMessages(currentSessionId, messages);
  }, [messages]);

  // Remove Markdown formatting and bullets for a clean UI display
  const sanitizeAnswer = (text: string): string => {
    let out = text;
    // Bold/italic markers
    out = out.replace(/\*\*(.*?)\*\*/g, '$1');
    out = out.replace(/__(.*?)__/g, '$1');
    out = out.replace(/\*(.*?)\*/g, '$1');
    // Heading markers (#, ##, ### ...)
    out = out.replace(/^\s*#{1,6}\s+/gm, '');
    // Horizontal rules (--- or ___)
    out = out.replace(/^\s*[-_]{3,}\s*$/gm, '');
    // Bulleted lists (-, –, —, •)
    out = out.replace(/^[\t ]*[\-–—•]\s+/gm, '');
    // Ordered lists (1. 2) 3:)
    out = out.replace(/^\s*\d+[)\.:]\s+/gm, '');
    // Collapse extra blank lines
    out = out.replace(/\n{3,}/g, '\n\n').trim();
    return out;
  };

  // Call backend API and strip any <think>...</think> blocks, return only the answer text
  const fetchAIAnswer = async (question: string): Promise<{ cleaned: string; raw: any }> => {
    const API_BASE = 'http://185.136.234.250:5001';
    const url = `${API_BASE}/ask`;
    const maxAttempts = 3;

    let lastError: any = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question,
            mode: 'enhanced',
            student_level: mode === 'easy' ? 0.4 : mode === 'intermediate' ? 0.6 : 1,
            max_concepts: 5,
          }),
          signal: controller.signal,
        });

        let data: any = null;
        try {
          data = await response.json();
          console.log(data);
        } catch (parseError) {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          throw new Error('Invalid JSON response from AI service');
        }

        if (!response.ok) {
          const serverMsg = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
          throw new Error(serverMsg);
        }

        if (data?.success === false) {
          const aiError = data?.error || data?.message || 'AI returned an error';
          throw new Error(aiError);
        }

        const rawAnswer: string = data?.response?.answer ?? '';
        if (!rawAnswer) {
          throw new Error('Empty answer from AI');
        }

        const withoutThink = rawAnswer.replace(/<think>[\s\S]*?<\/think>\n?/g, '').trim();
        const cleaned = sanitizeAnswer(withoutThink);
        if (!cleaned) {
          throw new Error('Empty answer after sanitization');
        }
        clearTimeout(timeoutId);
        return { cleaned, raw: data };
      } catch (error: any) {
        clearTimeout(timeoutId);
        lastError = error;
        const msg = (error?.message || '').toLowerCase();
        const isConnRefused = msg.includes('failed to fetch') || msg.includes('err_connection_refused') || msg.includes('network error') || msg.includes('abort');
        if (attempt < maxAttempts && isConnRefused) {
          const backoffMs = 500 * attempt;
          await new Promise(r => setTimeout(r, backoffMs));
          continue;
        }
        // Re-throw on last attempt or non-retryable error
        throw new Error(isConnRefused ? 'Service unavailable (connection refused). Please try again shortly.' : (error?.message || 'Unknown error'));
      }
    }
    throw lastError || new Error('Unknown error');
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Ensure a session exists for history view (frontend-only)
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createNewSession();
      setCurrentSessionId(sessionId);
    }

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const { cleaned: aiResponseContent, raw: aiRaw } = await fetchAIAnswer(inputValue);
      
      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date(),
        isError: false,
        aiResponse: aiRaw,
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const aiErrorDetail: MessageType = {
        id: (Date.now() + 1).toString(),
        content: (error?.message || 'Unknown error from AI').toString(),
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };
      const aiErrorNotice: MessageType = {
        id: (Date.now() + 2).toString(),
        content: 'Failed to load the query.',
        sender: 'ai',
        timestamp: new Date(),
        isError: true,
      };
      const finalMessages = [...updatedMessages, aiErrorDetail, aiErrorNotice];
      setMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setInputValue('');
  };

  const handleNewSession = () => {
    const newId = createNewSession();
    setCurrentSessionId(newId);
    setMessages([]);
    setInputValue('');
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    const session = sessions.find(s => s.id === sessionId);
    setMessages(session?.messages || []);
    setInputValue('');
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <ChatHistorySidebar
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSessionSelect={handleSessionSelect}
        onNewSession={handleNewSession}
        onDeleteSession={deleteSession}
        onRenameSession={renameSession}
        isDark={isDark}
      />
      
      <div className={`flex flex-col flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-60' : 'ml-15'
      }`}>
      <Header
        isDark={isDark}
        toggleTheme={toggleTheme}
        onReset={handleReset}
        mode={mode}
        setMode={setMode}
      />

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 && (
            <EmptyState />
          )}
          
          {messages.length > 0 && (
            <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <Message 
                  message={{
                    id: 'loading',
                    content: '',
                    sender: 'ai',
                    timestamp: new Date()
                  }}
                  isLoading={true}
                />
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
          </div>
        
      </div>
  );
};

export default ChatInterface;