import React, { useMemo, useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PrimaryButton from '../../shared/ui/button/PrimaryButton/PrimaryButton';
import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';
import { UserCard } from '../../features/ui/UserCard/UserCard';
import { DetailUserCard } from '../../features/ui/DetailUserCard/DetailUserCard';
import {
  getSkillWithOwnerInfo,
  getUsersBySkill,
  getCategories,
  getCities,
} from '../../api/mockApi';
import type { User, Skill, Category, City, ExpertUserWithSkill } from '../../types';
import type { TUserData } from '../../features/ui/UserCard/types';
import type { TagCategory } from '../../features/ui/tag/types';
import { useFavorites } from '../../shared/hooks/useFavorites';
import styles from './SkillPage.module.css';

/**
 * Компонент страницы навыка
 * @returns {JSX.Element} Страница навыка
 */
const SkillPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [skillData, setSkillData] = useState<{ skill: Skill; owner: User } | null>(null);
  const [similarOffers, setSimilarOffers] = useState<ExpertUserWithSkill[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const similarOffersListRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { isFavorite, toggleFavorite } = useFavorites();

  // Получаем id из URL параметров
  // Для тестирования: если id не указан, используем id=1 по умолчанию
  const currentId = useMemo(() => {
    try {
      const params = new URLSearchParams(location.search);
      const id = params.get('id');
      return id ? Number(id) : null; // Если нет такого айди, то null, а дальше будет страница с кнопкой "На главную"
    } catch {
      return null;
    }
  }, [location.search]);

  // Загружаем данные
  useEffect(() => {
    if (currentId === null) {
      setSkillData(null);
      setError('Предложение не найдено');
      setLoading(false);
      return;
    }
    const loadData = async () => {
      if (!currentId) {
        setError('ID навыка не указан');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Временно очищаем кеш для обновления данных
        localStorage.removeItem('mock_users');
        localStorage.removeItem('mock_skills');

        // Загружаем данные параллельно
        const [skillWithOwner, similarUsers, categoriesData, citiesData] = await Promise.all([
          getSkillWithOwnerInfo(currentId),
          getUsersBySkill(currentId),
          getCategories(),
          getCities(),
        ]);

        if (!skillWithOwner) {
          setError('Предложение не найдено');
          setLoading(false);
          return;
        }

        setSkillData(skillWithOwner);
        setSimilarOffers(similarUsers);
        setCategories(categoriesData);
        setCities(citiesData);
        // Similar offers count: similarUsers.length
      } catch (err) {
        setError('Ошибка при загрузке данных');
        // Error loading skill page data: err
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentId]);

  // Проверка возможности прокрутки
  const checkScrollability = () => {
    if (similarOffersListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = similarOffersListRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  // Обновляем состояние прокрутки при изменении similarOffers
  useEffect(() => {
    checkScrollability();
  }, [similarOffers]);

  // Обработчики для UserCard и DetailUserCard
  const handleUserCardLike = (userId: number) => {
    toggleFavorite(userId);
  };

  const handleUserCardDetail = (userId: number, skillId: number | null) => {
    // Подробнее о пользователе userId и навыке skillId
    if (skillId) {
      navigate(`/skill?id=${skillId}`);
    }

    // eslint-disable-next-line no-console
    console.log(userId);
  };

  const handleEdit = () => {
    // Редактировать навык
  };

  const handleDone = () => {
    // Готово
  };

  const handleOffer = () => {
    // Предложить обмен
  };

  // Функция для обрезки тегов с добавлением "+N"
  const truncateTags = (
    tags: Array<{ title: string; category: TagCategory }>,
    maxVisible: number = 2
  ): Array<{ title: string; category: TagCategory }> => {
    if (tags.length <= maxVisible) {
      return tags;
    }

    const visibleTags = tags.slice(0, maxVisible);
    const remainingCount = tags.length - maxVisible;

    return [
      ...visibleTags,
      {
        title: `+${remainingCount}`,
        category: 'more' as TagCategory,
      },
    ];
  };

  // Функция для маппинга русских названий категорий на английские классы тегов
  const mapCategoryToTagCategory = (categoryName: string): TagCategory => {
    const categoryMap: Record<string, TagCategory> = {
      бизнесикарьера: 'business',
      творчествоиискусство: 'art',
      иностранныеязыки: 'language',
      образованиеиразвитие: 'education',
      домиуют: 'home',
      здоровьеилайфстайл: 'health',
    };

    const normalizedName = categoryName.toLowerCase().replace(/\s/g, '');
    return categoryMap[normalizedName] || 'more';
  };

  const convertUserToTUserData = (user: User, skill: Skill | null): TUserData => {
    const userCity =
      cities.find((city) => city.id === user.location)?.name || user.location.toString();

    const teachSkills = skill
      ? [
          {
            title: skill.title,
            category: mapCategoryToTagCategory(
              categories.find((cat) => cat.id === skill.categoryId)?.name || ''
            ),
          },
        ]
      : [];

    const learnSkills = user.subcategoriesWantToLearn
      .filter((subcategoryId) => subcategoryId !== 405) // Временно убираем "Навыки преподавания"
      .map((subcategoryId) => {
        let categoryName: TagCategory = 'more';
        let skillTitle = 'Неизвестный навык';

        const foundCategory = categories.find((cat) =>
          cat.subcategories.some((subcategory) => subcategory.id === subcategoryId)
        );
        if (foundCategory) {
          const foundSubcategory = foundCategory.subcategories.find(
            (subcategory) => subcategory.id === subcategoryId
          );
          if (foundSubcategory) {
            skillTitle = foundSubcategory.name;
            categoryName = mapCategoryToTagCategory(foundCategory.name);
          }
        }
        return { title: skillTitle, category: categoryName };
      });

    // Вычисляем extraLearnCount
    const originalLearnCount = user.subcategoriesWantToLearn.filter((id) => id !== 405).length;
    const maxVisible = 2; // должно соответствовать значению в truncateTags
    const extraLearnCount = Math.max(0, originalLearnCount - maxVisible);

    return {
      avatar: user.avatarUrl,
      name: user.name,
      city: userCity,
      age: user.age,
      about:
        'Привет! Люблю ритм большого города, но всегда нахожу время для своих увлечений. Обожаю делиться знаниями и открывать для себя что-то новое. В свободное время занимаюсь йогой и читаю книги по психологии.',
      teach: truncateTags(teachSkills, 2), // Показываем максимум 2 тега, остальные как "+N"
      learn: truncateTags(learnSkills, 2), // Показываем максимум 2 тега, остальные как "+N"
      extraLearnCount,
    };
  };

  // Вспомогательная функция для получения строки категории
  const getCategoryString = (skill: Skill): string => {
    const category = categories.find((cat) => cat.id === skill.categoryId);
    const subcategory = category?.subcategories.find(
      (subcategoryItem) => subcategoryItem.id === skill.subcategoryId
    );
    return subcategory ? `${category?.name} / ${subcategory.name}` : 'Неизвестная категория';
  };

  // Обработчик прокрутки списка похожих предложений вправо
  const handleScrollRight = () => {
    if (similarOffersListRef.current) {
      const scrollAmount = 350; // Ширина карточки + gap
      similarOffersListRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Обработчик прокрутки списка похожих предложений влево
  const handleScrollLeft = () => {
    if (similarOffersListRef.current) {
      const scrollAmount = 350; // Ширина карточки + gap
      similarOffersListRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Отслеживание прокрутки
  useEffect(() => {
    const listElement = similarOffersListRef.current;
    if (listElement) {
      // Проверяем при загрузке и изменении размера
      checkScrollability();

      // Проверяем при прокрутке
      const handleScroll = () => {
        checkScrollability();
      };

      // Проверяем при изменении размера окна
      const handleResize = () => {
        checkScrollability();
      };

      listElement.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleResize);

      return () => {
        listElement.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
    return undefined;
  }, [similarOffers]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className={styles.container}>
          <div className={styles.loading}>Загрузка...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !skillData) {
    return (
      <div>
        <Header />
        <div className={styles.container}>
          <div className={styles.error}>
            {error || 'Предложение не найдено'}
            <div style={{ marginTop: 16 }}>
              <PrimaryButton
                label='На главную'
                onClick={() => navigate('/')}
                className={styles.goHomeButton}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const { skill, owner } = skillData;
  const userData = convertUserToTUserData(owner, skill);
  const categoryString = getCategoryString(skill);

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.mainContent}>
          {/* Левая колонка - UserCard */}
          <div className={styles.leftColumn}>
            <UserCard
              likedState={isFavorite(owner.id)}
              userData={userData}
              isDetail
              onClickLiked={() => handleUserCardLike(owner.id)}
              onClickDetail={() => handleUserCardDetail(owner.id, skill.id)}
            />
          </div>

          {/* Правая колонка - DetailUserCard */}
          <div className={styles.rightColumn}>
            <div className={styles.detailCardWrapper}>
              <DetailUserCard
                images={skill.images}
                isModal={false}
                isLiked={isFavorite(owner.id)}
                titleDetailCardSkill={skill.title}
                categorySkill={categoryString}
                description={skill.description}
                onClickLiked={() => toggleFavorite(owner.id)}
                onClickEdit={handleEdit}
                onClickDone={handleDone}
                onClickOffer={handleOffer}
                link={`/?id=${skill.id}`}
              />
            </div>
          </div>
        </div>

        {/* Блок похожих предложений */}
        {similarOffers.length > 0 && (
          <div className={styles.similarOffers}>
            <h2 className={styles.similarOffersTitle}>Похожие предложения</h2>
            <div className={styles.similarOffersWrapper}>
              {canScrollLeft && (
                <button
                  className={`${styles.scrollButton} ${styles.scrollButtonLeft}`}
                  onClick={handleScrollLeft}
                  type='button'
                  aria-label='Прокрутить влево'
                >
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M15 18L9 12L15 6'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              )}
              <div ref={similarOffersListRef} className={styles.similarOffersList}>
                {similarOffers.map((expert) => {
                  const expertUserData = convertUserToTUserData(expert.user, expert.skill);
                  return (
                    <div key={expert.user.id} className={styles.similarOfferCard}>
                      <UserCard
                        likedState={isFavorite(expert.user.id)}
                        userData={expertUserData}
                        isDetail={false}
                        onClickLiked={() => handleUserCardLike(expert.user.id)}
                        onClickDetail={() =>
                          handleUserCardDetail(expert.user.id, expert.skill?.id || null)
                        }
                      />
                    </div>
                  );
                })}
              </div>
              {canScrollRight && (
                <button
                  className={`${styles.scrollButton} ${styles.scrollButtonRight}`}
                  onClick={handleScrollRight}
                  type='button'
                  aria-label='Прокрутить вправо'
                >
                  <svg
                    width='24'
                    height='24'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path
                      d='M9 18L15 12L9 6'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SkillPage;
