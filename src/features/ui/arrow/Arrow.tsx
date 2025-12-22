import React, { useState } from 'react';
import styles from './arrow.module.css';

interface ArrowProps {
  width?: number | string;
  height?: number | string;
  fill?: string;
  className?: string;
  defaultActive?: boolean;
  onChange?: (isActive: boolean) => void;
  svgProps?: React.SVGProps<SVGSVGElement>;
}

function Arrow({
  width = 16,
  height = 8,
  fill = 'currentColor',
  className = '',
  defaultActive = false,
  onChange,
  svgProps = {},
}: ArrowProps) {
  const [isActive, setIsActive] = useState(defaultActive);

  const handleClick = () => {
    const newState = !isActive;
    setIsActive(newState);
    onChange?.(newState);
  };

  return (
    <button
      className={`${styles.arrowButton} ${isActive ? styles.active : ''} ${className}`}
      onClick={handleClick}
      type='button'
    >
      <svg
        {...svgProps}
        className={`${styles.arrow} ${isActive ? styles.arrowRotated : ''}`}
        width={width}
        height={height}
        viewBox='0 0 17 9'
        fill={fill}
        xmlns='http://www.w3.org/2000/svg'
      >
        <path d='M8 7.93539C7.35391 7.93539 6.70782 7.68618 6.21863 7.197L0.20075 1.17912C-0.0669166 0.91145 -0.0669166 0.468416 0.20075 0.20075C0.468416 -0.0669166 0.911451 -0.0669166 1.17912 0.20075L7.197 6.21863C7.64003 6.66167 8.35997 6.66167 8.803 6.21863L14.8209 0.20075C15.0885 -0.0669166 15.5316 -0.0669166 15.7992 0.20075C16.0669 0.468416 16.0669 0.91145 15.7992 1.17912L9.78137 7.197C9.29218 7.68618 8.64609 7.93539 8 7.93539Z' />
      </svg>
    </button>
  );
}

export default Arrow;
