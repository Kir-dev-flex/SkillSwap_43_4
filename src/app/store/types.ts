import { User, Skill, Category, Notification } from '../../types';

export interface AppState {
  user: User | null;
  users: User[];
  skills: Skill[];
  categories: Category[];
  notifications: Notification[];
  favorites: number[];
}

export type AppAction =
  | { type: 'USER/LOGIN'; payload: User }
  | { type: 'USER/LOGOUT' }
  | { type: 'USER/UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'USERS/SET_USERS'; payload: User[] }
  | { type: 'USERS/ADD_USER'; payload: User }
  | {
      type: 'USERS/UPDATE_USER';
      payload: {
        id: number;
        data: Partial<User>;
      };
    }
  | { type: 'SKILLS/SET_SKILLS'; payload: Skill[] }
  | { type: 'SKILLS/ADD_SKILL'; payload: Skill }
  | { type: 'CATEGORIES/SET_CATEGORIES'; payload: Category[] }
  | { type: 'NOTIFICATIONS/SET'; payload: Notification[] }
  | { type: 'NOTIFICATIONS/ADD'; payload: Notification }
  | { type: 'FAVORITES/ADD'; payload: number }
  | { type: 'FAVORITES/REMOVE'; payload: number }
  | { type: 'APP/RESET' };
