import { FC, useCallback, useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../../api/mockApi';
import RegistrationHeader from '../header/RegistrationHeader';
import StepIndicator from '../../../shared/ui/step-indicator/StepIndicator';
import RegisterDescription from '../../../shared/ui/register-description/RegisterDescription';
import PrimaryButton from '../../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../shared/ui/button/SecondaryButton/SecondaryButton';
import { Option } from '../../../shared/ui/SingleSelect/SingleSelect';
import MultiSelect from '../../../shared/ui/MultiSelect/MultiSelect';
import DragDropInput, { FileWithPreview } from '../../../shared/ui/DragDropInput/DragDropInput';
import { DetailUserCard } from '../../../features/ui/DetailUserCard/DetailUserCard';

import schoolBoard from '../../../images/school-board.svg';

import styles from './thirdStepRegistration.module.css';

/**
 * Интерфейс данных формы
 */
interface SkillFormData {
  name: string;
  categoryIds: number[];
  subcategoryIds: number[];
  description: string;
  images: FileWithPreview[];
}

/**
 * Интерфейс категории для селекта
 */
interface CategoryOption {
  id: number;
  name: string;
  subcategories: SubcategoryOption[];
}

/**
 * Интерфейс подкатегории для селекта
 */
interface SubcategoryOption {
  id: number;
  name: string;
}

/**
 * Пропсы компонента третьего шага регистрации
 */
interface ThirdStepRegistrationProps {
  onComplete?: (data: {
    name: string;
    categoryIds: number[];
    subcategoryIds: number[];
    description: string;
    images: FileWithPreview[];
  }) => void;
  onBack?: () => void;
  initialData?: {
    name: string;
    categoryIds: number[];
    subcategoryIds: number[];
    description: string;
    images: FileWithPreview[];
  } | null;
}

/**
 * Компонент третьего шага регистрации
 * @returns {JSX.Element} Третий шаг регистрации
 */
const ThirdStepRegistration: FC<ThirdStepRegistrationProps> = ({
  onComplete,
  onBack,
  initialData,
}) => {
  const MAX_FILE_SIZE = 2 * 1024 * 1024;
  const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];
  const MAX_IMAGE_FILES = 5;

  const navigate = useNavigate();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [subcategories, setSubcategories] = useState<SubcategoryOption[]>([]);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid },
    trigger,
    register,
    reset,
  } = useForm<SkillFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          categoryIds: initialData.categoryIds,
          subcategoryIds: initialData.subcategoryIds,
          images: initialData.images,
        }
      : {
          name: '',
          description: '',
          categoryIds: [],
          subcategoryIds: [],
          images: [],
        },
  });

  // Регистрируем валидацию для всех полей
  useEffect(() => {
    // Валидация для категорий
    register('categoryIds', {
      required: 'Выберите хотя бы одну категорию',
      validate: (value) => {
        if (value.length === 0) return 'Выберите хотя бы одну категорию';
        return true;
      },
    });

    // Валидация для подкатегорий
    register('subcategoryIds', {
      required: 'Выберите хотя бы одну подкатегорию',
      validate: (value) => {
        if (value.length === 0) return 'Выберите хотя бы одну подкатегорию';
        return true;
      },
    });

    // Валидация для изображений
    register('images', {
      required: 'Загрузите хотя бы одно изображение',
      validate: (files: FileWithPreview[]) => {
        if (!files || files.length === 0) {
          return 'Загрузите хотя бы одно изображение';
        }

        if (files.length > MAX_IMAGE_FILES) {
          return `Можно загрузить не более ${MAX_IMAGE_FILES} изображений`;
        }

        return true;
      },
    });
  }, [register]);

  // Восстанавливаем данные при изменении initialData
  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description,
        categoryIds: initialData.categoryIds,
        subcategoryIds: initialData.subcategoryIds,
        images: initialData.images,
      });
    }
  }, [initialData, reset]);

  // Получение значения формы
  const formValues = watch();
  const categoryIdsValue = watch('categoryIds');

  // Загружаем категории при монтировании
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await mockApi.getCategories();

        if (Array.isArray(data)) {
          setCategories(data as CategoryOption[]);
        } else if (data && typeof data === 'object' && 'categories' in data) {
          setCategories((data as { categories: CategoryOption[] }).categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        setCategories([]);
      }
    };
    loadCategories();
  }, []);

  // Обновляем подкатегории при выборе категорий
  useEffect(() => {
    if (categoryIdsValue && categoryIdsValue.length > 0) {
      const allSubcategories: SubcategoryOption[] = [];
      categoryIdsValue.forEach((categoryId) => {
        const selectedCategory = categories.find((cat) => cat.id === categoryId);
        if (selectedCategory) {
          allSubcategories.push(...selectedCategory.subcategories);
        }
      });
      setSubcategories(allSubcategories);

      // Если были выбраны подкатегории, которые больше не доступны - очищаем их
      if (formValues.subcategoryIds.length > 0) {
        const validSubcategoryIds = formValues.subcategoryIds.filter((subId) =>
          allSubcategories.some((sub) => sub.id === subId)
        );
        if (validSubcategoryIds.length !== formValues.subcategoryIds.length) {
          setValue('subcategoryIds', validSubcategoryIds, { shouldValidate: true });
        }
      }
    } else {
      setSubcategories([]);
      // Очищаем подкатегории, если нет выбранных категорий
      if (formValues.subcategoryIds.length > 0) {
        setValue('subcategoryIds', [], { shouldValidate: true });
      }
    }
  }, [categoryIdsValue, categories, formValues.subcategoryIds, setValue]);

  // Преобразование категорий
  const categoryOptions: Option[] = categories.map((c) => ({
    label: c.name,
    value: c.id.toString(),
  }));

  // Преобразование подкатегорий
  const subcategoryOptions: Option[] = subcategories.map((sub) => ({
    label: sub.name,
    value: sub.id.toString(),
  }));

  // Обработчик выбора категории
  const handleCategoryChange = (value: string) => {
    const ids = value
      .split(',')
      .filter(Boolean)
      .map((v) => parseInt(v, 10));
    setValue('categoryIds', ids, { shouldValidate: true });

    // Очищаем подкатегории при изменении категорий
    if (ids.length === 0) {
      setValue('subcategoryIds', [], { shouldValidate: true });
      setSubcategories([]);
    }

    trigger(['categoryIds', 'subcategoryIds']);
  };

  // Обработчик выбора подкатегории
  const handleSubcategoryChange = (value: string) => {
    const ids = value
      .split(',')
      .filter(Boolean)
      .map((v) => parseInt(v, 10));
    setValue('subcategoryIds', ids, { shouldValidate: true });
    trigger('subcategoryIds');
  };

  // Обработчик изменения изображений
  const handleImagesChange = (files: FileWithPreview[]) => {
    // Фильтруем файлы по валидации
    const validFiles = files.filter((fileWithPreview) => {
      const { file } = fileWithPreview;
      const isValidType = ACCEPTED_IMAGE_TYPES.includes(file.type);
      const isValidSize = file.size <= MAX_FILE_SIZE;
      return isValidType && isValidSize;
    });

    if (files.length !== validFiles.length) {
      const invalidFiles = files.filter((f) => !validFiles.includes(f));
      invalidFiles.forEach((f) => {
        if (!ACCEPTED_IMAGE_TYPES.includes(f.file.type)) {
          // eslint-disable-next-line no-alert
          alert(`Файл "${f.file.name}" отклонен: допустимы только JPEG/PNG`);
        } else if (f.file.size > MAX_FILE_SIZE) {
          // eslint-disable-next-line no-alert
          alert(`Файл "${f.file.name}" отклонен: размер превышает 2 MB`);
        }
      });
    }

    // Ограничиваем количество
    const finalFiles = validFiles.slice(0, MAX_IMAGE_FILES);

    setValue('images', finalFiles, { shouldValidate: true });
    trigger('images');
  };

  // Обработчик выхода из регистрации
  const handleExitRegistration = () => {
    navigate(-1);
  };

  // Обработчик отправки формы для просмотра превью
  const handlePreviewSubmit: SubmitHandler<SkillFormData> = useCallback(async () => {
    const formIsValid = await trigger();
    if (formIsValid) {
      setIsPreviewOpen(true);
    }
  }, [trigger]);

  // Обработчик завершения регистрации
  const handleCompleteRegistration = async () => {
    try {
      const formData = watch();

      if (onComplete) {
        // Вызываем onComplete с данными формы (уже в формате FileWithPreview)
        onComplete({
          name: formData.name,
          categoryIds: formData.categoryIds,
          subcategoryIds: formData.subcategoryIds,
          description: formData.description,
          images: formData.images,
        });
      } else {
        // Старая логика, если onComplete не передан
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });

        setIsPreviewOpen(false);
      }
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Произошла ошибка при сохранении. Попробуйте еще раз.');
    }
  };

  // Обработчик редактирования (возврат к форме)
  const handleEdit = () => {
    setIsPreviewOpen(false);
  };

  // Обработчик лайка
  const handleLike = () => {};

  // Получение названия выбранной категории
  const getCategoryNames = () => {
    const { categoryIds } = formValues;

    return categories
      .filter((cat) => categoryIds.includes(cat.id))
      .map((cat) => cat.name)
      .join(', ');
  };

  // Получение названия выбранной подкатегории
  const getSubcategoryNames = () => {
    const { subcategoryIds } = formValues;

    return subcategories
      .filter((sub) => subcategoryIds.includes(sub.id))
      .map((sub) => sub.name)
      .join(', ');
  };

  const getPreviewImages = () => formValues.images.map((file) => file.previewUrl);

  return (
    <div className={styles.container}>
      <RegistrationHeader buttonLabel='Выйти' onButtonClick={handleExitRegistration} />

      <div className={styles.content}>
        <div className={styles.stepIndicator}>
          <StepIndicator currentStep={3} totalSteps={3} />
        </div>

        <div className={styles.mainContent}>
          <div className={styles.formSection}>
            <form className={styles.form} onSubmit={handleSubmit(handlePreviewSubmit)}>
              <div className={styles.formItem}>
                <label htmlFor='skillName' className={styles.label}>
                  Название навыка
                  <input
                    id='skillName'
                    type='text'
                    className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                    placeholder='Введите название вашего навыка'
                    {...register('name', {
                      required: 'Название навыка обязательно',
                      minLength: {
                        value: 3,
                        message: 'Название должно быть не менее 3 символов',
                      },
                      maxLength: {
                        value: 50,
                        message: 'Название должно быть не более 50 символов',
                      },
                    })}
                  />
                </label>

                {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
              </div>

              <div className={styles.formItem}>
                <label htmlFor='category' className={styles.label}>
                  Категория навыка
                  <MultiSelect
                    id='category'
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    initialValue={formValues.categoryIds.map((id) => id.toString()).join(',')}
                    placeholder='Выберите категории навыка'
                    maxSelections={5}
                  />
                  {errors.categoryIds && (
                    <span className={styles.errorText}>{errors.categoryIds.message}</span>
                  )}
                </label>
              </div>

              <div className={styles.formItem}>
                <label htmlFor='subcategory' className={styles.label}>
                  Подкатегория навыка
                  <MultiSelect
                    id='subcategory'
                    options={subcategoryOptions}
                    onChange={handleSubcategoryChange}
                    initialValue={
                      formValues.categoryIds.length === 0
                        ? ''
                        : formValues.subcategoryIds.map((id) => id.toString()).join(',')
                    }
                    placeholder='Выберите подкатегории навыка'
                    disabled={formValues.categoryIds.length === 0}
                    maxSelections={5}
                  />
                  {errors.subcategoryIds && (
                    <span className={styles.errorText}>{errors.subcategoryIds.message}</span>
                  )}
                </label>
              </div>

              <div className={styles.formItem}>
                <label htmlFor='description' className={styles.label}>
                  Описание
                  <textarea
                    id='description'
                    className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
                    placeholder='Коротко опишите, чему можете научить'
                    rows={4}
                    {...register('description', {
                      required: 'Описание обязательно',
                      minLength: {
                        value: 1,
                        message: 'Описание должно быть не менее 1 символа',
                      },
                      maxLength: {
                        value: 500,
                        message: 'Описание должно быть не более 500 символов',
                      },
                    })}
                  />
                  {errors.description && (
                    <span className={styles.errorText}>{errors.description.message}</span>
                  )}
                </label>
              </div>

              <div className={styles.formItem}>
                <DragDropInput
                  value={formValues.images}
                  onChange={handleImagesChange}
                  label='Перетащите или выберите изображения навыка'
                  maxFiles={5}
                  accept='image/*'
                />
              </div>

              <div className={styles.buttons}>
                <SecondaryButton
                  className={styles.button}
                  label='Назад'
                  onClick={() => {
                    if (onBack) {
                      onBack();
                    } else {
                      handleEdit();
                    }
                  }}
                />
                <PrimaryButton
                  className={styles.button}
                  type='submit'
                  label='Продолжить'
                  disabled={!isValid}
                />
              </div>
            </form>
          </div>

          <div className={styles.descriptionSection}>
            <RegisterDescription
              svg={schoolBoard}
              title='Укажите, чем вы готовы поделиться'
              description='Так другие люди смогут увидеть ваши предложения и предложить вам обмен!'
            />
          </div>
        </div>

        {/* Модальное окно превью карточки */}
        {isPreviewOpen && (
          <div className={styles.previewOverlay}>
            <div className={styles.previewContainer}>
              <DetailUserCard
                images={
                  getPreviewImages().length > 0 ? getPreviewImages() : ['/images/default-skill.jpg']
                }
                isModal
                isLiked={false}
                titleDetailCardSkill={formValues.name || 'Название навыка'}
                categorySkill={`${getCategoryNames()}${
                  getSubcategoryNames() ? ` • ${getSubcategoryNames()}` : ''
                }`}
                description={formValues.description || 'Описание навыка'}
                onClickLiked={handleLike}
                onClickEdit={handleEdit}
                onClickDone={handleCompleteRegistration}
                onClickOffer={() => {}}
                modalTitle='Ваше предложение'
                modalText='Пожалуйста, проверьте и подтвердите правильность данных'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThirdStepRegistration;
