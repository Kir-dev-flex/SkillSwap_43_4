import React, { useRef } from 'react';
import { Avatar } from '../../../shared/ui/avatar/avatar';
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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleIconClick();
    }
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.avatar}
        onClick={handleIconClick}
        onKeyDown={handleKeyDown}
        role='button'
        tabIndex={0}
      >
        <Avatar src={previewUrl} size={54} />
        <svg
          className={styles.plusIcon}
          onClick={(e) => {
            e.stopPropagation();
            handleIconClick();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              handleIconClick();
            }
          }}
          role='button'
          tabIndex={0}
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
