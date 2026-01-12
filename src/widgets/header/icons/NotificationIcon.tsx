import React from 'react';

interface NotificationIconProps {
  className?: string;
  onClick?: () => void;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({ className = '', onClick }) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 19 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <path
      d='M0.777981 12.243C0.586281 13.4976 1.44218 14.3679 2.48978 14.8017C6.50648 16.4667 12.0955 16.4667 16.1122 14.8017C17.1598 14.3679 18.0157 13.4967 17.824 12.243C17.707 11.4717 17.1247 10.83 16.6936 10.2027C16.1293 9.3711 16.0735 8.4648 16.0726 7.5C16.0735 3.7722 13.0423 0.75 9.30098 0.75C5.55968 0.75 2.52848 3.7722 2.52848 7.5C2.52848 8.4648 2.47268 9.372 1.90748 10.2027C1.47728 10.83 0.895881 11.4717 0.777981 12.243Z'
      stroke='#253017'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M5.70117 16.0508C6.11337 17.6033 7.56957 18.7508 9.30117 18.7508C11.0337 18.7508 12.4881 17.6033 12.9012 16.0508'
      stroke='#253017'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default NotificationIcon;
