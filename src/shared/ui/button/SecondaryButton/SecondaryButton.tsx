import { FC } from 'react';
import clsx from 'clsx';
import { ButtonProps } from '../types';

import styles from './SecondaryButton.module.css';

/**
 * SecondaryButton - вторичная кнопка
 * @param {ButtonProps} props - Свойства кнопки
 * @returns {JSX.Element} Кнопка
 */
const SecondaryButton: FC<ButtonProps> = ({
  label,
  icon,
  iconPosition = 'left',
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
    {icon && iconPosition === 'left' && <span className={styles.iconLeft}>{icon}</span>}
    <span className={styles.label}>{label}</span>
    {icon && iconPosition === 'right' && <span className={styles.iconRight}>{icon}</span>}
  </button>
);

export default SecondaryButton;
