import { useState, useEffect } from 'react';
import { ChatSession, Message } from '../types';

export const useChatHistory = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const savedSessions = localStorage.getItem('chatSessions');
    const savedCurrentSession = localStorage.getItem('currentSessionId');
    const savedSidebarState = localStorage.getItem('sidebarOpen');

    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        timestamp: new Date(session.timestamp),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setSessions(parsedSessions);
    }

    if (savedCurrentSession) {
      setCurrentSessionId(savedCurrentSession);
    }

    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  }, [sessions]);

  // Save current session ID
  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem('currentSessionId', currentSessionId);
    }
  }, [currentSessionId]);

  // Save sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(isSidebarOpen));
  }, [isSidebarOpen]);

  const createNewSession = (): string => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      lastMessage: '',
      timestamp: new Date(),
      messages: []
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  const deleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
    
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      setCurrentSessionId(remainingSessions.length > 0 ? remainingSessions[0].id : null);
    }
  };

  const renameSession = (sessionId: string, newTitle: string) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, title: newTitle }
        : session
    ));
  };

  const updateSessionMessages = (sessionId: string, messages: Message[]) => {
    setSessions(prev => {
      const index = prev.findIndex(s => s.id === sessionId);
      if (index === -1) {
        // If the session does not exist yet (race condition), create it now
        const newSession: ChatSession = {
          id: sessionId,
          title: messages.length > 0
            ? messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? '...' : '')
            : 'New Chat',
          lastMessage: messages.length > 0 ? messages[messages.length - 1].content : '',
          timestamp: new Date(),
          messages,
        };
        return [newSession, ...prev];
      }

      return prev.map(session => 
        session.id === sessionId 
          ? { 
              ...session, 
              messages,
              lastMessage: messages.length > 0 ? messages[messages.length - 1].content : '',
              timestamp: new Date(),
              title: session.title === 'New Chat' && messages.length > 0 
                ? messages[0].content.substring(0, 30) + (messages[0].content.length > 30 ? '...' : '')
                : session.title
            }
          : session
      );
    });
  };

  const getCurrentSession = (): ChatSession | null => {
    return sessions.find(session => session.id === currentSessionId) || null;
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return {
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
  };
};