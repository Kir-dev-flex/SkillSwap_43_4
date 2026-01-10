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

import styles from './Header.module.css';

/**
 * Header - основной компонент шапки сайта
 * @returns {JSX.Element} Шапка сайта
 */
const Header: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const popupRef = useRef<HTMLDivElement>(null);

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleArrowClick = (_isActive: boolean) => {
    setIsCategoriesOpen(_isActive);
  };

  const handleRegisterClick = () => {};

  const handleLoginClick = () => {};

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
            <a
              className={styles.link}
              href='#skills'
              onClick={(e) => {
                e.preventDefault();
                setIsCategoriesOpen(!isCategoriesOpen);
              }}
            >
              Все навыки
            </a>
            <Arrow
              key={String(isCategoriesOpen)}
              defaultActive={isCategoriesOpen}
              onChange={handleArrowClick}
            />
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

        <div className={styles.themeIcon}>
          <ThemeIcon isDark={isDarkTheme} onClick={handleThemeToggle} />
        </div>

        <div className={styles.controls}>
          <SecondaryButton label='Войти' onClick={handleLoginClick} />
          <PrimaryButton label='Зарегистрироваться' onClick={handleRegisterClick} />
        </div>
      </div>
    </header>
  );
};

export default Header;
