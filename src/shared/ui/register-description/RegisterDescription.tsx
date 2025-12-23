import { FC } from 'react';
import { RegisterDescriptionProps } from './types';
import styles from './RegisterDescription.module.css';

/**
 * RegisterDescription - компонент для отображения описания шага при регистрации
 * @param {RegisterDescriptionProps} props - Свойства компонента
 * @returns {JSX.Element} Описание шага регистрации
 */
const RegisterDescription: FC<RegisterDescriptionProps> = ({
  svg,
  title,
  description,
}) => (
  <div className={styles.container}>
    <div className={styles.imageWrapper}>
      <img src={svg} alt={title} className={styles.image} />
    </div>
    <div className={styles.content}>
      <h2 className={styles.title}>{title}</h2>
      <p className={styles.description}>{description}</p>
    </div>
  </div>
);

export default RegisterDescription;

