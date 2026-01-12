import { FC, useEffect, useState } from 'react';
import { useForm, type SubmitHandler, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

import styles from './SecondStepRegistration.module.css';
import userInfoSvg from '../../../images/user-info.svg';
import StepIndicator from '../../../shared/ui/step-indicator/StepIndicator';
import InputWithCalendar from '../../../shared/ui/inputWithCalendar/InputWithCalendar';
import { UploadingAvatar } from '../../../features/ui/UploadingAvatar/UploadingAvatar';
import MultiSelect from '../../../shared/ui/MultiSelect/MultiSelect';
import SingleSelect from '../../../shared/ui/SingleSelect/SingleSelect';
import PrimaryButton from '../../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../shared/ui/button/SecondaryButton/SecondaryButton';
import RegisterDescription from '../../../shared/ui/register-description/RegisterDescription';
import RegistrationHeader from '../header/RegistrationHeader';
import { getCities, getCategories } from '../../../api/mockApi';
import { City, Category } from '../../../types';

interface UserInfoFormData {
  name: string;
  birthdate: Date | null;
  gender: string;
  city: string;
  mainCategories: string[];
  subCategories: string[];
  avatar?: File | null;
}

interface SecondStepRegistrationProps {
  onComplete?: (data: UserInfoFormData) => void;
  onBack?: () => void;
  initialData?: UserInfoFormData | null;
}

const SecondStepRegistration: FC<SecondStepRegistrationProps> = ({
  onComplete,
  onBack,
  initialData,
}) => {
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isDirty },
    trigger,
  } = useForm<UserInfoFormData>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: initialData || {
      name: '',
      birthdate: null,
      gender: 'not-specified',
      city: '',
      mainCategories: [],
      subCategories: [],
      avatar: null,
    },
  });

  // Восстанавливаем данные при изменении initialData
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const navigate = useNavigate();
  const onSubmit: SubmitHandler<UserInfoFormData> = (data) => {
    if (onComplete) {
      onComplete(data);
    } else {
      // Если onComplete не передан, используем старую логику
      // eslint-disable-next-line no-console
      console.log('Форма отправлена:', data);
      navigate('/registration-step-3');
    }
  };

  const handleAvatarUpload = (file: File) => {
    setValue('avatar', file, { shouldDirty: true, shouldValidate: true });
  };

  const handleFieldBlur = (fieldName: keyof UserInfoFormData) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    trigger(fieldName);
  };

  const handleFieldChange = (fieldName: keyof UserInfoFormData) => {
    if (!touchedFields.has(fieldName)) {
      setTouchedFields((prev) => new Set(prev).add(fieldName));
    }
  };

  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    getCities().then(setCities).catch(console.error);
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const cityOptions = cities.map((c) => ({ label: c.name, value: c.id }));
  const genderOptions = [
    { label: 'Не указан', value: 'not-specified' },
    { label: 'Мужской', value: 'male' },
    { label: 'Женский', value: 'female' },
  ];

  const mainCategoryOptions = categories.map((c) => ({ label: c.name, value: c.id.toString() }));

  const selectedMainCategories = watch('mainCategories');
  const firstMainCategoryId = selectedMainCategories[0];

  const subCategoryOptions: { label: string; value: string }[] = firstMainCategoryId
    ? (categories.find((c) => c.id.toString() === firstMainCategoryId)?.subcategories || []).map(
        (sub) => ({
          label: sub.name,
          value: sub.id.toString(),
        })
      )
    : [];

  return (
    <div>
      <RegistrationHeader />
      <StepIndicator currentStep={2} totalSteps={3} />

      <div className={styles.registrationWrapper}>
        <form className={styles.registrationColumn} onSubmit={handleSubmit(onSubmit)}>
          {/* Аватар */}
          <UploadingAvatar onUpload={handleAvatarUpload} />

          {/* Имя */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Имя</legend>
            <Controller
              name='name'
              control={control}
              rules={{
                required: 'Имя обязательно для заполнения',
              }}
              render={({ field }) => (
                <>
                  <input
                    type='text'
                    placeholder='Имя'
                    className={clsx(styles.registrationInput, {
                      [styles.inputError]: touchedFields.has('name') && errors.name,
                    })}
                    {...field}
                    onBlur={(e) => {
                      field.onBlur();
                      handleFieldBlur('name');
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      handleFieldChange('name');
                    }}
                  />
                  {touchedFields.has('name') && errors.name && (
                    <span className={styles.errorText}>{errors.name.message}</span>
                  )}
                </>
              )}
            />
          </fieldset>

          {/* Дата рождения и пол */}
          <div className={`${styles.flexWrapper} ${styles.marginBottom}`}>
            <div className={styles.fieldsetFlex}>
              <Controller
                name='birthdate'
                control={control}
                rules={{
                  required: 'Дата рождения обязательна для заполнения',
                }}
                render={({ field }) => (
                  <>
                    <InputWithCalendar
                      isOpen={isCalendarOpen}
                      onToggle={(open) => {
                        setIsCalendarOpen(open);
                        if (open) {
                          // Когда календарь открывается, помечаем поле как touched
                          handleFieldChange('birthdate');
                        } else {
                          // Когда календарь закрывается, считаем что поле потеряло фокус
                          handleFieldBlur('birthdate');
                        }
                      }}
                      value={field.value}
                      onChange={(date) => {
                        field.onChange(date);
                        setValue('birthdate', date, { shouldDirty: true });
                        handleFieldChange('birthdate');
                      }}
                    />
                    {touchedFields.has('birthdate') && errors.birthdate && (
                      <span className={styles.errorText}>{errors.birthdate.message}</span>
                    )}
                  </>
                )}
              />
            </div>
            <fieldset className={styles.fieldsetFlex}>
              <legend className={styles.legend}>Пол</legend>
              <Controller
                name='gender'
                control={control}
                rules={{
                  required: 'Пол обязателен для заполнения',
                  validate: (value) => value !== 'not-specified' || 'Пол обязателен для заполнения',
                }}
                render={({ field }) => (
                  <>
                    <SingleSelect
                      options={genderOptions}
                      initialValue={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        setValue('gender', val, { shouldDirty: true });
                        handleFieldChange('gender');
                        if (touchedFields.has('gender')) {
                          trigger('gender');
                        }
                      }}
                      error={touchedFields.has('gender') && !!errors.gender}
                    />
                    {touchedFields.has('gender') && errors.gender && (
                      <span className={styles.errorText}>{errors.gender.message}</span>
                    )}
                  </>
                )}
              />
            </fieldset>
          </div>

          {/* Город */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Город</legend>
            <Controller
              name='city'
              control={control}
              rules={{
                required: 'Город обязателен для заполнения',
              }}
              render={({ field }) => (
                <>
                  <SingleSelect
                    options={cityOptions}
                    initialValue={field.value}
                    onChange={(val) => {
                      field.onChange(val);
                      setValue('city', val, { shouldDirty: true });
                      handleFieldChange('city');
                      if (touchedFields.has('city')) {
                        trigger('city');
                      }
                    }}
                    placeholder='Не указан'
                    error={touchedFields.has('city') && !!errors.city}
                  />
                  {touchedFields.has('city') && errors.city && (
                    <span className={styles.errorText}>{errors.city.message}</span>
                  )}
                </>
              )}
            />
          </fieldset>

          {/* Категории */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Категория навыка, которому хотите научиться</legend>
            <Controller
              name='mainCategories'
              control={control}
              rules={{
                required: 'Категория обязательна для заполнения',
                validate: (value) => value.length > 0 || 'Категория обязательна для заполнения',
              }}
              render={({ field }) => (
                <>
                  <MultiSelect
                    placeholder='Выберите категорию'
                    options={mainCategoryOptions}
                    onChange={(val) => {
                      const selected = val.split(',');
                      field.onChange(selected);
                      setValue('mainCategories', selected, { shouldDirty: true });
                      setValue('subCategories', [], { shouldDirty: true }); // сброс подкатегорий
                      handleFieldChange('mainCategories');
                      if (touchedFields.has('mainCategories')) {
                        trigger('mainCategories');
                      }
                    }}
                    initialValue={field.value.join(',')}
                  />
                  {touchedFields.has('mainCategories') && errors.mainCategories && (
                    <span className={styles.errorText}>{errors.mainCategories.message}</span>
                  )}
                </>
              )}
            />
          </fieldset>

          {/* Подкатегории */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              Подкатегория навыка, которому хотите научиться
            </legend>
            <Controller
              name='subCategories'
              control={control}
              rules={{
                required: 'Подкатегория обязательна для заполнения',
                validate: (value) => value.length > 0 || 'Подкатегория обязательна для заполнения',
              }}
              render={({ field }) => (
                <>
                  <MultiSelect
                    placeholder='Выберите подкатегорию'
                    options={subCategoryOptions}
                    onChange={(val) => {
                      const selected = val.split(',');
                      field.onChange(selected);
                      setValue('subCategories', selected, { shouldDirty: true });
                      handleFieldChange('subCategories');
                      if (touchedFields.has('subCategories')) {
                        trigger('subCategories');
                      }
                    }}
                    initialValue={field.value.join(',')}
                  />
                  {touchedFields.has('subCategories') && errors.subCategories && (
                    <span className={styles.errorText}>{errors.subCategories.message}</span>
                  )}
                </>
              )}
            />
          </fieldset>

          {/* Кнопки */}
          <div className={styles.flexWrapper}>
            <SecondaryButton
              label='Назад'
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  navigate(-1);
                }
              }}
            />
            <PrimaryButton
              label='Продолжить'
              type='submit'
              disabled={!isValid || !isDirty || touchedFields.size === 0}
            />
          </div>
        </form>

        {/* Блок с описанием */}
        <div className={styles.registrationColumn}>
          <RegisterDescription
            svg={userInfoSvg}
            title='Расскажите немного о себе'
            description='Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена'
          />
        </div>
      </div>
    </div>
  );
};

export default SecondStepRegistration;
