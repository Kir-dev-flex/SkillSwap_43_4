import { useReducer, useEffect, useRef } from 'react';
import { AppStateContext, AppDispatchContext } from './appStore';
import { appReducer, loadSavedState, initialState } from './reducer';
import { getUsers, getSkills, getCategories, getNotifications } from '../../api/mockApi';
import { User, Skill, Category, Notification } from '../../types';

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(appReducer, initialState, loadSavedState);

  // Флаг, который показывает, была ли выполнена начальная загрузка из API
  const hasInitialLoad = useRef(false);

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
    // Если начальная загрузка уже была - выходим
    if (hasInitialLoad.current) return;

    // Создаем AbortController для отмены запросов
    const abortController = new AbortController();

    const loadData = async () => {
      try {
        // Загружаем данные только если их нет в сохраненном состоянии
        const savedState = loadSavedState();

        const promises = [];
        const promiseTypes: Array<'users' | 'skills' | 'categories' | 'notifications'> = [];

        // Загружаем данные только если их нет в сохраненном состоянии ИЛИ в текущем состоянии
        if (savedState.users.length === 0 && state.users.length === 0) {
          promises.push(getUsers());
          promiseTypes.push('users');
        }

        if (savedState.skills.length === 0 && state.skills.length === 0) {
          promises.push(getSkills());
          promiseTypes.push('skills');
        }

        if (savedState.categories.length === 0 && state.categories.length === 0) {
          promises.push(getCategories());
          promiseTypes.push('categories');
        }

        // Ключевое: для уведомлений загружаем ТОЛЬКО если их нет в сохраненном состоянии
        // Это позволяет при обновлении страницы загручить уведомления из API,
        // но не загружать их повторно, если пользователь их удалил
        if (savedState.notifications.length === 0 && state.notifications.length === 0) {
          promises.push(getNotifications());
          promiseTypes.push('notifications');
        }

        // Если нечего загружать - выходим
        if (promises.length === 0) {
          hasInitialLoad.current = true;
          return;
        }

        const results = await Promise.allSettled(promises);

        // Проверяем, не был ли запрос отменен
        if (abortController.signal.aborted) return;

        results.forEach((result, index) => {
          const type = promiseTypes[index];

          if (result.status === 'fulfilled') {
            switch (type) {
              case 'users':
                dispatch({
                  type: 'USERS/SET_USERS',
                  payload: result.value as User[],
                });
                break;
              case 'skills':
                dispatch({
                  type: 'SKILLS/SET_SKILLS',
                  payload: result.value as Skill[],
                });
                break;
              case 'categories':
                dispatch({
                  type: 'CATEGORIES/SET_CATEGORIES',
                  payload: result.value as Category[],
                });
                break;
              case 'notifications':
                dispatch({
                  type: 'NOTIFICATIONS/SET',
                  payload: result.value as Notification[],
                });
                break;
              default:
                throw new Error(`Unhandled type: ${type}`);
            }
          } else {
            console.error(`Failed to load ${type}:`, result.reason);
          }
        });

        // Отмечаем, что начальная загрузка выполнена
        hasInitialLoad.current = true;
      } catch (error) {
        // Игнорируем ошибку отмены запроса
        if (error instanceof Error && error.name === 'AbortError') return;

        console.error('Failed to load data:', error);
        hasInitialLoad.current = true; // Все равно отмечаем, чтобы не повторять
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Пустой массив зависимостей - выполняется только при монтировании

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};
