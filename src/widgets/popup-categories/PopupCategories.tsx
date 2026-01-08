import React from 'react';
import styles from './PopupCategories.module.css';
import businessIcon from '../../../public/images/icons/briefcase.svg';
import languageIcon from '../../../public/images/icons/global.svg';
import homeIcon from '../../../public/images/icons/home.svg';
import artIcon from '../../../public/images/icons/palette.svg';
import educationIcon from '../../../public/images/icons/book.svg';
import healthIcon from '../../../public/images/icons/lifestyle.svg';
import { Subcategory, Category } from '../../types';

const categoryIcons: Record<number, string> = {
  1: businessIcon,
  2: artIcon,
  3: languageIcon,
  4: educationIcon,
  5: homeIcon,
  6: healthIcon,
};

type CategoriesPopupProps = {
  categories: Category[];
  onSelectSubcategory?: (subcategory: Subcategory) => void;
};

const PopupCategories: React.FC<CategoriesPopupProps> = ({ categories, onSelectSubcategory }) => (
  <nav className={styles.popupCategories}>
    <ul className={styles.categoryList}>
      {categories.map((category) => (
        <li key={category.id} className={styles.categoryItem}>
          <img
            src={categoryIcons[category.id]}
            alt=''
            aria-hidden
            className={styles.categoryIcon}
          />
          <h2 className={styles.categoryTitle}>{category.name}</h2>

          <ul className={styles.subcategoryList}>
            {category.subcategories.map((sub) => (
              <li key={sub.id}>
                <button
                  type='button'
                  className={styles.subcategoryButton}
                  onClick={() => onSelectSubcategory?.(sub)}
                >
                  {sub.name}
                </button>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  </nav>
);

export default PopupCategories;
