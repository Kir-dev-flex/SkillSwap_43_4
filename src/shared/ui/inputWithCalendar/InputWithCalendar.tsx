import { ru } from 'date-fns/locale/ru';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import PrimaryButton from '../button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../button/SecondaryButton/SecondaryButton';

import CustomMonthYearDropdowns from './CustomMonthYearDropdowns';
import CalendarIcon from './icons/CalendarIcon';

import styles from './InputWithCalendar.module.css';

registerLocale('ru', ru);

/**
 * Интерфейс пропсов компонента InputWithCalendar
 */
interface InputWithCalendarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  onChange: (date: Date | null) => void;
  value?: Date | null;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

interface CalendarContainerProps {
  className?: string;
  children: React.ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  isOpen: boolean;
}

const CalendarContainer: React.FC<CalendarContainerProps> = ({
  className,
  children,
  onCancel,
  onConfirm,
  isOpen,
}) => (
  <div className={`${className} ${styles.calendar}`}>
    {children}
    {isOpen && (
      <div className={styles.buttonContainer}>
        <SecondaryButton label='Отменить' onClick={onCancel} />
        <PrimaryButton label='Выбрать' onClick={onConfirm} />
      </div>
    )}
  </div>
);

CalendarContainer.displayName = 'CalendarContainer';

/**
 * InputWithCalendar - компонент поля ввода с календарем
 * @param {InputWithCalendarProps} props - Свойства компонента
 * @returns {JSX.Element} Компонент поля ввода с календарем
 */
const InputWithCalendar: React.FC<InputWithCalendarProps> = ({
  isOpen,
  onToggle,
  onChange,
  value,
  placeholder = 'дд.мм.гггг',
  disabled = false,
  className,
  error = false,
  ...restProps
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(value || null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(isOpen);
  const datePickerRef = useRef<DatePicker | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsCalendarOpen(isOpen);
  }, [isOpen]);

  const handleInputClick = useCallback(() => {
    if (disabled) return;

    const newState = !isCalendarOpen;
    setIsCalendarOpen(newState);
    onToggle(newState);
    if (newState && datePickerRef.current) {
      setTimeout(() => {
        datePickerRef.current?.setFocus();
      }, 0);
    }
  }, [disabled, isCalendarOpen, onToggle]);

  const handleDateChange = useCallback((date: Date | null) => {
    setSelectedDate(date);
  }, []);

  const handleConfirm = useCallback(() => {
    onChange(selectedDate);
    setIsCalendarOpen(false);
    onToggle(false);
  }, [onChange, selectedDate, onToggle]);

  const handleCancel = useCallback(() => {
    setSelectedDate(value || null);
    setIsCalendarOpen(false);
    onToggle(false);
  }, [value, onToggle]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;

      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleInputClick();
      }
    },
    [disabled, handleInputClick]
  );

  const handleInputKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
  }, []);

  const formatWeekDay = useCallback((nameOfDay: string): string => {
    const lowerName = nameOfDay.toLowerCase();
    const dayMap: Record<string, string> = {
      пн: 'Пн',
      вт: 'Вт',
      ср: 'Ср',
      чт: 'Чт',
      пт: 'Пт',
      сб: 'Сб',
      вс: 'Вс',
      mon: 'Пн',
      tue: 'Вт',
      wed: 'Ср',
      thu: 'Чт',
      fri: 'Пт',
      sat: 'Сб',
      sun: 'Вс',
      понедельник: 'Пн',
      вторник: 'Вт',
      среда: 'Ср',
      четверг: 'Чт',
      пятница: 'Пт',
      суббота: 'Сб',
      воскресенье: 'Вс',
    };

    if (dayMap[lowerName]) {
      return dayMap[lowerName];
    }

    const firstTwo = lowerName.substring(0, 2);
    if (dayMap[firstTwo]) {
      return dayMap[firstTwo];
    }

    const firstThree = lowerName.substring(0, 3);
    if (dayMap[firstThree]) {
      return dayMap[firstThree];
    }

    return nameOfDay.substring(0, 2);
  }, []);

  const formatDate = useCallback((date: Date | null): string => {
    if (!date) return '';
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }, []);

  const calendarContainerWrapper = useCallback(
    (containerProps: CalendarContainerProps) => (
      <CalendarContainer
        {...containerProps}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        isOpen={isCalendarOpen}
      />
    ),
    [handleCancel, handleConfirm, isCalendarOpen]
  );

  return (
    <div className={styles.container}>
      <p className={styles.textContainer}>Дата рождения</p>

      <DatePicker
        ref={datePickerRef}
        selected={selectedDate}
        onChange={handleDateChange}
        onInputClick={handleInputClick}
        open={isCalendarOpen}
        onClickOutside={handleCancel}
        locale='ru'
        // showMonthDropdown
        // showYearDropdown
        renderCustomHeader={({ date, changeYear, changeMonth }) => (
          <CustomMonthYearDropdowns date={date} changeYear={changeYear} changeMonth={changeMonth} />
        )}
        dropdownMode='select'
        popperClassName={styles.datePickerPopper}
        customInput={
          <div
            className={styles.inputContainer}
            onClick={handleInputClick}
            onKeyDown={handleKeyDown}
            role='button'
            tabIndex={disabled ? -1 : 0}
            aria-label={placeholder}
            aria-disabled={disabled}
            aria-expanded={isCalendarOpen}
          >
            <input
              ref={inputRef}
              type='text'
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              value={formatDate(selectedDate)}
              placeholder={placeholder}
              readOnly
              disabled={disabled}
              onKeyDown={handleInputKeyDown}
              aria-hidden='true'
              {...restProps}
            />
            <div className={styles.iconContainer}>
              <CalendarIcon />
            </div>
          </div>
        }
        calendarContainer={calendarContainerWrapper}
        calendarClassName={styles.calendar}
        dayClassName={() => styles.day}
        formatWeekDay={formatWeekDay}
      />
    </div>
  );
};

InputWithCalendar.displayName = 'InputWithCalendar';

export default InputWithCalendar;
