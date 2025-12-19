import React from 'react';
import { TagCategoryProps } from './types';

import styles from './Tag.module.css';

/**
 * Компонент для отображения тегов с разными категориями
 * @param title - текст тега
 * @param tagCategory - категория тега
 * @returns React-компонент тега
 */
const Tag: React.FC<TagCategoryProps> = ({ title, tagCategory }) => (
  <div className={`${styles.tag} ${styles[tagCategory]}`}>
    <span className={styles.tagText}>{title}</span>
  </div>
);

export default Tag;
