import React, { useState, useRef, useEffect } from 'react';
import Arrow from '../../../features/ui/arrow/Arrow';
import styles from './SingleSelect.module.css';

export interface Option {
  label: string;
  value: string;
}

interface SingleSelectProps {
  options: Option[];
  onChange?: (value: string) => void;
  initialValue?: string;
}

const SingleSelect: React.FC<SingleSelectProps> = ({
  options,
  onChange,
  initialValue = 'Не указан',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string>(initialValue);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setIsOpen(false);
    onChange?.(value);
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleToggle();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(value);
    }
  };

  const handleArrowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      handleToggle();
    }
  };

  const selectedOption = options.find((option) => option.value === selectedValue);
  const displayValue = selectedOption?.label ?? selectedValue;
  const isValueSelected = selectedValue !== initialValue && selectedOption !== undefined;

  return (
    <div className={`${styles.selectContainer} ${isOpen ? styles.open : ''}`} ref={selectRef}>
      <div
        className={`${styles.selectField}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role='button'
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
      >
        <span
          className={`${styles.selectValue} ${isValueSelected ? styles.selectValueSelected : ''}`}
        >
          {displayValue}
        </span>
        <div
          className={styles.arrowWrapper}
          onClick={handleArrowClick}
          onKeyDown={handleArrowKeyDown}
          role='button'
          tabIndex={0}
        >
          <Arrow key={isOpen ? 'open' : 'closed'} defaultActive={isOpen} />
        </div>
      </div>
      {isOpen && (
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
