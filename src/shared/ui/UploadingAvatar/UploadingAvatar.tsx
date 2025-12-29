import React, { useRef } from 'react';
import { Avatar } from '../avatar/avatar';
import styles from './UploadingAvatar.module.css';

interface UploadingAvatarProps {
  onUpload: (file: File) => void;
  previewUrl?: string;
}

export const UploadingAvatar: React.FC<UploadingAvatarProps> = ({ onUpload, previewUrl }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.avatar}>
        {previewUrl ? (
          <Avatar src={previewUrl} size={72} />
        ) : (
          <svg
            className={styles.defaultAvatar}
            width='56'
            height='56'
            viewBox='0 0 56 56'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M45.6945 47.9241C43.598 45.1491 40.8859 42.8986 37.7717 41.3499C34.6576 39.8011 31.2265 38.9964 27.7485 38.9991C24.2705 38.9964 20.8394 39.8011 17.7253 41.3499C14.6111 42.8986 11.899 45.1491 9.80251 47.9241M45.6945 47.9241C49.785 44.2857 52.6729 39.4898 53.9751 34.1724C55.2773 28.855 54.9323 23.2674 52.9859 18.1505C51.0395 13.0337 47.5837 8.62944 43.0767 5.52181C38.5697 2.41417 33.2245 0.75 27.75 0.75C22.2755 0.75 16.9303 2.41417 12.4233 5.52181C7.91633 8.62944 4.46049 13.0337 2.51411 18.1505C0.567724 23.2674 0.222759 28.855 1.52496 34.1724C2.82716 39.4898 5.712 44.2857 9.80251 47.9241M45.6945 47.9241C40.756 52.3277 34.3652 54.7574 27.7485 54.7491C21.1308 54.7581 14.7418 52.3284 9.80251 47.9241M36.7485 20.9991C36.7485 23.3861 35.8003 25.6753 34.1125 27.3631C32.4246 29.0509 30.1355 29.9991 27.7485 29.9991C25.3616 29.9991 23.0724 29.0509 21.3845 27.3631C19.6967 25.6753 18.7485 23.3861 18.7485 20.9991C18.7485 18.6122 19.6967 16.323 21.3845 14.6352C23.0724 12.9473 25.3616 11.9991 27.7485 11.9991C30.1355 11.9991 32.4246 12.9473 34.1125 14.6352C35.8003 16.323 36.7485 18.6122 36.7485 20.9991Z'
              stroke='#253017'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        )}
        <svg
          className={styles.plusIcon}
          onClick={handleIconClick}
          width='16'
          height='16'
          viewBox='0 0 16 16'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <rect width='16' height='16' rx='8' fill='#ABD27A' />
          <path
            d='M12 8.5H4C3.72667 8.5 3.5 8.27333 3.5 8C3.5 7.72667 3.72667 7.5 4 7.5H12C12.2733 7.5 12.5 7.72667 12.5 8C12.5 8.27333 12.2733 8.5 12 8.5Z'
            fill='white'
          />
          <path
            d='M8 12.5C7.72667 12.5 7.5 12.2733 7.5 12V4C7.5 3.72667 7.72667 3.5 8 3.5C8.27333 3.5 8.5 3.72667 8.5 4V12C8.5 12.2733 8.27333 12.5 8 12.5Z'
            fill='white'
          />
        </svg>
      </div>
      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileChange}
        className={styles.fileInput}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default UploadingAvatar;
