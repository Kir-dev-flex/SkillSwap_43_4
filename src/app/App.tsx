import Header from '../widgets/header/Header';
import Footer from '../widgets/footer/Footer';
import NotificationItem from '../shared/ui/NotificationItem/NotificationItem';
import type { Notification } from '../types';

function App() {
  // Тестовые данные для проверки компонента
  const now = new Date();
  const oneMinuteAgo = new Date(now.getTime() - 30 * 1000); // 30 секунд назад
  const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000); // 10 минут назад
  const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 часа назад
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000); // вчера
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); // 3 дня назад

  const testNotifications: Notification[] = [
    {
      id: 1,
      type: 'exchange_accepted',
      title: 'Обмен принят',
      message: 'принял ваш обмен',
      relatedUserId: 1,
      skillId: 1,
      createdAt: oneMinuteAgo.toISOString(),
      isRead: false,
    },
    {
      id: 2,
      type: 'exchange_proposed',
      title: 'Предложен обмен',
      message: 'предлагает вам обмен',
      relatedUserId: 2,
      skillId: 2,
      createdAt: tenMinutesAgo.toISOString(),
      isRead: false,
    },
    {
      id: 3,
      type: 'exchange_accepted',
      title: 'Обмен принят',
      message: 'принял ваш обмен',
      relatedUserId: 3,
      skillId: 3,
      createdAt: twoHoursAgo.toISOString(),
      isRead: false,
    },
    {
      id: 4,
      type: 'exchange_proposed',
      title: 'Предложен обмен',
      message: 'предлагает вам обмен',
      relatedUserId: 4,
      skillId: 4,
      createdAt: yesterday.toISOString(),
      isRead: true,
    },
    {
      id: 5,
      type: 'exchange_declined',
      title: 'Обмен отклонён',
      message: 'отклонил ваш обмен',
      relatedUserId: 5,
      skillId: 5,
      createdAt: threeDaysAgo.toISOString(),
      isRead: true,
    },
  ];

  const handleNavigate = (link: string) => {
    console.log('Navigate to:', link);
  };

  return (
    <div className='app'>
      <Header />
      <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
        <h2
          style={{
            marginBottom: '20px',
            fontFamily: 'var(--font-family-jost)',
            fontSize: 'var(--font-size-h2)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: '28px',
            letterSpacing: 'var(--letter-spacing-title)',
            color: 'var(--color-text)',
          }}
        >
          Тестирование NotificationItem
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {testNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              userName={
                notification.id === 1
                  ? 'Николай'
                  : notification.id === 2
                    ? 'Татьяна'
                    : notification.id === 3
                      ? 'Игорь'
                      : notification.id === 4
                        ? 'Олег'
                        : 'Пользователь'
              }
              navigate={!notification.isRead ? handleNavigate : undefined}
            />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;