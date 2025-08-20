export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  isError?: boolean;
  aiResponse?: unknown;
}

export type AnswerMode = 'easy' | 'intermediate' | 'advance';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}

// Removed grade level types and state

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messages: Message[];
}

export interface SidebarState {
  isOpen: boolean;
  sessions: ChatSession[];
  currentSessionId: string | null;
}