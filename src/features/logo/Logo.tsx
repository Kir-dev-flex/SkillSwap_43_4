import { Link } from 'react-router-dom';
import logo from '../../images/logo.svg';
import styles from './Logo.module.css';

/**
 * Компонент для отображения логотипа приложения
 * @returns React-компонент логотипа со ссылкой на главную страницу
 */
export const Logo = () => (
  <Link to='/' aria-label='На главную' className={styles.logo}>
    <img src={logo} alt='SkillSwap' className={styles.image} />
    <span className={styles.text}>SkillSwap</span>
  </Link>
);
