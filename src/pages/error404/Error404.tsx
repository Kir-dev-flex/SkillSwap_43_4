import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../widgets/header/Header';
import Footer from '../../widgets/footer/Footer';
import PrimaryButton from '../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../shared/ui/button/SecondaryButton/SecondaryButton';

import Image404 from '../../images/Image404.svg';

import styles from './Error404.module.css';

const Error404: React.FC = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  return (
    <div>
      <Header />
      <div className={styles.container}>
        <div className={styles.image}>
          <img src={Image404} alt='Ошибка 404' className={styles.image} />
        </div>

        <div className={styles.error}>
          <div className={styles.errorText}>
            <h2 className={styles.title}>Страница не найдена</h2>
            <p className={styles.description}>
              К сожалению, эта страница недоступна. Вернитесь на главную страницу или попробуйте
              позже
            </p>
          </div>
          <div className={styles.buttons}>
            <SecondaryButton label='Сообщить об ошибке' className={styles.buttonItem} />
            <PrimaryButton
              label='На главную'
              className={styles.buttonItem}
              onClick={handleHomeClick}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Error404;
