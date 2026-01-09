import { AppState, AppAction } from './types';

export const initialState: AppState = {
  user: null,
  users: [],
  skills: [],
  categories: [],
  notifications: [],
  favorites: [],
};

/**
 * Загружает состояние из localStorage при старте приложения.
 * Восстанавливает только критически важные данные: user, favorites, notifications.
 * Остальное (users, skills, categories) загружается асинхронно при старте.
 */
export const loadSavedState = (): AppState => {
  try {
    const raw = localStorage.getItem('appState');
    if (!raw) return initialState;

    const saved = JSON.parse(raw);

    // Защита от некорректных данных
    const user = saved.user && typeof saved.user === 'object' ? saved.user : null;
    const favorites = Array.isArray(saved.favorites)
      ? saved.favorites.map(Number).filter((id: number) => Number.isInteger(id) && id > 0)
      : [];
    const notifications = Array.isArray(saved.notifications) ? saved.notifications : [];

    return {
      ...initialState,
      user,
      favorites,
      notifications,
    };
  } catch (error) {
    console.warn('Failed to load state from localStorage, using initial state', error);
    return initialState;
  }
};

/**
 * Чистый reducer: принимает состояние и действие, возвращает новое состояние.
 */
export const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'USER/LOGIN':
      return { ...state, user: action.payload };

    case 'USER/LOGOUT':
      return { ...state, user: null };

    case 'USER/UPDATE_PROFILE':
      return state.user ? { ...state, user: { ...state.user, ...action.payload } } : state;

    case 'USERS/SET_USERS':
      return { ...state, users: action.payload };

    case 'USERS/ADD_USER':
      return { ...state, users: [...state.users, action.payload] };

    case 'USERS/UPDATE_USER':
      return {
        ...state,
        users: state.users.map((u) =>
          u.id === action.payload.id ? { ...u, ...action.payload.data } : u
        ),
      };

    case 'SKILLS/SET_SKILLS':
      return { ...state, skills: action.payload };

    case 'SKILLS/ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };

    case 'CATEGORIES/SET_CATEGORIES':
      return { ...state, categories: action.payload };

    case 'NOTIFICATIONS/SET':
      return { ...state, notifications: action.payload };

    case 'NOTIFICATIONS/ADD':
      return { ...state, notifications: [...state.notifications, action.payload] };

    case 'NOTIFICATIONS/UPDATE': {
      const { id, data } = action.payload;
      return {
        ...state,
        notifications: state.notifications.map((n) => (n.id === id ? { ...n, ...data } : n)),
      };
    }

    case 'NOTIFICATIONS/REMOVE':
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload),
      };

    case 'NOTIFICATIONS/REMOVE_MANY': {
      const idsToRemove = new Set(action.payload);
      return {
        ...state,
        notifications: state.notifications.filter((n) => !idsToRemove.has(n.id)),
      };
    }

    case 'FAVORITES/ADD':
      if (state.favorites.includes(action.payload)) return state;
      return { ...state, favorites: [...state.favorites, action.payload] };

    case 'FAVORITES/REMOVE':
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };

    case 'APP/RESET':
      return initialState;
    default:
      return state;
  }
};
