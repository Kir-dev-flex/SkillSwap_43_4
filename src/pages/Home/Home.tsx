import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import style from './Home.module.css';
import Header from '../../widgets/header/Header';
import Arrow from '../../features/ui/arrow/Arrow';
import { UserCard } from '../../features/ui/UserCard/UserCard';
import { User } from '../../types';
import { TSkills } from '../../features/ui/UserCard/types';
import { TagCategory } from '../../features/ui/tag/types';
import Footer from '../../widgets/footer/Footer';
import { useAppState } from '../../shared/hooks/storeHooks';

import { useFavorites } from '../../shared/hooks/useFavorites';
import { hasExchangeOffer } from '../../shared/hooks/exchangeStorage';

import FiltersPanel, { Filters } from '../../widgets/FiltersPanel/FiltersPanel';

const categoryToTag: Record<number, TagCategory> = {
  1: 'business',
  2: 'art',
  3: 'language',
  4: 'education',
  5: 'home',
  6: 'health',
};

export default function Home() {
  const [visibleCount, setVisibleCount] = useState(20);
  const recommendedLoaderRef = useRef<HTMLDivElement>(null);

  // скрытые карточки
  const [showAllPopular, setShowAllPopular] = useState(false);
  const [showAllNew, setShowAllNew] = useState(false);

  const { users, cities, categories, skills, user: authUser } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [filters, setFilters] = useState<Filters>({
    learnType: 'all',
    gender: null,
    city: null,
    skillIds: [],
  });

  const hasActiveFilters = useMemo(
    () =>
      filters.learnType !== 'all' ||
      filters.gender !== null ||
      filters.city !== null ||
      filters.skillIds.length > 0,
    [filters]
  );

  const subcategoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach((cat) => {
      cat.subcategories.forEach((sub) => {
        map.set(sub.id, sub.name);
      });
    });
    return map;
  }, [categories]);

  const getSubcategoryName = (subId: number): string | null => subcategoryMap.get(subId) || null;

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

  const filteredUsers = useMemo(() => {
    const applyFilters = (_users: User[]) => {
      if (!_users || _users.length === 0) return [];

      return _users.filter((user) => {
        if (filters.learnType !== 'all') {
          if (filters.learnType === 'wantToLearn' && user.subcategoriesWantToLearn.length === 0) {
            return false;
          }
          if (filters.learnType === 'canTeach' && !user.skillCanTeach) {
            return false;
          }
        }

        if (filters.gender && user.gender !== filters.gender) {
          return false;
        }

        if (filters.city && user.location !== filters.city) {
          return false;
        }

        if (filters.skillIds.length > 0) {
          const hasSkill =
            (filters.learnType === 'wantToLearn' &&
              filters.skillIds.some((id) => user.subcategoriesWantToLearn.includes(id))) ||
            (filters.learnType === 'canTeach' &&
              user.skillCanTeach &&
              filters.skillIds.includes(user.skillCanTeach)) ||
            (filters.learnType === 'all' &&
              (filters.skillIds.some((id) => user.subcategoriesWantToLearn.includes(id)) ||
                (user.skillCanTeach && filters.skillIds.includes(user.skillCanTeach))));

          if (!hasSkill) {
            return false;
          }
        }

        return true;
      });
    };

    return applyFilters(users || []);
  }, [users, filters]);

  const popularUsers = useMemo(() => {
    const safe = filteredUsers || [];
    return [...safe].sort(() => Math.random() - 0.5);
  }, [filteredUsers]);

  const newUsers = useMemo(() => {
    const safe = filteredUsers || [];
    return [...safe].sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [filteredUsers]);

  // Обработка события поиска
  useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      const searchValue = customEvent.detail?.trim().toLowerCase() || '';

      if (!searchValue) {
        // Если поиск пустой, очищаем фильтр по навыкам
        setFilters((prev) => ({
          ...prev,
          skillIds: [],
        }));
        return;
      }

      // Проверяем, что категории загружены
      if (!categories || categories.length === 0) {
        return;
      }

      // Находим категории, у которых название содержит введенный текст
      const matchingCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchValue)
      );

      // Находим подкатегории, у которых название содержит введенный текст
      const matchingSubcategories: number[] = [];
      categories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          if (subcategory.name.toLowerCase().includes(searchValue)) {
            matchingSubcategories.push(subcategory.id);
          }
        });
      });

      // Собираем все подкатегории из найденных категорий
      const matchingSubcategoryIds: number[] = [];
      matchingCategories.forEach((category) => {
        category.subcategories.forEach((subcategory) => {
          matchingSubcategoryIds.push(subcategory.id);
        });
      });

      // Объединяем подкатегории из найденных категорий и найденные подкатегории по названию
      const allMatchingSubcategoryIds = [
        ...new Set([...matchingSubcategoryIds, ...matchingSubcategories]),
      ];

      // Устанавливаем фильтр с найденными подкатегориями
      setFilters((prev) => ({
        ...prev,
        skillIds: allMatchingSubcategoryIds,
      }));
    };

    window.addEventListener('search', handleSearch as EventListener);

    return () => {
      window.removeEventListener('search', handleSearch as EventListener);
    };
  }, [categories]);

  useEffect(() => {
    const currentUsers = hasActiveFilters ? filteredUsers : users;

    if (!currentUsers || currentUsers.length <= 20) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && visibleCount < currentUsers.length) {
          setVisibleCount((prev) => prev + 20);
        }
      },
      { threshold: 1.0 }
    );

    if (recommendedLoaderRef.current) {
      observer.observe(recommendedLoaderRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, hasActiveFilters, filteredUsers, users]);

  const renderUserCards = (userList: User[], showAll: boolean) => {
    const localVisibleCount = 3;
    const usersToShow = showAll ? userList : userList.slice(0, localVisibleCount);

    return usersToShow.map((user) => (
      <UserCard
        key={user.id}
        likedState={isFavorite(user.id)}
        userData={userCardData(user)}
        isDetail={false}
        disabled={hasExchangeOffer(user.skillCanTeach)}
        onClickLiked={() => {
          if (!authUser) {
            const from = `${location.pathname}${location.search}`;
            navigate('/login', { state: { from } });
            return;
          }
          toggleFavorite(user.id);
        }}
        onClickDetail={() => {
          const userSkill = skills?.find((skill) => skill.userId === user.id);

          if (!userSkill) {
            console.warn(`У пользователя ${user.id} нет навыка`);
            return;
          }

          navigate(`/skill?id=${userSkill.id}`);
        }}
      />
    ));
  };

  return (
    <div className={style.page}>
      <Header />
      <div className={style.wrapper}>
        {/* Фильтры */}
        <aside className={style.filters}>
          <FiltersPanel filters={filters} onChange={setFilters} />
        </aside>

        {/* Основной контент */}
        <main className={style.main}>
          {hasActiveFilters ? (
            // Подходящие предложения
            <section className={style.section}>
              {/* Заголовки с выбранными фильтрами */}
              <div className={style.filtersHeader}>
                {filters.learnType !== 'all' && (
                  <div className={style.filterTag}>
                    {filters.learnType === 'wantToLearn' ? 'Хочу научиться' : 'Могу научить'}
                    <button
                      type='button'
                      className={style.removeFilter}
                      onClick={() => setFilters((prev) => ({ ...prev, learnType: 'all' }))}
                    >
                      ×
                    </button>
                  </div>
                )}

                {filters.gender && (
                  <div className={style.filterTag}>
                    {filters.gender}
                    <button
                      type='button'
                      className={style.removeFilter}
                      onClick={() => setFilters((prev) => ({ ...prev, gender: null }))}
                    >
                      ×
                    </button>
                  </div>
                )}

                {filters.city && (
                  <div className={style.filterTag}>
                    {cities.find((c) => c.id === filters.city)?.name || filters.city}
                    <button
                      type='button'
                      className={style.removeFilter}
                      onClick={() => setFilters((prev) => ({ ...prev, city: null }))}
                    >
                      ×
                    </button>
                  </div>
                )}

                {filters.skillIds.map((id) => {
                  const name = getSubcategoryName(id);
                  if (!name) return null;

                  return (
                    <div key={id} className={style.filterTag}>
                      {name}
                      <button
                        type='button'
                        className={style.removeFilter}
                        onClick={() => {
                          setFilters((prev) => ({
                            ...prev,
                            skillIds: prev.skillIds.filter((sid) => sid !== id),
                          }));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className={style.header}>
                <h1 className={style.caption}>Подходящие предложения: {filteredUsers.length}</h1>
              </div>
              <div className={style.cards}>
                {renderUserCards(filteredUsers.slice(0, visibleCount), true)}
                <div ref={recommendedLoaderRef} />
              </div>
            </section>
          ) : (
            <>
              {/* Популярное */}
              <section className={style.section}>
                <div className={style.header}>
                  <h1 className={style.caption}>Популярное</h1>
                  {!showAllPopular && (
                    <div
                      role='button'
                      tabIndex={0}
                      className={style.button}
                      onClick={() => setShowAllPopular(!showAllPopular)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setShowAllPopular(!showAllPopular);
                        }
                      }}
                    >
                      Смотреть все
                      <span className={style.arrowRight}>
                        <Arrow defaultActive={showAllPopular} />
                      </span>
                    </div>
                  )}
                </div>
                <div className={style.cards}>{renderUserCards(popularUsers, showAllPopular)}</div>
              </section>

              {/* Новое */}
              <section className={style.section}>
                <div className={style.header}>
                  <h1 className={style.caption}>Новое</h1>
                  {!showAllNew && (
                    <div
                      role='button'
                      tabIndex={0}
                      className={style.button}
                      onClick={() => setShowAllNew(!showAllNew)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setShowAllNew(!showAllNew);
                        }
                      }}
                    >
                      Смотреть все
                      <span className={style.arrowRight}>
                        <Arrow defaultActive={showAllNew} />
                      </span>
                    </div>
                  )}
                </div>
                <div className={style.cards}>{renderUserCards(newUsers, showAllNew)}</div>
              </section>

              {/* Рекомендуем */}
              <section className={style.section}>
                <div className={style.header}>
                  <h1 className={style.caption}>Рекомендуем</h1>
                </div>
                <div className={style.cards}>
                  {renderUserCards(users?.slice(0, visibleCount) || [], true)}
                  <div ref={recommendedLoaderRef} />
                </div>
              </section>
            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}
