import { FC } from 'react';

/**
 * Интерфейс пропсов компонента иконки ImageUploadIcon
 */
interface ImageUploadIconProps {
  className?: string;
}

/**
 * Компонент иконки загрузки изображений
 * @param props - Свойства компонента
 * @returns {JSX.Element} Иконка загрузки изображений
 */
const ImageUploadIcon: FC<ImageUploadIconProps> = ({ className = '' }) => (
  <svg
    width='24'
    height='24'
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
  >
    <rect
      x='3'
      y='3'
      width='18'
      height='18'
      rx='2'
      stroke='currentColor'
      strokeWidth='2'
      fill='none'
    />
    <circle cx='8.5' cy='8.5' r='1.5' fill='currentColor' />
    <path
      d='M21 15L16 10L11 15L8 12L3 17V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V15Z'
      fill='currentColor'
    />
    <path
      d='M16 2V6M16 22V18M2 12H6M22 12H18'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
    />
  </svg>
);

export default ImageUploadIcon;
