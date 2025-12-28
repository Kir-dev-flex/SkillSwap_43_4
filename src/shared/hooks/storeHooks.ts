import { useContext } from 'react';
import { AppStateContext, AppDispatchContext } from '../../app/store/appStore';
import { AppState, AppAction } from '../../app/store/types';

/**
 * Предоставляет доступ к глобальному состоянию приложения.
 * Возвращает актуальное состояние целиком.
 * Гарантирует, что хук используется только внутри <AppProvider> — в противном случае выбрасывает ошибку.
 * @returns Текущее глобальное состояние приложения
 */
export const useAppState = (): AppState => {
  const ctx = useContext(AppStateContext);
  if (ctx === undefined) throw new Error('useAppState outside AppProvider');
  return ctx;
};

/**
 * Предоставляет доступ к функции dispatch для отправки действий (actions).
 * Позволяет изменять глобальное состояние через строго типизированные действия.
 * Защищён от использования вне контекста приложения — выбрасывает ошибку при нарушении.
 * @returns Функция dispatch, принимающая действия типа AppAction
 */
export const useAppDispatch = (): React.Dispatch<AppAction> => {
  const ctx = useContext(AppDispatchContext);
  if (ctx === undefined) throw new Error('useAppDispatch outside AppProvider');
  return ctx;
};

/**
 * Комбинированный хук для одновременного доступа к состоянию и диспетчеру.
 * Удобен в компонентах, которым требуется и чтение состояния, и отправка действий.
 * Строится на основе useAppState и useAppDispatch — наследует их безопасность и типизацию.
 * @returns Объект { state: AppState, dispatch: React.Dispatch<AppAction> }
 */
export const useAppStore = () => ({
  state: useAppState(),
  dispatch: useAppDispatch(),
});
