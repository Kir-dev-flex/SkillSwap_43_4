import { FC } from 'react';
import clsx from 'clsx';
import { PrimaryButtonProps } from '../types';

import styles from './PrimaryButton.module.css';

/**
 * PrimaryButton - основная кнопка
 * @param {PrimaryButtonProps} props - Свойства кнопки
 * @returns {JSX.Element} Кнопка
 */
const PrimaryButton: FC<PrimaryButtonProps> = ({
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

export default PrimaryButton;
