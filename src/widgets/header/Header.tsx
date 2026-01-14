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
  const { user } = useAppState();
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleFavoritesClick = () => {
    navigate('/favorites');
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
              <LikeIcon isLiked={false} onClick={handleFavoritesClick} />
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
                      Выход из аккаунта
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='currentColor'
                        xmlns='http://www.w3.org/2000/svg'
                        aria-label='Выход из аккаунта'
                      >
                        <path
                          d='M8.86782 22H8.99441C13.3177 22 15.4014 20.296 15.7617 16.4791C15.8006 16.0798 15.5085 15.7196 15.0996 15.6806C14.7101 15.6417 14.3401 15.9435 14.3011 16.3427C14.0187 19.4002 12.5777 20.5394 8.98467 20.5394H8.85809C4.89509 20.5394 3.49295 19.1373 3.49295 15.1743V8.82571C3.49295 4.86271 4.89509 3.46056 8.85809 3.46056H8.98467C12.5971 3.46056 14.0382 4.61928 14.3011 7.73515C14.3498 8.13437 14.6906 8.43622 15.0996 8.39727C15.5085 8.36806 15.8006 8.00779 15.7714 7.60857C15.4404 3.7332 13.3469 2 8.99441 2H8.86782C4.08691 2 2.04212 4.04479 2.04212 8.82571V15.1743C2.04212 19.9552 4.08691 22 8.86782 22Z'
                          fill='currentColor'
                        />
                        <path
                          d='M9.10101 12.7301H20.1818C20.581 12.7301 20.9121 12.399 20.9121 11.9998C20.9121 11.6006 20.581 11.2695 20.1818 11.2695H9.10101C8.70179 11.2695 8.37073 11.6006 8.37073 11.9998C8.37073 12.399 8.70179 12.7301 9.10101 12.7301Z'
                          fill='currentColor'
                        />
                        <path
                          d='M18.0102 15.9918C18.1952 15.9918 18.3802 15.9236 18.5263 15.7775L21.7882 12.5156C22.0706 12.2332 22.0706 11.7659 21.7882 11.4835L18.5263 8.22155C18.2439 7.93917 17.7765 7.93917 17.4942 8.22155C17.2118 8.50392 17.2118 8.9713 17.4942 9.25368L20.24 11.9995L17.4942 14.7454C17.2118 15.0278 17.2118 15.4952 17.4942 15.7775C17.6305 15.9236 17.8252 15.9918 18.0102 15.9918Z'
                          fill='currentColor'
                        />
                      </svg>
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
