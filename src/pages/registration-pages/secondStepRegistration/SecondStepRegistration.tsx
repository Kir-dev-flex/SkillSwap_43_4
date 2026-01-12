import { FC, useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

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

const SecondStepRegistration: FC = () => {
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid, isDirty },
  } = useForm<UserInfoFormData>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      birthdate: null,
      gender: 'not-specified',
      city: '',
      mainCategories: [],
      subCategories: [],
      avatar: null,
    },
  });

  const navigate = useNavigate();
  const onSubmit: SubmitHandler<UserInfoFormData> = (data) => {
    // eslint-disable-next-line no-console
    console.log('Форма отправлена:', data);
    navigate('/registration/step3');
  };

  const handleAvatarUpload = (file: File) => {
    setValue('avatar', file, { shouldDirty: true, shouldValidate: true });
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
            <input
              type='text'
              placeholder='Имя'
              className={styles.registrationInput}
              {...control.register('name', { required: true })}
            />
          </fieldset>

          {/* Дата рождения и пол */}
          <div className={`${styles.flexWrapper} ${styles.marginBottom}`}>
            <InputWithCalendar
              isOpen={isCalendarOpen}
              onToggle={setIsCalendarOpen}
              value={watch('birthdate')}
              onChange={(date) => setValue('birthdate', date, { shouldDirty: true })}
            />
            <fieldset className={styles.fieldsetFlex}>
              <legend className={styles.legend}>Пол</legend>
              <SingleSelect
                options={genderOptions}
                initialValue={watch('gender')}
                onChange={(val) => setValue('gender', val, { shouldDirty: true })}
              />
            </fieldset>
          </div>

          {/* Город */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Город</legend>
            <SingleSelect
              options={cityOptions}
              initialValue={watch('city')}
              onChange={(val) => setValue('city', val, { shouldDirty: true })}
              placeholder='Не указан'
            />
          </fieldset>

          {/* Категории */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>Категория навыка, которому хотите научиться</legend>
            <MultiSelect
              placeholder='Выберите категорию'
              options={mainCategoryOptions}
              onChange={(val) => {
                const selected = val.split(',');
                setValue('mainCategories', selected, { shouldDirty: true });
                setValue('subCategories', [], { shouldDirty: true }); // сброс подкатегорий
              }}
              initialValue={watch('mainCategories').join(',')}
            />
          </fieldset>

          {/* Подкатегории */}
          <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>
              Подкатегория навыка, которому хотите научиться
            </legend>
            <MultiSelect
              placeholder='Выберите подкатегорию'
              options={subCategoryOptions}
              onChange={(val) => setValue('subCategories', val.split(','), { shouldDirty: true })}
              initialValue={watch('subCategories').join(',')}
            />
          </fieldset>

          {/* Кнопки */}
          <div className={styles.flexWrapper}>
            <SecondaryButton label='Назад' onClick={() => navigate(-1)} />
            <PrimaryButton label='Продолжить' type='submit' disabled={!isValid || !isDirty} />
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
