import React, { useState, useRef, useEffect } from 'react';
import { Message as MessageType, GradeLevel } from '../types';
import Message from './Message';
import Header from './Header';
import ChatInput from './ChatInput';
import EmptyState from './EmptyState';
import ChatHistorySidebar from './ChatHistorySidebar';
import { useTheme } from '../hooks/useTheme';
import { useChatHistory } from '../hooks/useChatHistory';

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

const ChatInterface: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
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
    toggleSidebar
  } = useChatHistory();
  
  const [inputValue, setInputValue] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('grade-6');
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get current session messages
  const currentSession = getCurrentSession();
  const messages = currentSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const simulateAIResponse = async (userMessage: string, gradeLevel: string): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const gradeLabel = GRADE_LEVELS.find(g => g.value === gradeLevel)?.label || 'Grade 6';
    
    // Simulate different responses based on grade level
    const responses = {
      'grade-1': `Great question! Let me explain this in a simple way for ${gradeLabel}. `,
      'grade-2': `Nice question! Here's how I can help you understand this for ${gradeLabel}. `,
      'grade-3': `Good thinking! Let me break this down for ${gradeLabel} level. `,
      'college': `Excellent question! Here's a comprehensive explanation suitable for college level. `,
      'custom': `Let me provide a detailed explanation tailored to your learning level. `,
    };

    const prefix = responses[gradeLevel as keyof typeof responses] || responses['grade-6'];
    
    return `${prefix}Based on your question about "${userMessage}", I can help you understand this concept better. This is a simulated AI response that would normally come from an AI API like OpenAI. The response would be tailored to the ${gradeLabel} level and provide educational content appropriate for that learning stage.`;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Create new session if none exists
    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = createNewSession();
    }

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      gradeLevel: GRADE_LEVELS.find(g => g.value === selectedGrade)?.label,
    };

    const updatedMessages = [...messages, userMessage];
    updateSessionMessages(sessionId, updatedMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      // In a real application, this would be an actual API call:
      // const response = await fetch('/api/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: inputValue, gradeLevel: selectedGrade })
      // });
      // const data = await response.json();
      
      const aiResponseContent = await simulateAIResponse(inputValue, selectedGrade);
      
      const aiMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: aiResponseContent,
        sender: 'ai',
        timestamp: new Date(),
      };

      const finalMessages = [...updatedMessages, aiMessage];
      updateSessionMessages(sessionId, finalMessages);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        sender: 'ai',
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      updateSessionMessages(sessionId, finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (currentSessionId) {
      updateSessionMessages(currentSessionId, []);
    }
    setInputValue('');
  };

  const handleNewSession = () => {
    createNewSession();
    setInputValue('');
  };

  const handleSessionSelect = (sessionId: string) => {
    setCurrentSessionId(sessionId);
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
        selectedGrade={selectedGrade}
        setSelectedGrade={setSelectedGrade}
        onReset={handleReset}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
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