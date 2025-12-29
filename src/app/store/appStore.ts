import { createContext } from 'react';
import { AppState, AppAction } from './types';

/**
 * Контекст глобального состояния приложения.
 * Предоставляет доступ к данным: пользователь, пользователи, навыки, уведомления и т.д.
 */
export const AppStateContext = createContext<AppState | undefined>(undefined);

/**
 * Контекст диспетчера действий.
 * Позволяет отправлять действия (actions) для изменения глобального состояния.
 */
export const AppDispatchContext = createContext<React.Dispatch<AppAction> | undefined>(undefined);
