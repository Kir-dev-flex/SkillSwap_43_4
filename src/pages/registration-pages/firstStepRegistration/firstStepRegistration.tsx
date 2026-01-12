import { FC, useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import RegistrationHeader from '../header/RegistrationHeader';
import StepIndicator from '../../../shared/ui/step-indicator/StepIndicator';
import RegisterDescription from '../../../shared/ui/register-description/RegisterDescription';
import PrimaryButton from '../../../shared/ui/button/PrimaryButton/PrimaryButton';
import lightBulb from '../../../images/lightBulb.svg';
import GoogleIcon from './icons/GoogleIcon';
import AppleIcon from './icons/AppleIcon';

import styles from './firstStepRegistration.module.css';

/**
 * Интерфейс данных формы регистрации
 */
interface RegistrationFormData {
  email: string;
  password: string;
}

/**
 * Пропсы компонента первого шага регистрации
 */
interface FirstStepRegistrationProps {
  onComplete?: (data: RegistrationFormData) => void;
  initialData?: RegistrationFormData | null;
}

/**
 * Компонент первого шага регистрации
 * @returns {JSX.Element} Первый шаг регистрации
 */
const FirstStepRegistration: FC<FirstStepRegistrationProps> = ({ onComplete, initialData }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
  } = useForm<RegistrationFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: initialData || {
      email: '',
      password: '',
    },
  });

  // Восстанавливаем данные при изменении initialData
  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const onSubmit: SubmitHandler<RegistrationFormData> = (data) => {
    if (onComplete) {
      onComplete(data);
    } else {
      // Если onComplete не передан, используем старую логику
      // eslint-disable-next-line no-console
      console.log('Registration data:', data);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleGoogleClick = () => {
    // eslint-disable-next-line no-alert
    alert('Сервис недоступен');
  };

  const handleAppleClick = () => {
    // eslint-disable-next-line no-alert
    alert('Сервис недоступен');
  };

  return (
    <div className={styles.container}>
      <RegistrationHeader buttonLabel='Закрыть' onButtonClick={handleClose} />
      <div className={styles.content}>
        <div className={styles.stepIndicator}>
          <StepIndicator currentStep={1} totalSteps={3} />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.formSection}>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <button type='button' onClick={handleGoogleClick} className={styles.socialButton}>
                <GoogleIcon />
                <span>Продолжить с Google</span>
              </button>
              <button type='button' onClick={handleAppleClick} className={styles.socialButton}>
                <AppleIcon />
                <span>Продолжить с Apple</span>
              </button>
              <div className={styles.separator}>
                <span>или</span>
              </div>
              <div className={styles.field}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor='email' className={styles.label}>
                  Email
                </label>
                <input
                  id='email'
                  type='email'
                  className={clsx(styles.input, {
                    [styles.inputError]: errors.email,
                  })}
                  placeholder='Введите email'
                  {...register('email', {
                    required: 'Email обязателен для заполнения',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Некорректный email',
                    },
                  })}
                />
                {errors.email && <span className={styles.errorText}>{errors.email.message}</span>}
              </div>
              <div className={styles.field}>
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor='password' className={styles.label}>
                  Пароль
                </label>
                <div className={styles.passwordWrapper}>
                  <input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    className={clsx(styles.input, styles.passwordInput, {
                      [styles.inputError]: errors.password,
                    })}
                    placeholder='Придумайте надёжный пароль'
                    {...register('password', {
                      required: 'Пароль обязателен для заполнения',
                      minLength: {
                        value: 8,
                        message: 'Пароль должен содержать не менее 8 знаков',
                      },
                    })}
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword(!showPassword)}
                    className={styles.eyeButton}
                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                  >
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      {showPassword ? (
                        <path
                          d='M10 3.75C5.83333 3.75 2.275 6.34167 0.833333 10C2.275 13.6583 5.83333 16.25 10 16.25C14.1667 16.25 17.725 13.6583 19.1667 10C17.725 6.34167 14.1667 3.75 10 3.75ZM10 14.5833C7.41667 14.5833 5.41667 12.5833 5.41667 10C5.41667 7.41667 7.41667 5.41667 10 5.41667C12.5833 5.41667 14.5833 7.41667 14.5833 10C14.5833 12.5833 12.5833 14.5833 10 14.5833ZM10 7.08333C8.625 7.08333 7.5 8.20833 7.5 10C7.5 11.7917 8.625 12.9167 10 12.9167C11.375 12.9167 12.5 11.7917 12.5 10C12.5 8.20833 11.375 7.08333 10 7.08333Z'
                          fill='#253017'
                        />
                      ) : (
                        <path
                          d='M2.5 2.5L17.5 17.5M8.15833 8.15833C7.84167 8.475 7.5 9.2 7.5 10C7.5 11.7917 8.625 12.9167 10 12.9167C10.8 12.9167 11.525 12.575 11.8417 12.2583M15.175 15.175C13.8833 15.9917 12.0083 16.25 10 16.25C5.83333 16.25 2.275 13.6583 0.833333 10C1.40833 8.51667 2.34167 7.25833 3.5 6.325M6.66667 6.66667C5.28333 7.48333 4.16667 8.64167 3.33333 10'
                          stroke='#253017'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      )}
                    </svg>
                  </button>
                </div>
                {errors.password && (
                  <span className={styles.errorText}>{errors.password.message}</span>
                )}
                {!errors.password && (
                  <span className={styles.hintText}>Пароль должен содержать не менее 8 знаков</span>
                )}
              </div>
              <PrimaryButton
                type='submit'
                label='Далее'
                disabled={!isValid || !isDirty}
                className={styles.submitButton}
              />
            </form>
          </div>
          <div className={styles.descriptionSection}>
            <RegisterDescription
              svg={lightBulb}
              title='Добро пожаловать в SkillSwap!'
              description='Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstStepRegistration;
