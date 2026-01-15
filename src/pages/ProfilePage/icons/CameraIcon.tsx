import React from 'react';

const CameraIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <path
      d='M10 13.3333C11.8409 13.3333 13.3333 11.8409 13.3333 9.99999C13.3333 8.15904 11.8409 6.66666 10 6.66666C8.15905 6.66666 6.66667 8.15904 6.66667 9.99999C6.66667 11.8409 8.15905 13.3333 10 13.3333Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M2.5 6.66666H4.16667L5 4.99999H9.16667L10 6.66666H17.5C17.721 6.66666 17.933 6.75446 18.0893 6.91074C18.2455 7.06702 18.3333 7.279 18.3333 7.49999V15.8333C18.3333 16.0543 18.2455 16.2663 18.0893 16.4226C17.933 16.5789 17.721 16.6667 17.5 16.6667H2.5C2.27902 16.6667 2.06705 16.5789 1.91077 16.4226C1.75449 16.2663 1.66667 16.0543 1.66667 15.8333V7.49999C1.66667 7.279 1.75449 7.06702 1.91077 6.91074C2.06705 6.75446 2.27902 6.66666 2.5 6.66666Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default CameraIcon;
