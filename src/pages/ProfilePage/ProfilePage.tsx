import React, { useState, useEffect, useMemo } from 'react';
import { useAppState, useAppDispatch } from '../../shared/hooks/storeHooks';
import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';
import { Avatar } from '../../shared/ui/avatar/Avatar';
import InputWithCalendar from '../../shared/ui/inputWithCalendar/InputWithCalendar';
import SingleSelect from '../../shared/ui/SingleSelect/SingleSelect';
import PrimaryButton from '../../shared/ui/button/PrimaryButton/PrimaryButton';
import { getUserById, getSkillsByUserId, getLikesByUserId, getCities, updateUser } from '../../api/mockApi';
import { User, Skill, City } from '../../types';
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

const ProfilePage: React.FC = () => {
  const { user } = useAppState();
  const dispatch = useAppDispatch();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('personal');
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [userLikes, setUserLikes] = useState<number[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
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
            const likes = await getLikesByUserId(currentUser.id);
            setUserLikes(likes.map((like) => like.likedUserId));
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
  }, [activeTab, currentUser]);

  const hasChanges = useMemo(() => {
    return (
      formData.email !== originalFormData.email ||
      formData.name !== originalFormData.name ||
      formData.city !== originalFormData.city ||
      formData.gender !== originalFormData.gender ||
      formData.about !== originalFormData.about ||
      (formData.birthDate?.getTime() !== originalFormData.birthDate?.getTime() &&
        (formData.birthDate || originalFormData.birthDate))
    );
  }, [formData, originalFormData]);

  const handleSave = async () => {
    if (!currentUser || !hasChanges) return;

    try {
      const updatedUser = await updateUser({
        id: currentUser.id,
        email: formData.email,
        name: formData.name,
        location: formData.city,
        gender: formData.gender,
        birthDate: formData.birthDate ? formData.birthDate.toISOString().split('T')[0] : currentUser.birthDate,
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
              className={`${styles.navItem} ${activeTab === 'applications' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('applications')}
              type='button'
            >
              <DocumentIcon />
              <span>Заявки</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === 'exchanges' ? styles.navItemActive : ''}`}
              onClick={() => setActiveTab('exchanges')}
              type='button'
            >
              <ChatIcon />
              <span>Мои обмены</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === 'favorites' ? styles.navItemActive : ''}`}
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
              className={`${styles.navItem} ${activeTab === 'personal' ? styles.navItemActive : ''}`}
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
                <Avatar src={currentUser.avatarUrl} alt={currentUser.name} size={244} />
                <button className={styles.avatarEditButton} type='button' aria-label='Изменить аватар'>
                  <AvatarEditIcon />
                </button>
              </div>

              <div className={styles.form}>
                <div className={styles.formGroup}>
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
                    />
                    <button className={styles.editIconButton} type='button' aria-label='Редактировать'>
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
                    />
                    <button className={styles.editIconButton} type='button' aria-label='Редактировать'>
                      <EditIcon />
                    </button>
                  </div>
                </div>

                <div className={styles.rowFields}>
                  <div className={`${styles.formGroup} ${styles.birthDateField}`}>
                    <label htmlFor='birthDate' className={styles.label} id='birthDate-label'>
                      Дата рождения
                    </label>
                    <div id='birthDate' aria-labelledby='birthDate-label'>
                      <InputWithCalendar
                        isOpen={isCalendarOpen}
                        onToggle={setIsCalendarOpen}
                        onChange={handleBirthDateChange}
                        value={formData.birthDate}
                        placeholder='дд.мм.гггг'
                      />
                    </div>
                  </div>

                  <div className={`${styles.formGroup} ${styles.genderField}`}>
                    <label htmlFor='gender' className={styles.label} id='gender-label'>
                      Пол
                    </label>
                    <div aria-labelledby='gender-label'>
                      <SingleSelect
                        id='gender'
                        options={genderOptions}
                        onChange={handleGenderChange}
                        initialValue={formData.gender || 'Не указан'}
                      />
                    </div>
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.cityField}`}>
                  <label htmlFor='city' className={styles.label} id='city-label'>
                    Город
                  </label>
                  <div aria-labelledby='city-label'>
                    <CityInput
                      id='city'
                      options={cityOptions}
                      onChange={handleCityChange}
                      value={formData.city}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
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
                    />
                    <button className={styles.editIconButton} type='button' aria-label='Редактировать'>
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
              <div className={styles.likesList}>
                {userLikes.length === 0 ? (
                  <div className={styles.emptyTab}>У вас пока нет избранного</div>
                ) : (
                  <div className={styles.likesCount}>Избранных: {userLikes.length}</div>
                )}
              </div>
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

