import React, { useState, useRef, useEffect } from 'react';
import Arrow from '../../features/ui/arrow/Arrow';
import styles from './ProfilePage.module.css';

export interface CityOption {
  label: string;
  value: string;
}

interface CityInputProps {
  id?: string;
  options: CityOption[];
  onChange?: (value: string) => void;
  value?: string;
}

const CityInput: React.FC<CityInputProps> = ({ id, options, onChange, value = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState<CityOption[]>(options);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);

    // Фильтруем опции по введенному тексту
    if (newValue) {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(newValue.toLowerCase())
      );
      setFilteredOptions(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredOptions(options);
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    setFilteredOptions(options);
    setIsOpen(true);
  };

  const handleSelect = (option: CityOption) => {
    setInputValue(option.label);
    setIsOpen(false);
    onChange?.(option.label);
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
    if (!isOpen) {
      setFilteredOptions(options);
    }
  };

  const handleArrowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen);
      if (!isOpen) {
        setFilteredOptions(options);
      }
    }
  };

  return (
    <div ref={containerRef} className={styles.cityInputContainer}>
      <div className={styles.cityInputField}>
        <input
          id={id}
          type='text'
          className={styles.cityInput}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder='Введите город'
          aria-label='Город'
        />
        <div
          className={styles.cityInputArrow}
          onClick={handleArrowClick}
          onKeyDown={handleArrowKeyDown}
          role='button'
          tabIndex={0}
          aria-label='Открыть список городов'
        >
          <Arrow key={isOpen ? 'open' : 'closed'} defaultActive={isOpen} />
        </div>
      </div>
      {isOpen && filteredOptions.length > 0 && (
        <div className={styles.cityInputDropdown}>
          {filteredOptions.map((option) => (
            <div
              key={option.value}
              className={styles.cityInputOption}
              onClick={() => handleSelect(option)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSelect(option);
                }
              }}
              role='option'
              tabIndex={0}
              aria-selected={inputValue === option.label}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityInput;
