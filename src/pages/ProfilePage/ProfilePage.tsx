import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppState, useAppDispatch } from '../../shared/hooks/storeHooks';
import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';
import { Avatar } from '../../shared/ui/avatar/avatar';
import InputWithCalendar from '../../shared/ui/inputWithCalendar/InputWithCalendar';
import SingleSelect from '../../shared/ui/SingleSelect/SingleSelect';
import PrimaryButton from '../../shared/ui/button/PrimaryButton/PrimaryButton';
import { UserCard } from '../../features/ui/UserCard/UserCard';
import { useFavorites } from '../../shared/hooks/useFavorites';
import { getUserById, getSkillsByUserId, getCities, updateUser } from '../../api/mockApi';
import { User, Skill, City } from '../../types';
import { TSkills } from '../../features/ui/UserCard/types';
import { TagCategory } from '../../features/ui/tag/types';
import EditIcon from './icons/EditIcon';
import AvatarEditIcon from './icons/AvatarEditIcon';
import DocumentIcon from './icons/DocumentIcon';
import ChatIcon from './icons/ChatIcon';
import HeartIcon from './icons/HeartIcon';
import LightbulbIcon from './icons/LightbulbIcon';
import PersonIcon from './icons/PersonIcon';
import CityInput from './CityInput';
import styles from './ProfilePage.module.css';

type TabType = 'applications' | 'exchanges' | 'favorites' | 'skills' | 'personal';

interface ProfileFormData {
  email: string;
  name: string;
  birthDate: Date | null;
  city: string;
  gender: string;
  about: string;
}

const categoryToTag: Record<number, TagCategory> = {
  1: 'business',
  2: 'art',
  3: 'language',
  4: 'education',
  5: 'home',
  6: 'health',
};

const ProfilePage: React.FC = () => {
  const { user, users, cities, categories } = useAppState();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [likedUsers, setLikedUsers] = useState<User[]>([]);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    email: '',
    name: '',
    birthDate: null,
    city: '',
    gender: '',
    about: '',
  });
  const [originalFormData, setOriginalFormData] = useState<ProfileFormData>({
    email: '',
    name: '',
    birthDate: null,
    city: '',
    gender: '',
    about: '',
  });
  const [cityOptions, setCityOptions] = useState<Array<{ label: string; value: string }>>([]);
  const [genderOptions] = useState([
    { label: 'Мужской', value: 'Мужской' },
    { label: 'Женский', value: 'Женский' },
  ]);

  // START добавляем пользователя с id=1 в глобальное состояние
  useEffect(() => {
    const loadUser = async () => {
      try {
        let userToUse = user;
        if (!userToUse) {
          const defaultUser = await getUserById(1);
          if (defaultUser) {
            userToUse = defaultUser;
            dispatch({ type: 'USER/LOGIN', payload: defaultUser });
          }
        }
        if (userToUse) {
          setCurrentUser(userToUse);
          const birthDate = userToUse.birthDate ? new Date(userToUse.birthDate) : null;
          setFormData({
            email: userToUse.email || '',
            name: userToUse.name || '',
            birthDate,
            city: userToUse.location || '',
            gender: userToUse.gender || '',
            about: '',
          });
          setOriginalFormData({
            email: userToUse.email || '',
            name: userToUse.name || '',
            birthDate,
            city: userToUse.location || '',
            gender: userToUse.gender || '',
            about: '',
          });
        }
      } catch (error) {
        console.error('Ошибка загрузки пользователя:', error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, [user, dispatch]);
  // END добавляем пользователя с id=1 в глобальное состояние

  // Очистка URL превью при размонтировании
  useEffect(
    () => () => {
      if (avatarPreview && avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    },
    [avatarPreview]
  );

  useEffect(() => {
    const loadCities = async () => {
      try {
        const citiesData = await getCities();
        const options = citiesData.map((city: City) => ({
          label: city.name,
          value: city.id,
        }));
        setCityOptions(options);
      } catch (error) {
        console.error('Ошибка загрузки городов:', error);
      }
    };
    loadCities();
  }, []);

  // Преобразуем location (ID) в название города при загрузке пользователя
  useEffect(() => {
    const convertLocationToCityName = async () => {
      if (!currentUser?.location || !cityOptions.length) return;

      // Если location уже является названием города (содержит кириллицу), оставляем как есть
      const hasCyrillic = /[а-яё]/i.test(currentUser.location);
      if (hasCyrillic) {
        return; // Уже название города
      }

      // Если location - это ID (например, "moscow"), находим название
      const cityOption = cityOptions.find((option) => option.value === currentUser.location);
      if (cityOption) {
        setFormData((prev) => ({ ...prev, city: cityOption.label }));
        setOriginalFormData((prev) => ({ ...prev, city: cityOption.label }));
      }
    };

    convertLocationToCityName();
  }, [currentUser, cityOptions]);

  useEffect(() => {
    const loadTabData = async () => {
      if (!currentUser) return;

      try {
        switch (activeTab) {
          case 'skills': {
            const skills = await getSkillsByUserId(currentUser.id);
            setUserSkills(skills);
            break;
          }
          case 'favorites': {
            setFavoritesLoading(true);
            try {
              if (!users || users.length === 0) {
                setLikedUsers([]);
                return;
              }

              const favorites = users.filter((favoriteUser) =>
                favoriteIds.includes(favoriteUser.id)
              );
              setLikedUsers(favorites);
            } finally {
              setFavoritesLoading(false);
            }
            break;
          }
          default:
            break;
        }
      } catch (error) {
        console.error('Ошибка загрузки данных вкладки:', error);
      }
    };
    loadTabData();
  }, [activeTab, currentUser, users, favoriteIds]);

  const hasChanges = useMemo(
    () =>
      formData.email !== originalFormData.email ||
      formData.name !== originalFormData.name ||
      formData.city !== originalFormData.city ||
      formData.gender !== originalFormData.gender ||
      formData.about !== originalFormData.about ||
      (formData.birthDate?.getTime() !== originalFormData.birthDate?.getTime() &&
        (formData.birthDate || originalFormData.birthDate)),
    [formData, originalFormData]
  );

  const handleSave = async () => {
    if (!currentUser || !hasChanges) return;

    try {
      // Сохраняем название города напрямую (location хранит название города)
      const updatedUser = await updateUser({
        id: currentUser.id,
        email: formData.email,
        name: formData.name,
        location: formData.city, // Название города
        gender: formData.gender,
        birthDate: formData.birthDate
          ? formData.birthDate.toISOString().split('T')[0]
          : currentUser.birthDate,
      });

      dispatch({ type: 'USER/UPDATE_PROFILE', payload: updatedUser });
      setCurrentUser(updatedUser);
      setOriginalFormData({ ...formData });
    } catch (error) {
      console.error('Ошибка сохранения профиля:', error);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value });
  };

  const handleCityChange = (value: string) => {
    setFormData({ ...formData, city: value });
  };

  const handleGenderChange = (value: string) => {
    setFormData({ ...formData, gender: value });
  };

  const handleBirthDateChange = (date: Date | null) => {
    setFormData({ ...formData, birthDate: date });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handleAboutChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, about: e.target.value });
  };

  const userCardData = (favoriteUser: User) => {
    const city = cities.find((c) => c.id === favoriteUser.location)?.name || 'Не указан';
    let teach: TSkills[] = [];
    let learn: TSkills[] = [];

    if (favoriteUser.skillCanTeach) {
      const match = categories
        .flatMap((cat) =>
          cat.subcategories.map((sub) => ({
            categoryId: cat.id,
            subcategoryName: sub.name,
            subcategoryId: sub.id,
          }))
        )
        .find((item) => item.subcategoryId === favoriteUser.skillCanTeach);

      if (match) {
        const tagCategory = categoryToTag[match.categoryId] || 'education';
        teach = [{ title: match.subcategoryName, category: tagCategory }];
      }
    }

    if (favoriteUser.subcategoriesWantToLearn) {
      learn = favoriteUser.subcategoriesWantToLearn
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
      avatar: favoriteUser.avatarUrl,
      name: favoriteUser.name,
      city,
      age: favoriteUser.age || 0,
      about: '',
      teach,
      learn: displayedLearn,
      extraLearnCount: extraCount,
    };
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;

    setAvatarError(null);

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setAvatarError('Пожалуйста, выберите изображение');
      console.error('Неподдерживаемый тип файла:', file.type);
      return;
    }

    // Проверка размера файла (например, максимум 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Размер файла не должен превышать 5MB');
      console.error('Файл слишком большой:', file.size);
      return;
    }

    try {
      // Создаем превью
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Конвертируем файл в base64 для сохранения
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        // Обновляем аватар пользователя
        const updatedUser = await updateUser({
          id: currentUser.id,
          avatarUrl: base64String,
        });

        dispatch({ type: 'USER/UPDATE_PROFILE', payload: updatedUser });
        setCurrentUser(updatedUser);

        // Очищаем превью URL после использования
        URL.revokeObjectURL(previewUrl);
        setAvatarPreview(null);
        setAvatarError(null);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Ошибка загрузки аватара:', error);
      setAvatarError('Ошибка при загрузке аватара');
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>Загрузка...</div>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.error}>Пользователь не найден</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.wrapper}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <button
              className={`${styles.navItem} ${
                activeTab === 'applications' ? styles.navItemActive : ''
              }`}
              onClick={() => setActiveTab('applications')}
              type='button'
            >
              <DocumentIcon />
              <span>Заявки</span>
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === 'exchanges' ? styles.navItemActive : ''
              }`}
              onClick={() => setActiveTab('exchanges')}
              type='button'
            >
              <ChatIcon />
              <span>Мои обмены</span>
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === 'favorites' ? styles.navItemActive : ''
              }`}
              onClick={() => setActiveTab('favorites')}
              type='button'
            >
              <HeartIcon />
              <span>Избранное</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === 'skills' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('skills')}
              type='button'
            >
              <LightbulbIcon />
              <span>Мои навыки</span>
            </button>
            <button
              className={`${styles.navItem} ${
                activeTab === 'personal' ? styles.navItemActive : ''
              }`}
              onClick={() => setActiveTab('personal')}
              type='button'
            >
              <PersonIcon />
              <span>Личные данные</span>
            </button>
          </nav>
        </aside>

        <main className={styles.main}>
          {activeTab === 'personal' && (
            <section className={styles.profileSection}>
              <div className={styles.avatarContainer}>
                <Avatar
                  src={avatarPreview || currentUser.avatarUrl}
                  alt={currentUser.name}
                  size={244}
                />
                <button
                  className={styles.avatarEditButton}
                  type='button'
                  aria-label='Изменить аватар'
                  onClick={handleAvatarClick}
                >
                  <AvatarEditIcon />
                </button>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleAvatarChange}
                  style={{ display: 'none' }}
                />
                {avatarError && (
                  <div style={{ color: 'red', fontSize: '14px', marginTop: '8px' }}>
                    {avatarError}
                  </div>
                )}
              </div>

              <div className={styles.form}>
                <div className={styles.formGroup}>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor='email' className={styles.label}>
                    Почта
                  </label>
                  <div className={styles.inputWithIcon}>
                    <input
                      id='email'
                      type='email'
                      className={styles.input}
                      value={formData.email}
                      onChange={handleEmailChange}
                      placeholder='Введите email'
                      aria-label='Почта'
                    />
                    <button
                      className={styles.editIconButton}
                      type='button'
                      aria-label='Редактировать'
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <button className={styles.changePasswordLink} type='button'>
                    Изменить пароль
                  </button>
                </div>

                <div className={styles.formGroup}>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor='name' className={styles.label}>
                    Имя
                  </label>
                  <div className={styles.inputWithIcon}>
                    <input
                      id='name'
                      type='text'
                      className={styles.input}
                      value={formData.name}
                      onChange={handleNameChange}
                      placeholder='Введите имя'
                      aria-label='Имя'
                    />
                    <button
                      className={styles.editIconButton}
                      type='button'
                      aria-label='Редактировать'
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>

                <div className={styles.rowFields}>
                  <div className={`${styles.formGroup} ${styles.birthDateField}`}>
                    <InputWithCalendar
                      isOpen={isCalendarOpen}
                      onToggle={setIsCalendarOpen}
                      onChange={handleBirthDateChange}
                      value={formData.birthDate}
                      placeholder='дд.мм.гггг'
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.genderField}`}>
                    {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                    <label htmlFor='gender' className={styles.label}>
                      Пол
                    </label>
                    <SingleSelect
                      id='gender'
                      options={genderOptions}
                      onChange={handleGenderChange}
                      initialValue={formData.gender || 'Не указан'}
                    />
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.cityField}`}>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor='city' className={styles.label}>
                    Город
                  </label>
                  <CityInput
                    id='city'
                    options={cityOptions}
                    onChange={handleCityChange}
                    value={formData.city}
                  />
                </div>

                <div className={styles.formGroup}>
                  {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                  <label htmlFor='about' className={styles.label}>
                    О себе
                  </label>
                  <div className={styles.textareaWithIcon}>
                    <textarea
                      id='about'
                      className={styles.textarea}
                      value={formData.about}
                      onChange={handleAboutChange}
                      placeholder='Расскажите о себе'
                      rows={4}
                      aria-label='О себе'
                    />
                    <button
                      className={styles.editIconButton}
                      type='button'
                      aria-label='Редактировать'
                    >
                      <EditIcon />
                    </button>
                  </div>
                </div>

                <div className={styles.buttonContainer}>
                  <PrimaryButton label='Сохранить' onClick={handleSave} disabled={!hasChanges} />
                </div>
              </div>
            </section>
          )}

          {activeTab === 'applications' && (
            <section className={styles.contentSection}>
              <div className={styles.emptyTab}>Пока нет заявок</div>
            </section>
          )}

          {activeTab === 'exchanges' && (
            <section className={styles.contentSection}>
              <div className={styles.emptyTab}>Пока нет обменов</div>
            </section>
          )}

          {activeTab === 'favorites' && (
            <section className={styles.contentSection}>
              {favoritesLoading && <div className={styles.loading}>Загрузка...</div>}
              {!favoritesLoading && likedUsers.length === 0 && (
                <div className={styles.emptyTab}>У вас пока нет избранного</div>
              )}
              {!favoritesLoading && likedUsers.length > 0 && (
                <div className={styles.favoritesCards}>
                  {likedUsers.map((likedUser) => (
                    <UserCard
                      key={likedUser.id}
                      likedState
                      userData={userCardData(likedUser)}
                      isDetail={false}
                      onClickLiked={() => {
                        if (!currentUser) {
                          const from = `${location.pathname}${location.search}`;
                          navigate('/login', { state: { from } });
                          return;
                        }
                        toggleFavorite(likedUser.id);
                      }}
                      onClickDetail={() => {
                        // Переход на детальную страницу пользователя
                      }}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {activeTab === 'skills' && (
            <section className={styles.contentSection}>
              <div className={styles.skillsList}>
                {userSkills.length === 0 ? (
                  <div className={styles.emptyTab}>У вас пока нет навыков</div>
                ) : (
                  userSkills.map((skill) => (
                    <div key={skill.id} className={styles.skillCard}>
                      <h3 className={styles.skillTitle}>{skill.title}</h3>
                      <p className={styles.skillDescription}>{skill.description}</p>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
