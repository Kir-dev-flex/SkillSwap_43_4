/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from 'react';
import Arrow from '../../../features/ui/arrow/Arrow';

import styles from './InputWithCalendar.module.css';

/**
 * Пропсы для кастомных селектов месяца и года
 */
interface CustomMonthYearDropdownsProps {
  date: Date;
  changeYear: (year: number) => void;
  changeMonth: (month: number) => void;
}

/**
 * CustomMonthYearDropdowns - Кастомные селекты месяца и года
 * @param {CustomMonthYearDropdownsProps} props - Свойства компонента
 * @returns {JSX.Element} Кастомные селекты месяца и года
 */
const CustomMonthYearDropdowns: React.FC<CustomMonthYearDropdownsProps> = ({
  date,
  changeYear,
  changeMonth,
}) => {
  const months = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 101 }, (_, i) => currentYear - 50 + i);

  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);

  const monthRef = useRef<HTMLDivElement>(null);
  const yearRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthRef.current && !monthRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (yearRef.current && !yearRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentMonth = months[date.getMonth()];
  const currentYearValue = date.getFullYear();

  return (
    <div className={styles.customHeader}>
      {/* Селект месяца */}
      <div data-target='month' ref={monthRef} style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            userSelect: 'none' as const,
          }}
          onClick={() => {
            setIsMonthOpen(!isMonthOpen);
            setIsYearOpen(false);
          }}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsMonthOpen(!isMonthOpen);
              setIsYearOpen(false);
            }
          }}
          aria-label={`Выбрать месяц. Текущий: ${currentMonth}`}
          aria-expanded={isMonthOpen}
        >
          <span
            style={{
              fontFamily: 'var(--font-family-roboto)',
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text)',
            }}
          >
            {currentMonth}
          </span>
          <Arrow
            defaultActive={isMonthOpen}
            onChange={setIsMonthOpen}
            width={12}
            height={12}
            fill='var(--color-text)'
          />
        </div>

        {/* Выпадающий список месяцев */}
        {isMonthOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-caption)',
              borderRadius: 'var(--border-radius-lg)',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {months.map((month, index) => (
              <div
                key={month}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family-roboto)',
                  fontSize: 'var(--font-size-body)',
                  color: date.getMonth() === index ? 'var(--color-text)' : 'var(--color-text)',
                  backgroundColor:
                    date.getMonth() === index ? 'var(--color-accent)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
                onClick={() => {
                  changeMonth(index);
                  setIsMonthOpen(false);
                }}
                onMouseEnter={(e) => {
                  if (date.getMonth() !== index) {
                    e.currentTarget.style.backgroundColor = 'var(--color-button-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (date.getMonth() !== index) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {month}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Селект года */}
      <div ref={yearRef} style={{ position: 'relative' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            userSelect: 'none' as const,
          }}
          onClick={() => {
            setIsYearOpen(!isYearOpen);
            setIsMonthOpen(false);
          }}
          role='button'
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsYearOpen(!isYearOpen);
              setIsMonthOpen(false);
            }
          }}
          aria-label={`Выбрать год. Текущий: ${currentYearValue}`}
          aria-expanded={isYearOpen}
        >
          <span
            style={{
              fontFamily: 'var(--font-family-roboto)',
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text)',
            }}
          >
            {currentYearValue}
          </span>
          <Arrow
            defaultActive={isYearOpen}
            onChange={setIsYearOpen}
            width={12}
            height={12}
            fill='var(--color-text)'
          />
        </div>

        {/* Выпадающий список годов */}
        {isYearOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-caption)',
              borderRadius: 'var(--border-radius-lg)',
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto',
            }}
          >
            {years.map((year) => (
              <div
                key={year}
                style={{
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-family-roboto)',
                  fontSize: 'var(--font-size-body)',
                  textAlign: 'center',
                  color: date.getFullYear() === year ? 'var(--color-text)' : 'var(--color-text)',
                  backgroundColor:
                    date.getFullYear() === year ? 'var(--color-accent)' : 'transparent',
                  transition: 'background-color 0.2s ease',
                }}
                onClick={() => {
                  changeYear(year);
                  setIsYearOpen(false);
                }}
                onMouseEnter={(e) => {
                  if (date.getFullYear() !== year) {
                    e.currentTarget.style.backgroundColor = 'var(--color-button-hover)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (date.getFullYear() !== year) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {year}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomMonthYearDropdowns;
