import { useState, useEffect } from 'react';
import style from './FavoritesPage.module.css';
import Header from '../../widgets/header/Header';
import { UserCard } from '../../features/ui/UserCard/UserCard';
import { User, Like } from '../../types';
import { TSkills } from '../../features/ui/UserCard/types';
import { TagCategory } from '../../features/ui/tag/types';
import Footer from '../../widgets/footer/Footer';
import { useAppState } from '../../shared/hooks/storeHooks';
import { getLikesByUserId, getUserById } from '../../api/mockApi';

const categoryToTag: Record<number, TagCategory> = {
  1: 'business',
  2: 'art',
  3: 'language',
  4: 'education',
  5: 'home',
  6: 'health',
};

export default function FavoritesPage() {
  const { cities, categories } = useAppState();
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Для теста используем userId = 1
  // В будущем можно использовать: const currentUserId = user?.id || 1;
  const currentUserId = 1;

  useEffect(() => {
    const loadLikedUsers = async () => {
      try {
        setLoading(true);
        // Получаем лайки текущего пользователя
        let likes: Like[] = [];
        try {
          likes = await getLikesByUserId(currentUserId);
        } catch (error) {
          // Если API не работает, загружаем напрямую из файла
          try {
            const response = await fetch('/db/likes.json');
            const data = await response.json();
            const allLikes = Array.isArray(data.likes) ? data.likes : [];
            likes = allLikes.filter((like: Like) => like.userId === currentUserId);
          } catch (fetchError) {
            // eslint-disable-next-line no-console
            console.error('Ошибка при загрузке лайков:', fetchError);
          }
        }

        // Получаем пользователей по likedUserId
        const likedUserIds = likes.map((like) => like.likedUserId);
        const uniqueLikedUserIds = [...new Set(likedUserIds)];

        // Загружаем данные о каждом лайкнутом пользователе
        const usersData = await Promise.all(
          uniqueLikedUserIds.map((userId) => getUserById(userId))
        );

        // Фильтруем null значения
        const validUsers = usersData.filter((user): user is User => user !== null);
        setLikedUsers(validUsers);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Ошибка при загрузке лайкнутых пользователей:', error);
        setLikedUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadLikedUsers();
  }, [currentUserId]);

  const userCardData = (user: User) => {
    const city = cities.find((c) => c.id === user.location)?.name || 'Не указан';
    let teach: TSkills[] = [];
    let learn: TSkills[] = [];

    if (user.skillCanTeach) {
      const match = categories
        .flatMap((cat) =>
          cat.subcategories.map((sub) => ({
            categoryId: cat.id,
            subcategoryName: sub.name,
            subcategoryId: sub.id,
          }))
        )
        .find((item) => item.subcategoryId === user.skillCanTeach);

      if (match) {
        const tagCategory = categoryToTag[match.categoryId] || 'education';
        teach = [{ title: match.subcategoryName, category: tagCategory }];
      }
    }

    if (user.subcategoriesWantToLearn) {
      learn = user.subcategoriesWantToLearn
        .map((subId) => {
          const match = categories
            .flatMap((cat) =>
              cat.subcategories.map((sub) => ({
                categoryId: cat.id,
                subcategoryName: sub.name,
                subcategoryId: sub.id,
              }))
            )
            .find((item) => item.subcategoryId === subId);

          if (match) {
            const tagCategory = categoryToTag[match.categoryId] || 'education';
            return { title: match.subcategoryName, category: tagCategory };
          }
          return null;
        })
        .filter(Boolean) as TSkills[];
    }

    const MAX_LEARN_TAGS = 2;

    let displayedLearn = learn;
    let extraCount = 0;

    if (learn.length > MAX_LEARN_TAGS) {
      displayedLearn = learn.slice(0, MAX_LEARN_TAGS);
      extraCount = learn.length - MAX_LEARN_TAGS;
    }

    return {
      avatar: user.avatarUrl,
      name: user.name,
      city,
      age: user.age || 0,
      about: '',
      teach,
      learn: displayedLearn,
      extraLearnCount: extraCount,
    };
  };

  return (
    <div className={style.page}>
      <Header />
      <div className={style.wrapper}>
        <main className={style.main}>
          <section className={style.section}>
            <div className={style.header}>
              <h1 className={style.caption}>Ваши лайки</h1>
            </div>
            {loading && <div className={style.loading}>Загрузка...</div>}
            {!loading && likedUsers.length === 0 && (
              <div className={style.empty}>У вас пока нет лайков</div>
            )}
            {!loading && likedUsers.length > 0 && (
              <div className={style.cards}>
                {likedUsers.map((user) => (
                  <UserCard
                    key={user.id}
                    likedState
                    userData={userCardData(user)}
                    isDetail={false}
                    onClickLiked={() => {
                      // Обработка снятия лайка
                    }}
                    onClickDetail={() => {
                      // Переход на детальную страницу пользователя
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}
