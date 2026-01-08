import { FC } from 'react';
import { Notification } from '../../../types';
import { PrimaryButton } from '../button';
import { formatNotificationTime } from '../../../utils/text/notificationTimeUtils';
import LightBulbIcon from './icons/LightBulbIcon';
import styles from './NotificationItem.module.css';

export type TNotificationItemProps = {
  notification: Notification; // данные уведомления, интерфейс находится в src/types.ts
  userName: string; // имя пользователя, с кем связан обмен
  navigate?: (link: string) => void; // ссылка для перехода на страницу
};

/**
 * Компонент для отображения одного уведомления об обмене
 * @param {TNotificationItemProps} props - Свойства компонента
 * @returns {JSX.Element} Компонент уведомления
 */
const NotificationItem: FC<TNotificationItemProps> = ({ notification, userName, navigate }) => {
  // Формируем заголовок в зависимости от типа уведомления
  const getTitle = (): string => {
    switch (notification.type) {
      case 'exchange_proposed':
        return `${userName} предлагает вам обмен`;
      case 'exchange_accepted':
        return `${userName} принял ваш обмен`;
      case 'exchange_declined':
        return `${userName} отклонил ваш обмен`;
      default:
        return notification.title;
    }
  };

  // Формируем описание в зависимости от типа уведомления
  const getDescription = (): string => {
    switch (notification.type) {
      case 'exchange_proposed':
        return 'Примите обмен, чтобы обсудить детали';
      case 'exchange_accepted':
        return 'Перейдите в профиль, чтобы обсудить детали';
      case 'exchange_declined':
        return notification.message || 'Обмен был отклонен';
      default:
        return notification.message;
    }
  };

  const title = getTitle();
  const description = getDescription();
  const timeText = formatNotificationTime(notification.createdAt);

  const handleNavigate = () => {
    if (navigate) {
      // Формируем ссылку на профиль пользователя
      navigate(`/profile/${notification.relatedUserId}`);
    }
  };

  return (
    <div className={styles.notificationItem}>
      <div className={styles.iconContainer}>
        <LightBulbIcon />
      </div>
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <div className={styles.header}>
            <h3 className={styles.title}>{title}</h3>
            <span className={styles.time}>{timeText}</span>
          </div>
          <p className={styles.description}>{description}</p>
        </div>
        {navigate && (
          <div className={styles.buttonContainer}>
            <PrimaryButton label='Перейти' onClick={handleNavigate} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationItem;
