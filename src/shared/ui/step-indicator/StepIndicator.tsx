import { FC } from 'react';
import clsx from 'clsx';
import { StepIndicatorProps } from './types';
import styles from './StepIndicator.module.css';

/**
 * StepIndicator - компонент для отображения номера шага при регистрации
 * @param {StepIndicatorProps} props - Свойства компонента
 * @returns {JSX.Element} Индикатор шага
 */
const StepIndicator: FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => (
  <div className={styles.container}>
    <div className={styles.text}>
      Шаг {currentStep} из {totalSteps}
    </div>
    <div className={styles.bars}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber <= currentStep;
        return (
          <div
            key={stepNumber}
            className={clsx(styles.bar, {
              [styles.barActive]: isCompleted,
            })}
          />
        );
      })}
    </div>
  </div>
);

export default StepIndicator;
