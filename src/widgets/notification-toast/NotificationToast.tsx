import React, { useState } from 'react';
import { Notification } from '../../types';
import LightBulbIcon from '../../shared/ui/NotificationItem/icons/LightBulbIcon';
import styles from './NotificationToast.module.css';

interface NotificationToastProps {
  notification: Notification;
  userName: string;
  onClose: () => void;
  index: number;
}

/**
 * Компонент для отображения одного уведомления в левом нижнем углу
 */
const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  userName,
  onClose,
  index,
}) => {
  const [isHovered, setIsHovered] = useState(false);

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

  const title = getTitle();

  // Рассчитываем позицию снизу: первое уведомление (index=0) внизу
  // Каждое следующее выше на высоту уведомления + отступ
  // По макету: высота 72px + отступ 28px между уведомлениями
  const bottomOffset = 20 + index * (72 + 28);

  return (
    <div
      className={styles.toast}
      style={{ bottom: `${bottomOffset}px` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <button
        type='button'
        className={styles.closeButton}
        onClick={onClose}
        aria-label='Закрыть уведомление'
      >
        <svg
          width='10.61'
          height='10.61'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M12 4L4 12M4 4L12 12'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      <div className={styles.content}>
        <div className={styles.iconContainer}>
          <LightBulbIcon />
        </div>
        <div className={styles.textContainer}>
          <h3 className={styles.title}>{title}</h3>
        </div>
      </div>

      <div className={styles.buttonContainer}>
        {isHovered && (
          <button type='button' className={styles.goButton}>
            Перейти
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationToast;
