import React from 'react';
import style from './checkbox.module.css';

interface Props {
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  labelText?: string;
  icon?: 'check' | 'minus';
  id?: string;
}

function Checkbox({ checked, onChange, labelText = '', icon = 'check', id = 'checkbox' }: Props) {
  const emptyIcon = () => (
    <svg width='24' height='24' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M7.20898 0.5H12.791C15.259 0.500045 16.9008 1.0297 17.9355 2.06445C18.9703 3.09921 19.5 4.74098 19.5 7.20898V12.791C19.5 15.259 18.9703 16.9008 17.9355 17.9355C16.9008 18.9703 15.259 19.5 12.791 19.5H7.20898C4.74098 19.5 3.09921 18.9703 2.06445 17.9355C1.0297 16.9008 0.500045 15.259 0.5 12.791V7.20898C0.500045 4.74098 1.0297 3.09921 2.06445 2.06445C3.09921 1.0297 4.74098 0.500045 7.20898 0.5ZM7.20898 0.895508C5.02968 0.895545 3.40359 1.27805 2.34082 2.34082C1.27805 3.40359 0.895545 5.02968 0.895508 7.20898V12.791C0.895545 14.9703 1.27805 16.5964 2.34082 17.6592C3.40359 18.7219 5.02968 19.1045 7.20898 19.1045H12.791C14.9703 19.1045 16.5964 18.7219 17.6592 17.6592C18.7219 16.5964 19.1045 14.9703 19.1045 12.791V7.20898C19.1045 5.02968 18.7219 3.40359 17.6592 2.34082C16.5964 1.27805 14.9703 0.895545 12.791 0.895508H7.20898Z'
        fill='#253017'
        stroke='black'
      />
    </svg>
  );

  const checkedIcon = () => {
    switch (icon) {
      case 'minus':
        return (
          <svg
            width='24'
            height='24'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12.791 0C17.8418 9.04587e-05 19.9999 2.15815 20 7.20898V12.791C19.9999 17.8418 17.8418 19.9999 12.791 20H7.20898C2.15815 19.9999 9.04602e-05 17.8418 0 12.791V7.20898C9.06199e-05 2.15816 2.15816 9.06214e-05 7.20898 0H12.791ZM6 9.25C5.59 9.25 5.25 9.59 5.25 10C5.25 10.41 5.59 10.75 6 10.75H14C14.41 10.75 14.75 10.41 14.75 10C14.75 9.59 14.41 9.25 14 9.25H6Z'
              fill='#ABD27A'
            />
          </svg>
        );
      case 'check':
      default:
        return (
          <svg
            width='24'
            height='24'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M12.791 0C17.8418 9.04587e-05 19.9999 2.15815 20 7.20898V12.791C19.9999 17.8418 17.8418 19.9999 12.791 20H7.20898C2.15815 19.9999 9.04602e-05 17.8418 0 12.791V7.20898C9.06199e-05 2.15816 2.15816 9.06214e-05 7.20898 0H12.791ZM14.7803 6.62988C14.4903 6.33988 14.0097 6.33988 13.7197 6.62988L8.58008 11.7695L6.28027 9.46973C5.99028 9.17973 5.50973 9.17974 5.21973 9.46973C4.92973 9.75973 4.92973 10.2403 5.21973 10.5303L8.0498 13.3604C8.18979 13.5003 8.38013 13.5801 8.58008 13.5801C8.78003 13.58 8.97038 13.5003 9.11035 13.3604L14.7803 7.69043C15.0702 7.40047 15.0702 6.9199 14.7803 6.62988Z'
              fill='#ABD27A'
            />
          </svg>
        );
    }
  };

  const handleLabelClick = (e: React.MouseEvent) => {
    // Останавливаем всплытие, чтобы не срабатывал onClick на родительском элементе
    e.stopPropagation();
    // Поскольку input скрыт, обрабатываем клик вручную
    const syntheticEvent = {
      target: { checked: !checked },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  const handleLabelKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      const syntheticEvent = {
        target: { checked: !checked },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  return (
    <label
      className={style.wrapper}
      htmlFor={id}
      onClick={handleLabelClick}
      onKeyDown={handleLabelKeyDown}
      tabIndex={0}
    >
      <input
        type='checkbox'
        id={id}
        className={style.input}
        checked={checked}
        onChange={onChange}
      />
      <span className={style.icon} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
        {checked ? checkedIcon() : emptyIcon()}
      </span>
      {labelText && <span className={style.label}>{labelText}</span>}
    </label>
  );
}

export default Checkbox;
