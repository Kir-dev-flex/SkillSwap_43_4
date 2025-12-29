import { useReducer, useEffect } from 'react';
import { AppStateContext, AppDispatchContext } from './appStore';
import { appReducer, loadSavedState, initialState } from './reducer';
import { getUsers, getSkills, getCategories, getNotifications } from '../../api/mockApi';
import { User, Skill, Category, Notification } from '../../types';

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
  }, [state.user, state.favorites, state.notifications]);


  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        // Проверяем, нужно ли загружать (если уже есть данные)
        if (state.users.length > 0 && state.skills.length > 0) {
          return;
        }

        // Загружаем только то, чего нет
        const promises = [];
        const promiseTypes: Array<'users' | 'skills' | 'categories' | 'notifications'> = [];

        if (state.users.length === 0) {
          promises.push(getUsers());
          promiseTypes.push('users');
        }

        if (state.skills.length === 0) {
          promises.push(getSkills());
          promiseTypes.push('skills');
        }

        if (state.categories.length === 0) {
          promises.push(getCategories());
          promiseTypes.push('categories');
        }

        if (state.notifications.length === 0) {
          promises.push(getNotifications());
          promiseTypes.push('notifications');
        }

        // Если нечего загружать - выходим
        if (promises.length === 0) return;

        const results = await Promise.allSettled(promises);

        if (!isMounted) return;

        results.forEach((result, index) => {
          const type = promiseTypes[index];

          if (result.status === 'fulfilled') {
            switch (type) {
              case 'users':
                dispatch({
                  type: 'USERS/SET_USERS',
                  payload: result.value as User[]
                });
                break;
              case 'skills':
                dispatch({
                  type: 'SKILLS/SET_SKILLS',
                  payload: result.value as Skill[]
                });
                break;
              case 'categories':
                dispatch({
                  type: 'CATEGORIES/SET_CATEGORIES',
                  payload: result.value as Category[]
                });
                break;
              case 'notifications':
                dispatch({
                  type: 'NOTIFICATIONS/SET',
                  payload: result.value as Notification[]
                });
                break;
            }
          } else {
            // Обработка ошибки для конкретного типа
            console.error(`Failed to load ${type}:`, result.reason);
          }
        });
      } catch (error) {
        if (!isMounted) return;
          console.error('Failed to load data:', error);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [state.users.length, state.skills.length, state.categories.length, state.notifications.length]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
