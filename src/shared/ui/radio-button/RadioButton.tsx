import React, { ChangeEvent, KeyboardEvent } from 'react';

import styles from './RadioButton.module.css';

/**
 * Интерфейс пропсов компонента RadioButton
 */
interface RadioButtonProps {
  checked: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
  label?: string;
  name: string;
  value: string;
}

/**
 * Компонент RadioButton
 * @param checked - Состояние выбора
 * @param onChange - Функция при изменении
 * @param disabled - Неактивное состояние
 * @param label - Текст radio кнопки
 * @param name - Имя группы radio кнопок
 * @param value - Значение radio кнопки
 */
const RadioButton: React.FC<RadioButtonProps> = ({
  checked,
  onChange,
  disabled = false,
  label,
  name,
  value,
}) => {
  const handleClick = () => {
    if (!disabled && onChange) {
      onChange(value);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!disabled && onChange && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onChange(value);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!disabled && onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div
      className={`
        ${styles['radio-button']}
      `}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={disabled ? -1 : 0}
      role='radio'
      aria-checked={checked}
      aria-disabled={disabled}
      aria-label={`Radio button ${value}`}
      style={{ cursor: 'pointer' }}
    >
      <div className={styles['radio-button__icon']}>
        {checked ? (
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              d='M12 22C6.48372 22 2 17.5163 2 12C2 6.48372 6.48372 2 12 2C17.5163 2 22 6.48372 22 12C22 17.5163 17.5163 22 12 22ZM12 3.39535C7.25581 3.39535 3.39535 7.25581 3.39535 12C3.39535 16.7442 7.25581 20.6047 12 20.6047C16.7442 20.6047 20.6047 16.7442 20.6047 12C20.6047 7.25581 16.7442 3.39535 12 3.39535Z'
              fill='#508826'
            />
            <circle cx='12' cy='12' r='5' fill='#508826' />
          </svg>
        ) : (
          <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            aria-hidden='true'
          >
            <path
              d='M12 2.5C17.2401 2.5 21.5 6.75986 21.5 12C21.5 17.2401 17.2401 21.5 12 21.5C6.75986 21.5 2.5 17.2401 2.5 12C2.5 6.75986 6.75986 2.5 12 2.5ZM12 2.89551C6.97967 2.89551 2.89551 6.97967 2.89551 12C2.89551 17.0203 6.97967 21.1045 12 21.1045C17.0203 21.1045 21.1045 17.0203 21.1045 12C21.1045 6.97967 17.0203 2.89551 12 2.89551Z'
              fill='#253017'
              stroke='black'
            />
          </svg>
        )}
      </div>

      {label && (
        <label className={styles['radio-button__label']} htmlFor={`${name}-${value}`}>
          <input
            type='radio'
            checked={checked}
            onChange={handleInputChange}
            disabled={disabled}
            className={styles.input}
            name={name}
            value={value}
          />
          {label}
        </label>
      )}
    </div>
  );
};

export default RadioButton;
