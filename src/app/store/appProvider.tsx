import { useReducer, useEffect } from 'react';
import { AppStateContext, AppDispatchContext } from './appStore';
import { appReducer, loadSavedState, initialState } from './reducer';
import { getUsers, getSkills, getCategories, getNotifications } from '../../api/mockApi';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, loadSavedState);

  useEffect(() => {
    try {
      const stateToSave = {
        user: state.user,
        favorites: state.favorites,
        notifications: state.notifications,
      };
      localStorage.setItem('appState', JSON.stringify(stateToSave));
    } catch (error) {
      console.error('Failed to save state to localStorage:', error);
    }
  }, [state]);

  useEffect(() => {
    Promise.all([getUsers(), getSkills(), getCategories(), getNotifications()]).then(
      ([users, skills, categories, notifications]) => {
        dispatch({ type: 'USERS/SET_USERS', payload: users });
        dispatch({ type: 'SKILLS/SET_SKILLS', payload: skills });
        dispatch({ type: 'CATEGORIES/SET_CATEGORIES', payload: categories });
        dispatch({ type: 'NOTIFICATIONS/SET', payload: notifications });
      }
    );
  }, []);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
