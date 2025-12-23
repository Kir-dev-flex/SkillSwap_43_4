type AgeSuffix = 'год' | 'года' | 'лет';

/**
 * Определяет правильный суффикс для возраста
 * @param age - возраст
 * @returns суффикс
 */
const determineAgeSuffix = (age: number): AgeSuffix => {
  if (age < 0 || !Number.isInteger(age)) {
    return 'лет';
  }

  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return 'лет';
  }

  if (lastDigit === 1) {
    return 'год';
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return 'года';
  }

  return 'лет';
};

/**
 * Возвращает возраст с правильным окончанием
 * @param age - возраст
 * @returns строка с возрастом и правильным окончанием
 */
const getAgeWithSuffix = (age: number): string => {
  const suffix = determineAgeSuffix(age);
  return `${age} ${suffix}`;
};

/**
 * Форматирует возраст пользователя из исходных данных
 * @param rawAge - возраст
 * @returns отформатированный возраст с правильным окончанием
 */
export const formatUserAge = (rawAge: number): string => {
  if (typeof rawAge === 'number') {
    return getAgeWithSuffix(rawAge);
  }

  return 'Возраст не указан';
};
