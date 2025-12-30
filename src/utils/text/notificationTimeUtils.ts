/**
 * Форматирует время уведомления в читаемый формат
 * @param createdAt - строка с датой создания уведомления (ISO format)
 * @returns отформатированная строка времени
 */
export const formatNotificationTime = (createdAt: string): string => {
  const now = new Date();
  const notificationDate = new Date(createdAt);
  const diffInMs = now.getTime() - notificationDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

  // "сейчас" -> меньше 1 минуты
  if (diffInMinutes < 1) {
    return 'сейчас';
  }

  // "N мин. назад" -> меньше часа
  if (diffInMinutes < 60) {
    return `${diffInMinutes} мин. назад`;
  }

  // Проверяем, сегодня ли это
  const isToday =
    notificationDate.getDate() === now.getDate() &&
    notificationDate.getMonth() === now.getMonth() &&
    notificationDate.getFullYear() === now.getFullYear();

  // "N ч. назад" -> сегодня
  if (isToday) {
    return `${diffInHours} ч. назад`;
  }

  // Проверяем, вчера ли это
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const isYesterday =
    notificationDate.getDate() === yesterday.getDate() &&
    notificationDate.getMonth() === yesterday.getMonth() &&
    notificationDate.getFullYear() === yesterday.getFullYear();

  // "вчера" -> вчера
  if (isYesterday) {
    return 'вчера';
  }

  // "ДД месяц" -> больше 2 дней (только дата без года)
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ];

  const day = notificationDate.getDate();
  const month = months[notificationDate.getMonth()];

  return `${day} ${month}`;
};

