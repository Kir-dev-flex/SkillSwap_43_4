import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../../features/logo/Logo';
import Arrow from '../../features/ui/arrow/Arrow';
import Search from '../../features/ui/search/Search';
import ThemeIcon from '../../shared/ui/icon-buttons/theme/ThemeIcon';
import PrimaryButton from '../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../shared/ui/button/SecondaryButton/SecondaryButton';
import { getCategories } from '../../api/mockApi';
import { Category } from '../../types';
import PopupCategories from '../popup-categories/PopupCategories';
import { useAppState } from '../../shared/hooks/storeHooks';
import NotificationIcon from './icons/NotificationIcon';
import { LikeIcon } from '../../shared/ui/icon-buttons/like/LikeIcon';
import { Avatar } from '../../shared/ui/avatar/avatar';

import styles from './Header.module.css';

/**
 * Header - основной компонент шапки сайта
 * @returns {JSX.Element} Шапка сайта
 */
const Header: React.FC = () => {
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const { user } = useAppState();
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);

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

  const handleRegisterClick = () => {};

  const handleLoginClick = () => {};

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
              <NotificationIcon className={styles.notificationIcon} />
              <LikeIcon isLiked={isLiked} onClick={onClickLiked} />
              <div className={styles.userProfile}>
                <span className={styles.userName}>{user.name}</span>
                <Avatar src={user.avatarUrl} size={48} />
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
