import React, { useState } from 'react';
import { Logo } from '../../features/logo/Logo';
import Arrow from '../../features/ui/arrow/Arrow';
import Search from '../../features/ui/search/Search';
import ThemeIcon from '../../shared/ui/icon-buttons/theme/ThemeIcon';
import PrimaryButton from '../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../shared/ui/button/SecondaryButton/SecondaryButton';

import styles from './Header.module.css';

/**
 * Header - основной компонент шапки сайта
 * @returns {JSX.Element} Шапка сайта
 */
const Header: React.FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  const handleThemeToggle = () => {
    setIsDarkTheme((prevTheme) => {
      const newTheme = !prevTheme;
      return newTheme;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleArrowClick = (_isActive: boolean) => {};

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
          <div className={styles.arrow}>
            <a className={styles.link} href='#skills'>
              Все навыки
            </a>
            <Arrow onChange={handleArrowClick} />
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
