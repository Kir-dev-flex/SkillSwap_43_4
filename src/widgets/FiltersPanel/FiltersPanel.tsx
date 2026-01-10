import React, { useState, useEffect, useCallback } from 'react';
import { getCategories, getCities } from '../../api/mockApi';
import { Category, City } from '../../types';
import RadioButton from '../../shared/ui/radio-button/RadioButton';
import Checkbox from '../../features/ui/checkbox/Checkbox';
import Arrow from '../../features/ui/arrow/Arrow';
import styles from './FiltersPanel.module.css';

export type Mode = 'all' | 'wantToLearn' | 'canTeach';

export type Filters = {
  learnType: Mode; // тип обучения: хочет научиться или может научить
  gender: 'Мужской' | 'Женский' | null; // пол
  city: string | null; // город
  skillIds: number[]; // id подкатегории предложения об обмене
};

export type FiltersPanelProps = {
  initialFilters?: Partial<Filters>; // Начальные значения фильтров
  onChange?: (filters: Filters) => void; // функция, выполняемая при изменении
  className?: string;
};

const defaultFilters: Filters = {
  learnType: 'all',
  gender: null,
  city: null,
  skillIds: [],
};

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  initialFilters = {},
  onChange,
  className,
}) => {
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    ...initialFilters,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [expandedCities, setExpandedCities] = useState<boolean>(false);

  // Загрузка данных
  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesData, citiesData] = await Promise.all([getCategories(), getCities()]);
        // Обработка структуры данных categories (может быть объект с полем categories или массив)
        const categoriesList = Array.isArray(categoriesData)
          ? categoriesData
          : (categoriesData as { categories?: Category[] })?.categories || [];
        setCategories(categoriesList);
        setCities(citiesData);
      } catch (error) {
        console.error('Error loading filter data:', error);
      }
    };

    loadData();
  }, []);

  // Функция для обновления фильтров
  const emitChange = useCallback(
    (next: Filters) => {
      setFilters((prevFilters) => {
        // Проверяем, действительно ли изменились фильтры
        const hasChanged =
          prevFilters.learnType !== next.learnType ||
          prevFilters.gender !== next.gender ||
          prevFilters.city !== next.city ||
          prevFilters.skillIds.length !== next.skillIds.length ||
          !prevFilters.skillIds.every((id) => next.skillIds.includes(id)) ||
          !next.skillIds.every((id) => prevFilters.skillIds.includes(id));

        // Вызываем onChange только если фильтры действительно изменились
        if (hasChanged) {
          onChange?.(next);
        }

        return next;
      });
    },
    [onChange]
  );

  // Обработчики для типа обучения
  const handleLearnTypeChange = (value: string) => {
    emitChange({
      ...filters,
      learnType: value as Mode,
    });
  };

  // Обработчики для пола
  const handleGenderChange = (value: string) => {
    emitChange({
      ...filters,
      gender: value === 'Не имеет значения' ? null : (value as 'Мужской' | 'Женский'),
    });
  };

  // Обработчики для навыков (подкатегорий)
  const handleSkillChange = (subcategoryId: number, checked: boolean) => {
    setFilters((prevFilters) => {
      const alreadyIncluded = prevFilters.skillIds.includes(subcategoryId);

      let newSkillIds: number[];
      if (checked && !alreadyIncluded) {
        newSkillIds = [...prevFilters.skillIds, subcategoryId];
      } else if (!checked && alreadyIncluded) {
        newSkillIds = prevFilters.skillIds.filter((id) => id !== subcategoryId);
      } else {
        // Ничего не меняем
        return prevFilters;
      }

      const newFilters = { ...prevFilters, skillIds: newSkillIds };
      onChange?.(newFilters);
      return newFilters;
    });
  };

  // Обработчики для города
  const handleCityChange = (cityId: string) => {
    setFilters((prevFilters) => {
      // Для города может быть выбран только один город
      // Если кликаем на уже выбранный город - снимаем выбор
      // Если кликаем на другой город - выбираем его
      const newCity = prevFilters.city === cityId ? null : cityId;
      const newFilters = { ...prevFilters, city: newCity };

      // Вызываем onChange только если город действительно изменился
      if (prevFilters.city !== newCity) {
        onChange?.(newFilters);
      }

      return newFilters;
    });
  };

  // Переключение раскрытия категории
  const toggleCategory = (categoryId: number) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  // Переключение раскрытия городов
  const toggleCities = (isActive: boolean) => {
    setExpandedCities(isActive);
  };

  // Переключение раскрытия всех категорий
  const toggleAllCategories = () => {
    const allExpanded = categories.length > 0 && categories.every((cat) => expandedCategories.has(cat.id));
    if (allExpanded) {
      // Если все раскрыты - закрываем все
      setExpandedCategories(new Set());
    } else {
      // Если не все раскрыты - раскрываем все
      setExpandedCategories(new Set(categories.map((cat) => cat.id)));
    }
  };

  // Получение выбранных подкатегорий в категории
  const getSelectedSubcategories = (category: Category): number[] =>
    category.subcategories.filter((sub) => filters.skillIds.includes(sub.id)).map((sub) => sub.id);

  // Подсчет количества активных фильтров
  const getActiveFiltersCount = (): number => {
    let count = 0;
    if (filters.learnType !== 'all') count += 1;
    if (filters.gender !== null) count += 1;
    if (filters.city !== null) count += 1;
    // Каждая выбранная подкатегория считается отдельным фильтром
    count += filters.skillIds.length;
    return count;
  };

  // Сброс всех фильтров
  const handleReset = () => {
    emitChange(defaultFilters);
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className={`${styles.filtersPanel} ${className || ''}`}>
      <div className={styles.titleContainer}>
        <h2 className={styles.title}>
          Фильтры{activeFiltersCount > 0 && ` (${activeFiltersCount})`}
        </h2>
        {activeFiltersCount > 0 && (
          <button
            type='button'
            onClick={handleReset}
            className={styles.resetButton}
            aria-label='Сбросить фильтры'
          >
            <span>Сбросить</span>
            <svg
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className={styles.resetIcon}
            >
              <path
                d='M12 4L4 12M4 4L12 12'
                stroke='currentColor'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        )}
      </div>

      {/* Тип обучения */}
      <div className={styles.section}>
        <div className={styles.radioGroup}>
          <RadioButton
            name='learnType'
            value='all'
            checked={filters.learnType === 'all'}
            onChange={handleLearnTypeChange}
            label='Всё'
          />
          <RadioButton
            name='learnType'
            value='wantToLearn'
            checked={filters.learnType === 'wantToLearn'}
            onChange={handleLearnTypeChange}
            label='Хочу научиться'
          />
          <RadioButton
            name='learnType'
            value='canTeach'
            checked={filters.learnType === 'canTeach'}
            onChange={handleLearnTypeChange}
            label='Могу научить'
          />
        </div>
      </div>

      {/* Навыки */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Навыки</h3>
        <div className={styles.categoriesList}>
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            const selectedSubcategories = getSelectedSubcategories(category);
            const hasSelection = selectedSubcategories.length > 0;

            return (
              <div key={category.id} className={styles.categoryItem}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryCheckboxWrapper}>
                    <Checkbox
                      key={`category-checkbox-${category.id}-${hasSelection}`}
                      id={`category-${category.id}`}
                      checked={hasSelection}
                      onChange={() => {
                        // При клике на категорию только раскрываем/сворачиваем список
                        // НЕ выбираем подкатегории автоматически
                        toggleCategory(category.id);
                      }}
                      labelText={category.name}
                      icon={hasSelection ? 'minus' : undefined}
                    />
                  </div>
                  {category.subcategories.length > 0 && (
                    <div className={styles.categoryArrow}>
                      <Arrow
                        key={`arrow-${category.id}-${isExpanded}`}
                        defaultActive={isExpanded}
                        onChange={() => {
                          toggleCategory(category.id);
                        }}
                      />
                    </div>
                  )}
                </div>
                {isExpanded && category.subcategories.length > 0 && (
                  <div className={styles.subcategoriesList}>
                    {category.subcategories.map((subcategory) => (
                      <div key={subcategory.id} className={styles.subcategoryItem}>
                        <Checkbox
                          key={`subcategory-checkbox-${subcategory.id}-${filters.skillIds.includes(
                            subcategory.id
                          )}`}
                          id={`subcategory-${subcategory.id}`}
                          checked={filters.skillIds.includes(subcategory.id)}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            handleSkillChange(subcategory.id, isChecked);
                          }}
                          labelText={subcategory.name}
                          icon='check'
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.allCategories} onClick={toggleAllCategories}>
          <span className={styles.allCategoriesText}>Все категории</span>
          <Arrow
            defaultActive={categories.length > 0 && categories.every((cat) => expandedCategories.has(cat.id))}
            onChange={toggleAllCategories}
          />
        </div>
      </div>

      {/* Пол автора */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Пол автора</h3>
        <div className={styles.radioGroup}>
          <RadioButton
            name='gender'
            value='Не имеет значения'
            checked={filters.gender === null}
            onChange={handleGenderChange}
            label='Не имеет значения'
          />
          <RadioButton
            name='gender'
            value='Мужской'
            checked={filters.gender === 'Мужской'}
            onChange={handleGenderChange}
            label='Мужской'
          />
          <RadioButton
            name='gender'
            value='Женский'
            checked={filters.gender === 'Женский'}
            onChange={handleGenderChange}
            label='Женский'
          />
        </div>
      </div>

      {/* Город */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Город</h3>
        <div className={styles.citiesList}>
          {cities.slice(0, expandedCities ? cities.length : 5).map((city) => (
            <div key={city.id} className={styles.cityItem}>
              <Checkbox
                id={`city-${city.id}`}
                checked={filters.city === city.id}
                onChange={() => handleCityChange(city.id)}
                labelText={city.name}
              />
            </div>
          ))}
        </div>
        {cities.length > 5 && (
          <div className={styles.allCities} onClick={() => toggleCities(!expandedCities)}>
            <span className={styles.allCitiesText}>Все города</span>
            <Arrow defaultActive={expandedCities} onChange={toggleCities} />
          </div>
        )}
      </div>
    </div>
  );
};

export default FiltersPanel;
