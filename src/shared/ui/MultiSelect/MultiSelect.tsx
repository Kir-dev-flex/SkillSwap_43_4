import React, { useState, useRef, useEffect } from 'react';
import Arrow from '../../../features/ui/arrow/Arrow';
import Checkbox from '../../../features/ui/checkbox/Checkbox';
import styles from './MultiSelect.module.css';

export interface Option {
  label: string;
  value: string;
}

interface MultiSelectProps {
  id?: string;
  options: Option[];
  onChange?: (value: string) => void;
  onBlur?: () => void;
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  maxSelections?: number;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  options,
  onChange,
  onBlur,
  initialValue = '',
  placeholder = 'Выберите опции',
  disabled = false,
  maxSelections = 5,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>(
    initialValue ? initialValue.split(',').filter(Boolean) : []
  );
  const selectRef = useRef<HTMLDivElement>(null);

  // Сбрасываем выбранные значения при изменении
  useEffect(() => {
    if (initialValue === '') {
      setSelectedValues([]);
    } else if (initialValue) {
      const newValues = initialValue.split(',').filter(Boolean);
      setSelectedValues(newValues);
    }
  }, [initialValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        if (isOpen) {
          setIsOpen(false);
          onBlur?.();
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onBlur]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleCheckboxChange = (value: string, checked: boolean) => {
    if (disabled) return;

    const newSelectedValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);

    // Проверяем лимит
    if (checked && newSelectedValues.length > maxSelections) {
      return;
    }

    setSelectedValues(newSelectedValues);
    onChange?.(newSelectedValues.join(','));
  };

  // const handleArrowClick = (e: React.MouseEvent) => {
  //   e.stopPropagation();
  //   handleToggle();
  // };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    } else if (e.key === 'Escape' && isOpen) {
      setIsOpen(false);
      onBlur?.();
    }
  };

  // const handleArrowKeyDown = (e: React.KeyboardEvent) => {
  //   if (e.key === 'Enter' || e.key === ' ') {
  //     e.preventDefault();
  //     e.stopPropagation();
  //     handleToggle();
  //   }
  // };

  const handleOptionKeyDown = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const isChecked = selectedValues.includes(value);
      handleCheckboxChange(value, !isChecked);
    }
  };

  const displayText = selectedValues.length > 0 ? `Выбрано: ${selectedValues.length}` : placeholder;

  const isValueSelected = selectedValues.length > 0;

  return (
    <div
      id={id}
      className={`${styles.selectContainer} ${isOpen ? styles.open : ''}`}
      ref={selectRef}
    >
      <div
        className={`${styles.selectField}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        role='button'
        tabIndex={0}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
        aria-disabled={disabled}
      >
        <span
          className={`${styles.selectValue} ${isValueSelected ? styles.selectValueSelected : ''}`}
        >
          {displayText}
        </span>

        <Arrow defaultActive={isOpen} onChange={(newState) => setIsOpen(newState)} />
      </div>
      {isOpen && (
        <div className={styles.dropdown} role='listbox'>
          {options.map((option) => {
            const isChecked = selectedValues.includes(option.value);
            const isDisabled = !isChecked && selectedValues.length >= maxSelections;
            return (
              <div
                key={option.value}
                className={`${styles.option} ${isChecked ? styles.optionSelected : ''}`}
                onClick={
                  isDisabled ? undefined : () => handleCheckboxChange(option.value, !isChecked)
                }
                onKeyDown={isDisabled ? undefined : (e) => handleOptionKeyDown(e, option.value)}
                role='option'
                tabIndex={0}
                aria-selected={isChecked}
                aria-disabled={isDisabled}
              >
                <Checkbox
                  checked={isChecked}
                  onChange={(e) => {
                    // e.stopPropagation();
                    handleCheckboxChange(option.value, e.target.checked);
                  }}
                  id={`multiselect-${option.value}`}
                />
                <span className={styles.optionLabel}>{option.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
