import React, { useEffect, useState, useRef } from 'react';
import { useAppState } from '../../shared/hooks/storeHooks';
import NotificationToast from './NotificationToast';
import styles from './NotificationContainer.module.css';

/**
 * Контейнер для отображения уведомлений в левом нижнем углу
 * Показывает только непрочитанные уведомления с задержкой
 */
const NotificationContainer: React.FC = () => {
  const { notifications, users, user } = useAppState();
  const [visibleNotifications, setVisibleNotifications] = useState<number[]>([]);
  const [shouldShowNotifications, setShouldShowNotifications] = useState(false);
  const previousUserRef = useRef<number | null>(null);
  const isMountedRef = useRef(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Получаем только непрочитанные уведомления (isRead: false)
  // В файле public/db/notifications.json есть 3 непрочитанных уведомления (id: 1, 2, 3)
  const unreadNotifications = notifications.filter((n) => n.isRead === false);

  // Отслеживаем монтирование компонента
  useEffect(() => {
    // При первой загрузке устанавливаем текущего пользователя как предыдущего
    if (!isMountedRef.current) {
      const currentUserId = user?.id || null;
      previousUserRef.current = currentUserId;
      isMountedRef.current = true;

      // Если пользователь уже авторизован при загрузке и есть непрочитанные уведомления
      // показываем их (для тестирования)
      if (currentUserId && unreadNotifications.length > 0) {
        // Небольшая задержка для того, чтобы страница успела загрузиться
        setTimeout(() => {
          setShouldShowNotifications(true);
        }, 1000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Отслеживаем изменение пользователя (авторизация/регистрация)
  useEffect(() => {
    if (!isMountedRef.current) {
      return;
    }

    const currentUserId = user?.id || null;

    // Если пользователь только что залогинился (был null, стал не null)
    if (!previousUserRef.current && currentUserId) {
      setShouldShowNotifications(true);
    }

    previousUserRef.current = currentUserId;
  }, [user]);

  // Показываем уведомления при успешной авторизации/регистрации
  useEffect(() => {
    if (!shouldShowNotifications) {
      return;
    }

    // Сохраняем текущий список непрочитанных уведомлений
    const notificationsToShow = notifications.filter((n) => n.isRead === false);

    if (notificationsToShow.length === 0) {
      setShouldShowNotifications(false);
      return;
    }

    // Очищаем предыдущие таймеры
    timersRef.current.forEach((timer) => clearTimeout(timer));
    timersRef.current = [];

    // Сбрасываем флаг сразу, чтобы не запускать эффект повторно
    setShouldShowNotifications(false);

    // Показываем каждое уведомление с задержкой 3-5 секунд
    notificationsToShow.forEach((notification, index) => {
      const delay = 3000 + index * 1000; // 3, 4, 5 секунд

      const timer = setTimeout(() => {
        setVisibleNotifications((prev) => {
          const newList = !prev.includes(notification.id) ? [...prev, notification.id] : prev;
          return newList;
        });
      }, delay);

      timersRef.current.push(timer);
    });

    // НЕ возвращаем cleanup здесь, чтобы таймеры не очищались
    // Cleanup будет только при размонтировании компонента
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShowNotifications]);

  // Отдельный useEffect для cleanup при размонтировании компонента
  useEffect(
    () => () => {
      timersRef.current.forEach((timer) => clearTimeout(timer));
      timersRef.current = [];
    },
    []
  );

  // Получаем имя пользователя по ID
  const getUserName = (userId: number): string => {
    const foundUser = users.find((u) => u.id === userId);
    return foundUser ? foundUser.name : 'Пользователь';
  };

  // Обработчик закрытия уведомления
  const handleClose = (notificationId: number) => {
    setVisibleNotifications((prev) => prev.filter((id) => id !== notificationId));
  };

  // Фильтруем видимые уведомления и сортируем по времени создания (новые снизу)
  const visible = unreadNotifications
    .filter((n) => visibleNotifications.includes(n.id))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  if (visible.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      {visible.map((notification, index) => (
        <NotificationToast
          key={notification.id}
          notification={notification}
          userName={getUserName(notification.relatedUserId)}
          onClose={() => handleClose(notification.id)}
          index={index}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
