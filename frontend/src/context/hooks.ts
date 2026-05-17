import { useCallback } from 'react';
import { useAuth as useAuthContext, useChat as useChatContext, useAdmin as useAdminContext } from './AppContext';
import { mockAPI } from '../services/api';

// ===== Auth Hooks =====
export function useAuth() {
  return useAuthContext();
}

export function useAuthActions() {
  const { dispatch, state } = useAuthContext();

  const login = useCallback(
    async (username: string, password: string) => {
      dispatch({ type: 'LOGIN_START' });
      try {
        const response = await mockAPI.login({ username, password });
        if (response.success && response.data) {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: {
              user: response.data.user,
              token: response.data.token,
            },
          });
          return { success: true };
        } else {
          dispatch({
            type: 'LOGIN_FAILURE',
            payload: response.message || 'Login failed',
          });
          return { success: false, error: response.message };
        }
      } catch {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: 'An error occurred during login',
        });
        return { success: false, error: 'An error occurred' };
      }
    },
    [dispatch]
  );

  const register = useCallback(
    async (username: string, email: string, password: string, confirmPassword: string) => {
      dispatch({ type: 'REGISTER_START' });
      try {
        const response = await mockAPI.register({
          username,
          email,
          password,
          confirmPassword,
        });
        if (response.success && response.data) {
          dispatch({
            type: 'REGISTER_SUCCESS',
            payload: {
              user: response.data.user,
              token: response.data.token,
            },
          });
          return { success: true };
        } else {
          dispatch({
            type: 'REGISTER_FAILURE',
            payload: response.message || 'Registration failed',
          });
          return { success: false, error: response.message };
        }
      } catch {
        dispatch({
          type: 'REGISTER_FAILURE',
          payload: 'An error occurred during registration',
        });
        return { success: false, error: 'An error occurred' };
      }
    },
    [dispatch]
  );

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, [dispatch]);

  return { login, register, logout, isLoading: state.isLoading, error: state.error };
}

// ===== Chat Hooks =====
export function useChat() {
  return useChatContext();
}

export function useChatActions() {
  const { dispatch, state } = useChatContext();
  const { state: authState } = useAuthContext();

  const fetchConversations = useCallback(async () => {
    if (!authState.user) return;
    dispatch({ type: 'FETCH_CONVERSATIONS_START' });
    try {
      const response = await mockAPI.getConversations(authState.user.id);
      if (response.success && response.data) {
        dispatch({
          type: 'FETCH_CONVERSATIONS_SUCCESS',
          payload: response.data,
        });
      } else {
        dispatch({
          type: 'FETCH_CONVERSATIONS_FAILURE',
          payload: response.error || 'Failed to fetch conversations',
        });
      }
    } catch {
      dispatch({
        type: 'FETCH_CONVERSATIONS_FAILURE',
        payload: 'An error occurred',
      });
    }
  }, [dispatch, authState.user]);

  const selectConversation = useCallback(
    async (conversation) => {
      dispatch({ type: 'SELECT_CONVERSATION', payload: conversation });
      dispatch({ type: 'FETCH_MESSAGES_START' });
      try {
        const response = await mockAPI.getMessages(conversation.id);
        if (response.success && response.data) {
          dispatch({
            type: 'FETCH_MESSAGES_SUCCESS',
            payload: response.data,
          });
        } else {
          dispatch({
            type: 'FETCH_MESSAGES_FAILURE',
            payload: response.error || 'Failed to fetch messages',
          });
        }
      } catch {
        dispatch({
          type: 'FETCH_MESSAGES_FAILURE',
          payload: 'An error occurred',
        });
      }
    },
    [dispatch]
  );

  const createConversation = useCallback(
    async (title: string) => {
      if (!authState.user) return;
      dispatch({ type: 'CREATE_CONVERSATION_START' });
      try {
        const response = await mockAPI.createConversation(
          { title },
          authState.user.id
        );
        if (response.success && response.data) {
          dispatch({
            type: 'CREATE_CONVERSATION_SUCCESS',
            payload: response.data,
          });
          return { success: true, conversation: response.data };
        } else {
          dispatch({
            type: 'CREATE_CONVERSATION_FAILURE',
            payload: response.error || 'Failed to create conversation',
          });
          return { success: false };
        }
      } catch {
        dispatch({
          type: 'CREATE_CONVERSATION_FAILURE',
          payload: 'An error occurred',
        });
        return { success: false };
      }
    },
    [dispatch, authState.user]
  );

  const sendMessage = useCallback(
    async (message: string) => {
      if (!state.currentConversation) return;

      dispatch({ type: 'SET_TYPING', payload: true });
      try {
        const response = await mockAPI.sendMessage(
          state.currentConversation.id,
          { message }
        );
        if (response.success && response.data) {
          dispatch({
            type: 'ADD_MESSAGE',
            payload: response.data.userMessage,
          });
          dispatch({
            type: 'ADD_MESSAGE',
            payload: response.data.aiMessage,
          });

          // Update conversation
          const updatedConv = await mockAPI.getConversation(
            state.currentConversation.id
          );
          if (updatedConv.success && updatedConv.data) {
            dispatch({
              type: 'UPDATE_CONVERSATION',
              payload: updatedConv.data,
            });
          }

          return { success: true };
        } else {
          return { success: false, error: response.error };
        }
      } catch {
        return { success: false, error: 'An error occurred' };
      } finally {
        dispatch({ type: 'SET_TYPING', payload: false });
      }
    },
    [dispatch, state.currentConversation]
  );

  const updateConversation = useCallback(
    async (conversationId: number, title: string) => {
      try {
        const response = await mockAPI.updateConversation(conversationId, title);
        if (response.success && response.data) {
          dispatch({
            type: 'UPDATE_CONVERSATION',
            payload: response.data,
          });
          return { success: true };
        } else {
          return { success: false, error: response.error };
        }
      } catch {
        return { success: false, error: 'An error occurred' };
      }
    },
    [dispatch]
  );

  const deleteConversation = useCallback(
    async (conversationId: number) => {
      try {
        const response = await mockAPI.deleteConversation(conversationId);
        if (response.success) {
          dispatch({ type: 'DELETE_CONVERSATION', payload: conversationId });
          return { success: true };
        } else {
          return { success: false, error: response.error };
        }
      } catch {
        return { success: false, error: 'An error occurred' };
      }
    },
    [dispatch]
  );

  return {
    fetchConversations,
    selectConversation,
    createConversation,
    sendMessage,
    updateConversation,
    deleteConversation,
    isLoading: state.isLoading,
    isTyping: state.isTyping,
  };
}

// ===== Admin Hooks =====
export function useAdmin() {
  return useAdminContext();
}

export function useAdminActions() {
  const { dispatch, state } = useAdminContext();
  const { state: authState } = useAuthContext();

  const fetchUsers = useCallback(async () => {
    if (!authState.user) return;
    dispatch({ type: 'FETCH_USERS_START' });
    try {
      const response = await mockAPI.getAllUsers(authState.user.id);
      if (response.success && response.data) {
        dispatch({ type: 'FETCH_USERS_SUCCESS', payload: response.data });
      } else {
        dispatch({
          type: 'FETCH_USERS_FAILURE',
          payload: response.error || 'Failed to fetch users',
        });
      }
    } catch {
      dispatch({
        type: 'FETCH_USERS_FAILURE',
        payload: 'An error occurred',
      });
    }
  }, [dispatch, authState.user]);

  const fetchStatistics = useCallback(async () => {
    if (!authState.user) return;
    dispatch({ type: 'FETCH_STATISTICS_START' });
    try {
      const response = await mockAPI.getStatistics(authState.user.id);
      if (response.success && response.data) {
        dispatch({
          type: 'FETCH_STATISTICS_SUCCESS',
          payload: response.data,
        });
      } else {
        dispatch({
          type: 'FETCH_STATISTICS_FAILURE',
          payload: response.error || 'Failed to fetch statistics',
        });
      }
    } catch {
      dispatch({
        type: 'FETCH_STATISTICS_FAILURE',
        payload: 'An error occurred',
      });
    }
  }, [dispatch, authState.user]);

  const deleteUser = useCallback(
    async (userId: number) => {
      if (!authState.user) return;
      dispatch({ type: 'DELETE_USER_START' });
      try {
        const response = await mockAPI.deleteUser(authState.user.id, userId);
        if (response.success) {
          dispatch({ type: 'DELETE_USER_SUCCESS', payload: userId });
          return { success: true };
        } else {
          dispatch({
            type: 'DELETE_USER_FAILURE',
            payload: response.error || 'Failed to delete user',
          });
          return { success: false, error: response.error };
        }
      } catch {
        dispatch({
          type: 'DELETE_USER_FAILURE',
          payload: 'An error occurred',
        });
        return { success: false, error: 'An error occurred' };
      }
    },
    [dispatch, authState.user]
  );

  const updateUserSettings = useCallback(
    async (userId: number, chatLimit: number) => {
      if (!authState.user) return;
      dispatch({ type: 'UPDATE_USER_SETTINGS_START' });
      try {
        const response = await mockAPI.updateUserSettings(
          authState.user.id,
          userId,
          chatLimit
        );
        if (response.success && response.data) {
          dispatch({
            type: 'UPDATE_USER_SETTINGS_SUCCESS',
            payload: response.data,
          });
          return { success: true };
        } else {
          dispatch({
            type: 'UPDATE_USER_SETTINGS_FAILURE',
            payload: response.error || 'Failed to update settings',
          });
          return { success: false, error: response.error };
        }
      } catch {
        dispatch({
          type: 'UPDATE_USER_SETTINGS_FAILURE',
          payload: 'An error occurred',
        });
        return { success: false, error: 'An error occurred' };
      }
    },
    [dispatch, authState.user]
  );

  return {
    fetchUsers,
    fetchStatistics,
    deleteUser,
    updateUserSettings,
    isLoading: state.isLoading,
  };
}
