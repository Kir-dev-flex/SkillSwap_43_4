import React from 'react';
import PrimaryButton from '../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../shared/ui/button/SecondaryButton/SecondaryButton';

import Image500 from '../../images/Image500.svg';

import styles from './Error500.module.css';

const Error500: React.FC = () => (
  <div className={styles.container}>
    <div className={styles.image}>
      <img src={Image500} alt='Ошибка 500' className={styles.image} />
    </div>

    <div className={styles.error}>
      <div className={styles.errorText}>
        <h2 className={styles.title}>На сервере произошла ошибка</h2>
        <p className={styles.description}>Попробуйте позже или вернитесь на главную страницу</p>
      </div>
      <div className={styles.buttons}>
        <SecondaryButton label='Сообщить об ошибке' className={styles.buttonItem} />
        <PrimaryButton label='На главную' className={styles.buttonItem} />
      </div>
    </div>
  </div>
);

export default Error500;
