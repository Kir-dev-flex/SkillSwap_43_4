import React, { useState } from 'react';
import styles from './arrow.module.css';
import arrowIcon from '../../../images/arrow.svg';

function Arrow() {
  const [isActive, setIsActive] = useState(false);

  return (
    <button
      className={`${styles.arrowButton} ${isActive ? styles.active : ''}`}
      onClick={() => setIsActive(!isActive)}
      type='button'
    >
      <img className={styles.arrow} src={arrowIcon} alt='иконка стрелка' />
    </button>
  );
}

export default Arrow;
