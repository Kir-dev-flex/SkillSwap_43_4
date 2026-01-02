import { useNavigate } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../shared/hooks/storeHooks';
import NotificationItem from '../../shared/ui/NotificationItem/NotificationItem';
import styles from './PopupNotifications.module.css';

export const PopupNotifications = () => {
  const { notifications, users } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const unread = notifications.filter((n) => !n.isRead);
  const read = notifications.filter((n) => n.isRead);

  const getUserName = (userId: number): string => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : 'Пользователь';
  };

  const handleMarkAllAsRead = () => {
    unread.forEach((notification) => {
      dispatch({
        type: 'NOTIFICATIONS/UPDATE',
        payload: { id: notification.id, data: { isRead: true } },
      });
    });
  };

  const handleClearRead = () => {
    const ids = read.map((n) => n.id);
    dispatch({ type: 'NOTIFICATIONS/REMOVE_MANY', payload: ids });
  };

  return (
    <div className={styles.popup}>
      {unread.length > 0 && (
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Новые уведомления</h3>
            <button type='button' className={styles.actionBtn} onClick={handleMarkAllAsRead}>
              Прочитать все
            </button>
          </div>
          <div className={styles.list}>
            {unread.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                userName={getUserName(n.relatedUserId)}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div className={styles.section}>
          <div className={styles.readHeader}>
            <h3 className={styles.sectionTitle}>Просмотренные</h3>
            <button type='button' className={styles.clearBtn} onClick={handleClearRead}>
              Очистить
            </button>
          </div>
          <div className={styles.list}>
            {read.map((n) => (
              <NotificationItem
                key={n.id}
                notification={n}
                userName={getUserName(n.relatedUserId)}
                navigate={navigate}
              />
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && <p className={styles.empty}>У вас нет уведомлений</p>}
    </div>
  );
};
