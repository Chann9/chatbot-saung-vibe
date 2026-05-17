// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'USER' | 'ADMIN';
  chatLimit: number;
  totalChats: number;
  totalMessages: number;
  createdAt: string;
  updatedAt: string;
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    refreshToken: string;
  };
  error?: string;
}

// Chat Types
export interface Conversation {
  id: number;
  userId: number;
  title: string;
  messageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  conversationId: number;
  sender: 'user' | 'ai';
  content: string;
  createdAt: string;
}

export interface CreateConversationRequest {
  title: string;
}

export interface SendMessageRequest {
  message: string;
}

export interface SendMessageResponse {
  success: boolean;
  data?: {
    userMessage: Message;
    aiMessage: Message;
  };
  error?: string;
}

// Admin Types
export interface UserStats {
  id: number;
  username: string;
  email: string;
  chatLimit: number;
  totalChats: number;
  totalMessages: number;
  createdAt: string;
}

export interface SystemStatistics {
  totalUsers: number;
  totalConversations: number;
  totalMessages: number;
  activeUsers: number;
  averageChatsPerUser: number;
  averageMessagesPerChat: number;
}

// Auth Context Types
export interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'REGISTER_START' }
  | { type: 'REGISTER_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'RESTORE_SESSION'; payload: { user: User; token: string } };

// Chat Context Types
export interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
}

export interface ChatState {
  conversations: Conversation[];
  currentConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  error: string | null;
}

export type ChatAction =
  | { type: 'FETCH_CONVERSATIONS_START' }
  | { type: 'FETCH_CONVERSATIONS_SUCCESS'; payload: Conversation[] }
  | { type: 'FETCH_CONVERSATIONS_FAILURE'; payload: string }
  | { type: 'SELECT_CONVERSATION'; payload: Conversation }
  | { type: 'FETCH_MESSAGES_START' }
  | { type: 'FETCH_MESSAGES_SUCCESS'; payload: Message[] }
  | { type: 'FETCH_MESSAGES_FAILURE'; payload: string }
  | { type: 'CREATE_CONVERSATION_START' }
  | { type: 'CREATE_CONVERSATION_SUCCESS'; payload: Conversation }
  | { type: 'CREATE_CONVERSATION_FAILURE'; payload: string }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_TYPING'; payload: boolean }
  | { type: 'UPDATE_CONVERSATION'; payload: Conversation }
  | { type: 'DELETE_CONVERSATION'; payload: number }
  | { type: 'CLEAR_ERROR' };

// Admin Context Types
export interface AdminContextType {
  state: AdminState;
  dispatch: React.Dispatch<AdminAction>;
}

export interface AdminState {
  users: UserStats[];
  statistics: SystemStatistics | null;
  isLoading: boolean;
  error: string | null;
}

export type AdminAction =
  | { type: 'FETCH_USERS_START' }
  | { type: 'FETCH_USERS_SUCCESS'; payload: UserStats[] }
  | { type: 'FETCH_USERS_FAILURE'; payload: string }
  | { type: 'FETCH_STATISTICS_START' }
  | { type: 'FETCH_STATISTICS_SUCCESS'; payload: SystemStatistics }
  | { type: 'FETCH_STATISTICS_FAILURE'; payload: string }
  | { type: 'DELETE_USER_START' }
  | { type: 'DELETE_USER_SUCCESS'; payload: number }
  | { type: 'DELETE_USER_FAILURE'; payload: string }
  | { type: 'UPDATE_USER_SETTINGS_START' }
  | { type: 'UPDATE_USER_SETTINGS_SUCCESS'; payload: UserStats }
  | { type: 'UPDATE_USER_SETTINGS_FAILURE'; payload: string }
  | { type: 'CLEAR_ERROR' };
