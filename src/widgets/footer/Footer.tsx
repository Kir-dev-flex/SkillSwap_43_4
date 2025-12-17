import React from 'react';

import styles from './Footer.module.css';

/**
 * Footer - Нижнняя часть страницы
 * @returns Компонент Footer
 */
const Footer: React.FC = () => (
  <footer className={styles.footer}>
    <div className={styles.container}>
      <div className={styles.logo}>
        {/* Логотип */}
        <span className={styles.logoText}>SkillSwap</span>
      </div>

      <div className={styles.navGrid}>
        <nav className={`${styles.column}`} aria-label='О проекте и навыках'>
          <a className={styles.link} href='#about'>
            О проекте
          </a>
          <a className={styles.link} href='#skills'>
            Все навыки
          </a>
        </nav>

        <nav className={`${styles.column}`} aria-label='О контактах и блоге'>
          <a className={styles.link} href='#contacts'>
            Контакты
          </a>
          <a className={styles.link} href='#blog'>
            Блог
          </a>
        </nav>

        <nav className={`${styles.column}`} aria-label='О конфиденциальности и соглашении'>
          <a className={styles.link} href='#privacy'>
            Политика конфиденциальности
          </a>
          <a className={styles.link} href='#terms'>
            Пользовательское соглашение
          </a>
        </nav>
      </div>

      <div className={styles.copyright}>SkillSwap — 2025</div>
    </div>
  </footer>
);

export default Footer;
