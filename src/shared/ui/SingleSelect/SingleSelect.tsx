// SingleSelect.tsx
import React, { useState, useRef, useEffect } from 'react';
import Arrow from '../../../features/ui/arrow/Arrow';
import styles from './SingleSelect.module.css';

export interface Option {
  label: string;
  value: string;
}

interface SingleSelectProps {
  id?: string;
  options: Option[];
  onChange?: (value: string) => void;
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  id,
  options,
  onChange,
  initialValue,
  placeholder = 'Выберите значение',
  disabled = false,
  error = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(initialValue ?? null);
  const selectedOption = options.find((option) => option.value === selectedValue);

  const isValueSelected = Boolean(selectedOption);

  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (disabled && isOpen) {
      setIsOpen(false);
    }
  }, [disabled, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen && !disabled) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, disabled]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (value: string) => {
    if (!disabled) {
      setSelectedValue(value);
      setIsOpen(false);
      onChange?.(value);
    }
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      handleToggle();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, value: string) => {
    if (!disabled) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleSelect(value);
      }
    }
  };

  const handleArrowKeyDown = (e: React.KeyboardEvent) => {
    if (!disabled) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        e.stopPropagation();
        handleToggle();
      }
    }
  };

  const displayValue = selectedOption ? selectedOption.label : placeholder;

  return (
    <div
      id={id}
      className={`${styles.selectContainer} ${isOpen ? styles.open : ''} ${
        disabled ? styles.disabled : ''
      } ${error ? styles.error : ''}`}
      ref={selectRef}
    >
      <div
        className={`${styles.selectField} ${disabled ? styles.selectFieldDisabled : ''} ${
          error ? styles.selectFieldError : ''
        }`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role='button'
        tabIndex={disabled ? -1 : 0}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        aria-disabled={disabled}
      >
        <span
          className={`${styles.selectValue} ${
            isValueSelected ? styles.selectValueSelected : styles.placeholder
          }`}
        >
          {displayValue}
        </span>

        <Arrow defaultActive={isOpen} onChange={(newState) => setIsOpen(newState)} />
      </div>
      {isOpen && !disabled && (
        <div className={styles.dropdown} role='listbox'>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${
                selectedValue === option.value ? styles.optionSelected : ''
              }`}
              onClick={() => handleSelect(option.value)}
              onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
              role='option'
              tabIndex={0}
              aria-selected={selectedValue === option.value}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleSelect;
