import { FC, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../shared/hooks/storeHooks';
import { mockApi } from '../../api/mockApi';
import { User, Skill } from '../../types';
import { FileWithPreview } from '../../shared/ui/DragDropInput/DragDropInput';
import FirstStepRegistration from './firstStepRegistration/firstStepRegistration';
import SecondStepRegistration from './secondStepRegistration/SecondStepRegistration';
import ThirdStepRegistration from './thirdStepRegistration/thirdStepRegistration';
import { fileToBase64 } from '../../utils/files/fileUtils';
import { calculateAge } from '../../utils/date/dateUtils';

/**
 * Интерфейс данных первого шага
 */
interface Step1Data {
  email: string;
  password: string;
}

/**
 * Интерфейс данных второго шага
 */
interface Step2Data {
  name: string;
  birthdate: Date | null;
  gender: string;
  city: string;
  mainCategories: string[];
  subCategories: string[];
  avatar?: File | null;
}

/**
 * Интерфейс данных третьего шага
 */
interface Step3Data {
  name: string;
  categoryIds: number[];
  subcategoryIds: number[];
  description: string;
  images: FileWithPreview[];
}

/**
 * Преобразование FileWithPreview в base64
 */
const filesToBase64 = async (files: FileWithPreview[]): Promise<string[]> => {
  const promises = files.map((f) => fileToBase64(f.file));
  return Promise.all(promises);
};

/**
 * Общий компонент регистрации, объединяющий все 3 шага
 */
const Registration: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { dispatch } = useAppStore();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Сохраняем данные между шагами
  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Data | null>(null);

  /**
   * Обработчик завершения первого шага
   */
  const handleStep1Complete = useCallback((data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  }, []);

  /**
   * Обработчик завершения второго шага
   */
  const handleStep2Complete = useCallback((data: Step2Data) => {
    setStep2Data(data);
    setCurrentStep(3);
  }, []);

  /**
   * Обработчик возврата на предыдущий шаг
   */
  const handleStepBack = useCallback(() => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 3) {
      setCurrentStep(2);
    }
  }, [currentStep]);

  /**
   * Обработчик завершения регистрации (третий шаг)
   */
  const handleStep3Complete = useCallback(
    async (data: Step3Data) => {
      if (!step1Data || !step2Data) {
        console.error('Missing registration data');
        return;
      }

      // Сохраняем данные третьего шага
      setStep3Data(data);

      try {
        // Преобразуем изображения в base64
        const imageUrls: string[] = [];
        if (data.images && data.images.length > 0) {
          imageUrls.push(...(await filesToBase64(data.images)));
        } else {
          // Если изображений нет, используем дефолтное
          imageUrls.push('/images/default-skill.jpg');
        }

        // Преобразуем аватар в base64
        let avatarUrl = '';
        if (step2Data.avatar) {
          avatarUrl = await fileToBase64(step2Data.avatar);
        }

        // Вычисляем возраст
        const age = step2Data.birthdate ? calculateAge(step2Data.birthdate) : 0;
        const birthDateString = step2Data.birthdate
          ? step2Data.birthdate.toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        // Преобразуем подкатегории из строк в числа
        const subcategoriesWantToLearn = step2Data.subCategories
          .map((id) => parseInt(id, 10))
          .filter((id) => !Number.isNaN(id));

        // Создаем пользователя
        const newUser: Omit<User, 'id'> = {
          name: step2Data.name,
          location: step2Data.city || '',
          age,
          gender: step2Data.gender,
          avatarUrl,
          birthDate: birthDateString,
          email: step1Data.email,
          password: step1Data.password,
          skillCanTeach: data.subcategoryIds[0] || 0, // Используем первую подкатегорию
          subcategoriesWantToLearn,
        };

        const createdUser = await mockApi.createUser(newUser);

        // Создаем навык
        const newSkill: Omit<Skill, 'id'> = {
          title: data.name,
          description: data.description,
          categoryId: data.categoryIds[0] || 0, // Используем первую категорию
          subcategoryId: data.subcategoryIds[0] || 0, // Используем первую подкатегорию
          images: imageUrls,
          userId: createdUser.id,
        };

        const createdSkill = await mockApi.createSkill(newSkill);

        // Сохраняем пользователя в глобальное состояние
        dispatch({ type: 'USER/LOGIN', payload: createdUser });

        // Добавляем пользователя и навык в глобальные списки
        dispatch({ type: 'USERS/ADD_USER', payload: createdUser });
        dispatch({ type: 'SKILLS/ADD_SKILL', payload: createdSkill });

        // Переходим на страницу созданного навыка или возвращаемся на страницу, откуда пришли
        localStorage.setItem('skillJustCreated', 'true');
        const from = (location.state as { from?: string } | undefined)?.from;
        navigate(from || `/skill?id=${createdSkill.id}`, { replace: true });
      } catch (error) {
        console.error('Error during registration:', error);
        // eslint-disable-next-line no-alert
        alert('Произошла ошибка при регистрации. Попробуйте еще раз.');
      }
    },
    [step1Data, step2Data, dispatch, navigate, location]
  );

  // Рендерим соответствующий шаг
  switch (currentStep) {
    case 1:
      return <FirstStepRegistration onComplete={handleStep1Complete} initialData={step1Data} />;
    case 2:
      return (
        <SecondStepRegistration
          onComplete={handleStep2Complete}
          onBack={handleStepBack}
          initialData={step2Data}
        />
      );
    case 3:
      return (
        <ThirdStepRegistration
          onComplete={handleStep3Complete}
          onBack={handleStepBack}
          initialData={step3Data}
        />
      );
    default:
      return null;
  }
};

export default Registration;
