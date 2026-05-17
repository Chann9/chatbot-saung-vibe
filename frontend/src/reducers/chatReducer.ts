import type { ChatState, ChatAction } from '../types/index';

export const initialChatState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: [],
  isLoading: false,
  isTyping: false,
  error: null,
};

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'FETCH_CONVERSATIONS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'FETCH_CONVERSATIONS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        conversations: action.payload,
      };

    case 'FETCH_CONVERSATIONS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'SELECT_CONVERSATION':
      return {
        ...state,
        currentConversation: action.payload,
        messages: [],
      };

    case 'FETCH_MESSAGES_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'FETCH_MESSAGES_SUCCESS':
      return {
        ...state,
        isLoading: false,
        messages: action.payload,
      };

    case 'FETCH_MESSAGES_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'CREATE_CONVERSATION_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'CREATE_CONVERSATION_SUCCESS':
      return {
        ...state,
        isLoading: false,
        conversations: [action.payload, ...state.conversations],
      };

    case 'CREATE_CONVERSATION_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };

    case 'SET_TYPING':
      return {
        ...state,
        isTyping: action.payload,
      };

    case 'UPDATE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.map((c) =>
          c.id === action.payload.id ? action.payload : c
        ),
        currentConversation:
          state.currentConversation?.id === action.payload.id
            ? action.payload
            : state.currentConversation,
      };

    case 'DELETE_CONVERSATION':
      return {
        ...state,
        conversations: state.conversations.filter((c) => c.id !== action.payload),
        currentConversation:
          state.currentConversation?.id === action.payload
            ? null
            : state.currentConversation,
        messages:
          state.currentConversation?.id === action.payload ? [] : state.messages,
      };

    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
}
