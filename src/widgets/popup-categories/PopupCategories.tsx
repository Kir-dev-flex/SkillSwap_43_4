import React from 'react';
import styles from './PopupCategories.module.css';
import businessIcon from '../../../../images/icons/briefcase.svg?url';
import languageIcon from '../../../../images/icons/global.svg?url';
import homeIcon from '../../../../images/icons/home.svg?url';
import artIcon from '../../../../images/icons/palette.svg?url';
import educationIcon from '../../../../images/icons/book.svg?url';
import healthIcon from '../../../../images/icons/lifestyle.svg?url';
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
