import type { AdminState, AdminAction } from '../types/index';

export const initialAdminState: AdminState = {
  users: [],
  statistics: null,
  isLoading: false,
  error: null,
};

export function adminReducer(state: AdminState, action: AdminAction): AdminState {
  switch (action.type) {
    case 'FETCH_USERS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'FETCH_USERS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        users: action.payload,
      };

    case 'FETCH_USERS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'FETCH_STATISTICS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'FETCH_STATISTICS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        statistics: action.payload,
      };

    case 'FETCH_STATISTICS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'DELETE_USER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'DELETE_USER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        users: state.users.filter((u) => u.id !== action.payload),
      };

    case 'DELETE_USER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };

    case 'UPDATE_USER_SETTINGS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };

    case 'UPDATE_USER_SETTINGS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        users: state.users.map((u) =>
          u.id === action.payload.id ? action.payload : u
        ),
      };

    case 'UPDATE_USER_SETTINGS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
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
