import React, { useState } from 'react';
import { 
  Menu, 
  X, 
  MessageCircle, 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2,
  Book
} from 'lucide-react';
import { ChatSession } from '../types';

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSessionSelect: (sessionId: string) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  isDark: boolean;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  onRenameSession,
  isDark,
}) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleRename = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditTitle(currentTitle);
    setActiveDropdown(null);
  };

  const handleSaveRename = (sessionId: string) => {
    if (editTitle.trim()) {
      onRenameSession(sessionId, editTitle.trim());
    }
    setEditingSessionId(null);
    setEditTitle('');
  };

  const handleCancelRename = () => {
    setEditingSessionId(null);
    setEditTitle('');
  };

  const truncateTitle = (title: string, maxLength: number = 25) => {
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'w-60' : 'w-15'}
        ${isDark 
          ? 'bg-gradient-to-b from-slate-900 to-slate-800' 
          : 'bg-gradient-to-b from-gray-50 to-gray-200'
        }
        shadow-xl border-r ${isDark ? 'border-slate-700' : 'border-gray-300'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-300 dark:border-slate-700">
          <button
            onClick={onToggle}
            className={`
              p-2 rounded-lg transition-colors duration-200
              ${isDark 
                ? 'hover:bg-slate-700 text-gray-300 hover:text-white' 
                : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'
              }
            `}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {isOpen && (
            <button
              onClick={onNewSession}
              className={`
                p-2 rounded-lg transition-colors duration-200
                ${isDark 
                  ? 'hover:bg-slate-700 text-gray-300 hover:text-white' 
                  : 'hover:bg-gray-300 text-gray-600 hover:text-gray-900'
                }
              `}
              title="New Chat"
            >
              <Plus size={20} />
            </button>
          )}
        </div>

        {/* Chat Sessions List */}
        <div className="flex-1 overflow-y-auto p-2">
          {isOpen ? (
            <div className="space-y-1">
              {sessions.length === 0 ? (
                <div className="text-center py-8">
                  <MessageCircle className={`w-8 h-8 mx-auto mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    No chat history yet
                  </p>
                </div>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`
                      group relative rounded-lg transition-all duration-200 cursor-pointer
                      ${currentSessionId === session.id
                        ? isDark 
                          ? 'bg-blue-900/30 border border-blue-700' 
                          : 'bg-blue-50 border border-blue-200'
                        : isDark
                          ? 'hover:bg-slate-700/50'
                          : 'hover:bg-sky-50'
                      }
                    `}
                    onClick={() => onSessionSelect(session.id)}
                  >
                    <div className="flex items-center p-3">
                      <div className={`
                        w-8 h-8 rounded-lg flex items-center justify-center mr-3 flex-shrink-0
                        ${isDark ? 'bg-slate-600' : 'bg-gray-200'}
                      `}>
                        <Book size={16} className={isDark ? 'text-gray-300' : 'text-gray-600'} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        {editingSessionId === session.id ? (
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onBlur={() => handleSaveRename(session.id)}
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') handleSaveRename(session.id);
                              if (e.key === 'Escape') handleCancelRename();
                            }}
                            className={`
                              w-full px-2 py-1 text-sm rounded border
                              ${isDark 
                                ? 'bg-slate-800 border-slate-600 text-white' 
                                : 'bg-white border-gray-300 text-gray-900'
                              }
                              focus:outline-none focus:ring-2 focus:ring-blue-500
                            `}
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                          />
                        ) : (
                          <>
                            <h3 className={`
                              text-sm font-medium truncate
                              ${isDark ? 'text-gray-200' : 'text-gray-900'}
                            `}>
                              {truncateTitle(session.title)}
                            </h3>
                            <p className={`
                              text-xs truncate mt-1
                              ${isDark ? 'text-gray-400' : 'text-gray-500'}
                            `}>
                              {formatTimestamp(session.timestamp)}
                            </p>
                          </>
                        )}
                      </div>

                      {editingSessionId !== session.id && (
                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdown(activeDropdown === session.id ? null : session.id);
                            }}
                            className={`
                              opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-200
                              ${isDark 
                                ? 'hover:bg-slate-600 text-gray-400 hover:text-gray-200' 
                                : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                              }
                            `}
                          >
                            <MoreVertical size={14} />
                          </button>

                          {activeDropdown === session.id && (
                            <div className={`
                              absolute right-0 top-8 w-32 rounded-lg shadow-lg border z-10
                              ${isDark 
                                ? 'bg-slate-800 border-slate-600' 
                                : 'bg-white border-gray-200'
                              }
                            `}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRename(session.id, session.title);
                                }}
                                className={`
                                  w-full flex items-center px-3 py-2 text-sm rounded-t-lg transition-colors duration-200
                                  ${isDark 
                                    ? 'hover:bg-slate-700 text-gray-300' 
                                    : 'hover:bg-gray-100 text-gray-700'
                                  }
                                `}
                              >
                                <Edit2 size={14} className="mr-2" />
                                Rename
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteSession(session.id);
                                  setActiveDropdown(null);
                                }}
                                className={`
                                  w-full flex items-center px-3 py-2 text-sm rounded-b-lg transition-colors duration-200
                                  ${isDark 
                                    ? 'hover:bg-red-900/50 text-red-400' 
                                    : 'hover:bg-red-50 text-red-600'
                                  }
                                `}
                              >
                                <Trash2 size={14} className="mr-2" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            // Collapsed view - show only icons
            <div className="space-y-2">
              {sessions.slice(0, 8).map((session) => (
                <button
                  key={session.id}
                  onClick={() => onSessionSelect(session.id)}
                  className={`
                    w-11 h-11 rounded-lg flex items-center justify-center transition-colors duration-200
                    ${currentSessionId === session.id
                      ? isDark 
                        ? 'bg-blue-900/50 text-blue-400' 
                        : 'bg-blue-100 text-blue-600'
                      : isDark
                        ? 'hover:bg-slate-700 text-gray-400 hover:text-gray-200'
                        : 'hover:bg-gray-300 text-gray-500 hover:text-gray-700'
                    }
                  `}
                  title={session.title}
                >
                  <Book size={18} />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-5"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </>
  );
};

export default ChatHistorySidebar;