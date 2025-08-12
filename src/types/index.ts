export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  gradeLevel?: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  selectedGrade: string;
}

export type GradeLevel = {
  value: string;
  label: string;
};

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
}</parameter>