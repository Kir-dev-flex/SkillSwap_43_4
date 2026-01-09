import { useState, useEffect } from 'react';
import style from './Home.module.css';
import Header from '@/widgets/header/Header';
import Arrow from '@/features/ui/arrow/Arrow';
import UserCard from '@/features/ui/UserCard/UserCard';
import { User, Skill, City } from '../../types';
import RadioButton from '@/shared/ui/radio-button/RadioButton';
import Checkbox from '@/features/ui/checkbox/Checkbox';
import Footer from '@/widgets/footer/Footer';

// API
import {
  getUsers,
  getSkills,
  getCategories,
  getCities,
  getLikes
} from '../../api/mockApi';

export default function Home() {
  const [popularUsers, setPopularUsers] = useState<User[]>([]);
  const [newUsers, setNewUsers] = useState<User[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<User[]>([]);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);

  // скрытые карточки
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllNew, setShowAllNew] = useState(false);
  const [showAllRecommended, setShowAllRecommended] = useState(false);

  const userCardData = (user: User) => {
    return {
      avatar: user.avatarUrl,
      name: user.name,
      city: user.location,
      age: user.age || 0,
      about: '',
      teach: [],
      learn: []
    };
  };

  const renderUserCards = (users: User[], showAll: boolean) => {
    const visibleCount = 3;
    const usersToShow = showAll ? users : users.slice(0, visibleCount);

    return usersToShow.map(user => (
      <UserCard
        key={user.id}
        likedState={false}
        userData={userCardData(user)}
        isDetail={false}
        onClickLiked={() => console.log('Liked:', user.id)}
        onClickDetail={() => console.log('Detail:', user.id)}
      />
    ));
  };

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        const [usersResponse, skillsResponse, categoriesResponse, citiesResponse, likesResponse] =
          await Promise.all([
            getUsers(),
            getSkills(),
            getCategories(),
            getCities(),
            getLikes()
          ]);

        const extractArray = (response: any): any[] => {
          if (Array.isArray(response)) return response;
          if (response && typeof response === 'object') {
            const keys = ['data', 'users', 'skills', 'categories', 'cities', 'likes', 'items', 'results'];
            for (const key of keys) {
              if (Array.isArray(response[key])) return response[key];
            }
          }
          return [];
        };

        const users = extractArray(usersResponse) as User[];
        const skills = extractArray(skillsResponse) as Skill[];
        const categories = extractArray(categoriesResponse);
        const cities = extractArray(citiesResponse) as City[];
        const likes = extractArray(likesResponse);

        console.log('Загружено:', {
          usersCount: users.length,
          usersSample: users.slice(0, 3),
          skillsCount: skills.length,
          categoriesCount: categories.length,
          citiesCount: cities.length,
          likesCount: likes.length
        });

        // Популярное - случайные 6 пользователей
        const shuffled = [...users].sort(() => Math.random() - 0.5);
        setPopularUsers(shuffled.slice(0, 6));

        // Новое - сортируем по id (больше id = новее)
        const sortedByNew = [...users].sort((a, b) => (b.id || 0) - (a.id || 0));
        setNewUsers(sortedByNew.slice(0, 6));

        // Рекомендуем - первые 12 пользователей
        setRecommendedUsers(users.slice(0, 12));

        setAllSkills(skills);

        setAllCities(cities);

      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    loadData();
  }, []);

  return (
    <div className={style.page}>
      <Header />
      <div className={style.wrapper}>
        {/* Фильтры */}
        <aside className={style.filters}>
          <div className={style.filter}>
            <h2 className={style.title}>Фильтры</h2>
            <div className={style.group}>
              <RadioButton
                checked={true}
                onChange={() => {}}
                name="contentType"
                value="all"
                label="Всё"
              />
              <RadioButton
                checked={false}
                onChange={() => {}}
                name="contentType"
                value="learn"
                label="Хочу научиться"
              />
              <RadioButton
                checked={false}
                onChange={() => {}}
                name="contentType"
                value="teach"
                label="Могу научить"
              />
            </div>
          </div>

          <div className={style.filter}>
            <h3 className={style.subtitle}>Навыки</h3>
            <div className={style.group}>
              {allSkills.slice(0, 6).map((skill, i) => (
                <Checkbox
                  key={skill?.id || i}
                  checked={false}
                  onChange={() => {}}
                  labelText={skill?.title || `Навык ${i + 1}`}
                />
              ))}
              <div className={style.open}>
                <h4>Все категории</h4>
                <Arrow />
              </div>
            </div>
          </div>

          <div className={style.filter}>
            <h3 className={style.subtitle}>Пол автора</h3>
            <div className={style.group}>
              <RadioButton
                checked={true}
                onChange={() => {}}
                name="gender"
                value="any"
                label="Не имеет значения"
              />
              <RadioButton
                checked={false}
                onChange={() => {}}
                name="gender"
                value="male"
                label="Мужской"
              />
              <RadioButton
                checked={false}
                onChange={() => {}}
                name="gender"
                value="female"
                label="Женский"
              />
            </div>
          </div>

          <div className={style.filter}>
            <h3 className={style.subtitle}>Город</h3>
            <div className={style.group}>
              {allCities.slice(0, 6).map((city, i) => (
                <Checkbox
                  key={city?.id || i}
                  checked={false}
                  onChange={() => {}}
                  labelText={city?.name || `Город ${i + 1}`}
                />
              ))}
              <div className={style.open}>
                <h4>Все города</h4>
                <Arrow />
              </div>
            </div>
          </div>
        </aside>

        {/* Основной контент */}
        <main className={style.main}>
          {/* Популярное */}
          <section className={style.section}>
            <div className={style.header}>
              <h1 className={style.caption}>Популярное</h1>
              <button
                className={style.button}
                onClick={() => setShowAllPopular(!showAllPopular)}
              >
                Смотреть все
                <Arrow />
              </button>
            </div>
            <div className={style.cards}>
              {renderUserCards(popularUsers, showAllPopular)}
            </div>
          </section>

          {/* Новое */}
          <section className={style.section}>
            <div className={style.header}>
              <h1 className={style.caption}>Новое</h1>
              <button
                className={style.button}
                onClick={() => setShowAllNew(!showAllNew)}
              >
                Смотреть все
                <Arrow />
              </button>
            </div>
            <div className={style.cards}>
              {renderUserCards(newUsers, showAllNew)}
            </div>
          </section>

          {/* Рекомендуем */}
          <section className={style.section}>
            <div className={style.header}>
              <h1 className={style.caption}>Рекомендуем</h1>
              <button
                className={style.button}
                onClick={() => setShowAllRecommended(!showAllRecommended)}
              >
                Смотреть все
                <Arrow />
              </button>
            </div>
            <div className={style.cards}>
              {renderUserCards(recommendedUsers, showAllRecommended)}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
