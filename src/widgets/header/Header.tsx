import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from '../../features/logo/Logo';
import Arrow from '../../features/ui/arrow/Arrow';
import Search from '../../features/ui/search/Search';
import ThemeIcon from '../../shared/ui/icon-buttons/theme/ThemeIcon';
import PrimaryButton from '../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../shared/ui/button/SecondaryButton/SecondaryButton';
import { getCategories } from '../../api/mockApi';
import { Category } from '../../types';
import PopupCategories from '../popup-categories/PopupCategories';
import { useAppState, useAppDispatch } from '../../shared/hooks/storeHooks';
import { LikeIcon } from '../../shared/ui/icon-buttons/like/LikeIcon';
import { Avatar } from '../../shared/ui/avatar/avatar';

import styles from './Header.module.css';

/**
 * Header - основной компонент шапки сайта
 * @returns {JSX.Element} Шапка сайта
 */
const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { user } = useAppState();
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Пока костыль для перехода к избранным
  const onClickLiked = () => {
    setIsLiked((prev) => !prev);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Не удалось загрузить категории', error);
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    };

    if (isCategoriesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCategoriesOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
    };

    if (isProfileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileMenuOpen]);

  const handleSubcategorySelect = () => {
    setIsCategoriesOpen(false);
    // Здесь можно добавить фильтрацию по подкатегории
  };

  const handleThemeToggle = () => {
    setIsDarkTheme((prevTheme) => {
      const newTheme = !prevTheme;
      return newTheme;
    });
  };

  const handleRegisterClick = () => {
    navigate('/registration');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleLogoutClick = () => {
    dispatch({ type: 'USER/LOGOUT' });
    setIsProfileMenuOpen(false);
    navigate('/', { replace: true });
  };

  const handleProfileClick = () => {
    // navigate('/profile'); // Пока не будет добавлено
  };

  const toggleCategories = () => {
    setIsCategoriesOpen((prev) => !prev);
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <Logo />
        </div>

        <div className={styles.navigation}>
          <a className={styles.link} href='#about'>
            О проекте
          </a>
          <div className={styles.arrow} ref={popupRef}>
            <button type='button' className={styles.trigger} onClick={toggleCategories}>
              <span className={styles.link}>Все навыки</span>
              <Arrow defaultActive={isCategoriesOpen} />
            </button>

            {isCategoriesOpen && (
              <PopupCategories
                categories={categories}
                onSelectSubcategory={handleSubcategorySelect}
              />
            )}
          </div>
        </div>

        <div className={styles.searchContainer}>
          <Search />
        </div>

        <div className={styles.rightControls}>
          <ThemeIcon isDark={isDarkTheme} onClick={handleThemeToggle} />

          {user ? (
            <div className={styles.authenticatedControls}>
              <svg
                width='24'
                height='24'
                viewBox='0 0 19 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className={styles.notificationIcon}
                role='img'
                aria-label='Уведомления'
              >
                <path
                  d='M0.777981 12.243C0.586281 13.4976 1.44218 14.3679 2.48978 14.8017C6.50648 16.4667 12.0955 16.4667 16.1122 14.8017C17.1598 14.3679 18.0157 13.4967 17.824 12.243C17.707 11.4717 17.1247 10.83 16.6936 10.2027C16.1293 9.3711 16.0735 8.4648 16.0726 7.5C16.0735 3.7722 13.0423 0.75 9.30098 0.75C5.55968 0.75 2.52848 3.7722 2.52848 7.5C2.52848 8.4648 2.47268 9.372 1.90748 10.2027C1.47728 10.83 0.895881 11.4717 0.777981 12.243Z'
                  stroke='#253017'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M5.70117 16.0508C6.11337 17.6033 7.56957 18.7508 9.30117 18.7508C11.0337 18.7508 12.4881 17.6033 12.9012 16.0508'
                  stroke='#253017'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <LikeIcon isLiked={isLiked} onClick={onClickLiked} />
              <div className={styles.userProfile} ref={profileMenuRef}>
                <button
                  type='button'
                  className={styles.avatarButton}
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <span className={styles.userName}>{user.name}</span>
                  <Avatar src={user.avatarUrl} size={48} />
                </button>

                {isProfileMenuOpen && (
                  <div className={styles.profileDropdown}>
                    <button
                      type='button'
                      className={styles.dropdownItem}
                      onClick={handleProfileClick}
                    >
                      Личный кабинет
                    </button>
                    <button
                      type='button'
                      className={styles.dropdownItem}
                      onClick={handleLogoutClick}
                    >
                      Выход
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className={styles.controls}>
              <SecondaryButton label='Войти' onClick={handleLoginClick} />
              <PrimaryButton label='Зарегистрироваться' onClick={handleRegisterClick} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
