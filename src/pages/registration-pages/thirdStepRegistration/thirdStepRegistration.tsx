import { FC, useCallback, useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { mockApi } from '../../../api/mockApi';
import RegistrationHeader from '../header/RegistrationHeader';
import StepIndicator from '../../../shared/ui/step-indicator/StepIndicator';
import RegisterDescription from '../../../shared/ui/register-description/RegisterDescription';
import PrimaryButton from '../../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../shared/ui/button/SecondaryButton/SecondaryButton';
import SingleSelect, { Option } from '../../../shared/ui/SingleSelect/SingleSelect';
import DragDropInput, { FileWithPreview } from '../../../shared/ui/DragDropInput/DragDropInput';
import { DetailUserCard } from '../../../features/ui/DetailUserCard/DetailUserCard';
import { Modal } from '../../../features/ui/Modal/Modal';

import schoolBoard from '../../../images/school-board.svg';

import styles from './thirdStepRegistration.module.css';

/**
 * Интерфейс данных формы
 */
interface SkillFormData {
  name: string;
  categoryId: number;
  subcategoryId: number;
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
 * Компонент третьего шага регистрации
 * @returns {JSX.Element} Третий шаг регистрации
 */
const ThirdStepRegistration: FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  } = useForm<SkillFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: '',
      description: '',
      categoryId: 0,
      subcategoryId: 0,
      images: [],
    },
  });

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

  // Обновляем подкатегории при выборе категории
  useEffect(() => {
    const categoryId = watch('categoryId');
    if (categoryId && categoryId > 0) {
      const selectedCategory = categories.find((cat) => cat.id === categoryId);
      if (selectedCategory) {
        setSubcategories(selectedCategory.subcategories);
      }
    } else {
      setSubcategories([]);
    }
  }, [categories, watch]);

  // Преобразование категорий в формат для SingleSelect
  const categoryOptions: Option[] = categories.map((c) => ({
    label: c.name,
    value: c.id.toString(),
  }));

  // Преобразование подкатегорий в формат для SingleSelect
  const subcategoryOptions: Option[] = subcategories.map((sub) => ({
    label: sub.name,
    value: sub.id.toString(),
  }));

  // Обработчик выбора категории
  const handleCategoryChange = (value: string) => {
    const categoryId = parseInt(value, 10);
    setValue('categoryId', categoryId, { shouldValidate: true });
    setValue('subcategoryId', 0, { shouldValidate: true });
    trigger(['categoryId', 'subcategoryId']);
  };

  // Обработчик выбора подкатегории
  const handleSubcategoryChange = (value: string) => {
    setValue('subcategoryId', parseInt(value, 10), { shouldValidate: true });
    trigger('subcategoryId');
  };

  // Обработчик изменения изображений
  const handleImagesChange = (files: FileWithPreview[]) => {
    setValue('images', files, { shouldValidate: true });
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
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });

      setIsPreviewOpen(false);
      setIsModalOpen(true);
    } catch (error) {
      // eslint-disable-next-line no-alert
      alert('Произошла ошибка при сохранении. Попробуйте еще раз.');
    }
  };

  // Обработчик закрытия финального модального окна
  const handleModalClose = () => {
    setIsModalOpen(false);
    window.location.href = '/';
  };

  // Обработчик редактирования (возврат к форме)
  const handleEdit = () => {
    setIsPreviewOpen(false);
  };

  // Обработчик лайка
  const handleLike = () => {};

  // Получение значения формы
  const formValues = watch();

  // Получение названия выбранной категории
  const getCategoryName = () => {
    const { categoryId: catId } = formValues;
    const category = categories.find((cat) => cat.id === catId);
    return category?.name || '';
  };

  // Получение названия выбранной подкатегории
  const getSubcategoryName = () => {
    const { subcategoryId: subId } = formValues;
    const subcategory = subcategories.find((sub) => sub.id === subId);
    return subcategory?.name || '';
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
                        value: 100,
                        message: 'Название должно быть не более 100 символов',
                      },
                    })}
                  />
                </label>

                {errors.name && <span className={styles.errorText}>{errors.name.message}</span>}
              </div>

              <div className={styles.formItem}>
                <label htmlFor='category' className={styles.label}>
                  Категория навыка
                  <SingleSelect
                    id='category'
                    options={categoryOptions}
                    onChange={handleCategoryChange}
                    initialValue='Выберите категорию навыка'
                    error={!!errors.categoryId}
                  />
                  {errors.categoryId && (
                    <span className={styles.errorText}>{errors.categoryId.message}</span>
                  )}
                </label>
              </div>

              <div className={styles.formItem}>
                <label htmlFor='subcategory' className={styles.label}>
                  Подкатегория навыка
                  <SingleSelect
                    id='subcategory'
                    options={subcategoryOptions}
                    onChange={handleSubcategoryChange}
                    initialValue='Выберите подкатегорию навыка'
                    disabled={!formValues.categoryId || formValues.categoryId === 0}
                    error={!!errors.subcategoryId}
                  />
                  {errors.subcategoryId && (
                    <span className={styles.errorText}>{errors.subcategoryId.message}</span>
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
                <SecondaryButton className={styles.button} label='Назад' onClick={handleEdit} />
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
                isLiked={false}
                titleDetailCardSkill={formValues.name || 'Название навыка'}
                categorySkill={`${getCategoryName()}${
                  getSubcategoryName() ? ` • ${getSubcategoryName()}` : ''
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

        {/* Модальное окно */}
        {isModalOpen && (
          <Modal
            isModalOpen={isModalOpen}
            onClose={handleModalClose}
            title='Ваше предложение создано'
            message='Теперь вы можете предложить обмен'
            btnText='Готово'
            imgSrc='../../../../public/icons/done.svg'
          />
        )}
      </div>
    </div>
  );
};

export default ThirdStepRegistration;
