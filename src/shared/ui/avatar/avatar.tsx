import React from 'react';
import styles from './avatar.module.css';

// Интерфейс пропсов
interface AvatarProps {
  src?: string | null; // путь к файлу изображения
  alt?: string; // альтернативный текст изображения
  size?: number; // задает инлайн стили размера аватара
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src = null,
  alt = 'Аватар пользователя',
  size = 100,
  className = '',
}) =>
  src ? (
    <img
      src={src}
      className={`${styles.avatar} ${className}`}
      alt={alt}
      width={size}
      height={size}
    />
  ) : (
    <svg
      className={`${styles.avatar} ${className}`}
      width={size}
      height={size}
      xmlns='http://www.w3.org/2000/svg'
      viewBox='0 0 24 24'
      fill='none'
    >
      <circle cx='12' cy='6' r='4' stroke='currentColor' strokeWidth='1.5' />
      <path
        d='M15 20.6151C14.0907 20.8619 13.0736 21 12 21C8.13401 21 5 19.2091 5 17C5 14.7909 8.13401 13 12 13C15.866 13 19 14.7909 19 17C19 17.3453 18.9234 17.6804 18.7795 18'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  );
