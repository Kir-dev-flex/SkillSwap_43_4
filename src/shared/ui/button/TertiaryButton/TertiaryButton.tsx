import { FC } from 'react';
import clsx from 'clsx';
import { TertiaryButtonProps } from '../types';

import styles from './TertiaryButton.module.css';

/**
 * TertiaryButton - третичная кнопка
 * @param {TertiaryButtonProps} props - Свойства кнопки
 * @returns {JSX.Element} Кнопка
 */
const TertiaryButton: FC<TertiaryButtonProps> = ({
  label,
  className,
  disabled = false,
  ...props
}) => (
  <button
    type='button'
    className={clsx(styles.button, { [styles.disabled]: disabled }, className)}
    disabled={disabled}
    {...props}
  >
    {label}
  </button>
);

export default TertiaryButton;
