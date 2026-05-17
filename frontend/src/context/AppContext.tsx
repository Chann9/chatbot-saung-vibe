import React, { createContext, useReducer, useEffect } from 'react';
import type {
  AuthContextType,
  ChatContextType,
  AdminContextType,
} from '../types/index';
import { authReducer, initialAuthState } from '../reducers/authReducer';
import { chatReducer, initialChatState } from '../reducers/chatReducer';
import { adminReducer, initialAdminState } from '../reducers/adminReducer';

// Create contexts
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const ChatContext = createContext<ChatContextType | undefined>(undefined);
export const AdminContext = createContext<AdminContextType | undefined>(
  undefined
);

// Provider component
interface AppContextProviderProps {
  children: React.ReactNode;
}

export function AppContextProvider({ children }: AppContextProviderProps) {
  const [authState, authDispatch] = useReducer(authReducer, initialAuthState);
  const [chatState, chatDispatch] = useReducer(chatReducer, initialChatState);
  const [adminState, adminDispatch] = useReducer(
    adminReducer,
    initialAdminState
  );

  // Restore session from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        authDispatch({
          type: 'RESTORE_SESSION',
          payload: { user, token: storedToken },
        });
      } catch {
        console.error('Failed to restore session');
      }
    }
  }, []);

  // Save token to localStorage whenever it changes
  useEffect(() => {
    if (authState.token && authState.user) {
      localStorage.setItem('authToken', authState.token);
      localStorage.setItem('authUser', JSON.stringify(authState.user));
    } else {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
    }
  }, [authState.token, authState.user]);

  const authValue: AuthContextType = {
    state: authState,
    dispatch: authDispatch,
  };

  const chatValue: ChatContextType = {
    state: chatState,
    dispatch: chatDispatch,
  };

  const adminValue: AdminContextType = {
    state: adminState,
    dispatch: adminDispatch,
  };

  return (
    <AuthContext.Provider value={authValue}>
      <ChatContext.Provider value={chatValue}>
        <AdminContext.Provider value={adminValue}>
          {children}
        </AdminContext.Provider>
      </ChatContext.Provider>
    </AuthContext.Provider>
  );
}
