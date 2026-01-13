import React from 'react';

const EditIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <path
      d='M11.3333 2.00001C11.5084 1.8249 11.7163 1.68605 11.9447 1.59128C12.1731 1.49651 12.4173 1.44775 12.6667 1.44775C12.916 1.44775 13.1602 1.49651 13.3886 1.59128C13.617 1.68605 13.8249 1.8249 14 2.00001C14.1751 2.17512 14.314 2.38305 14.4087 2.61144C14.5035 2.83984 14.5523 3.08405 14.5523 3.33334C14.5523 3.58264 14.5035 3.82685 14.4087 4.05524C14.314 4.28364 14.1751 4.49157 14 4.66668L5.00001 13.6667L1.33334 14.6667L2.33334 11L11.3333 2.00001Z'
      stroke='currentColor'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default EditIcon;
