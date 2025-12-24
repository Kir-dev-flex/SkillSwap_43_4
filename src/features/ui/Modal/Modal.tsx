import React, { useEffect, useRef } from 'react';
import PrimaryButton from '../../../shared/ui/button/PrimaryButton/PrimaryButton';
import styles from './Modal.module.css';

/**
 * Пропсы модального окна.
 * Используются для настройки содержимого и поведения всплывающего диалогового окна.
 *
 * @property onClose — обработчик закрытия модального окна; вызывается при нажатии на кнопку;
 *                    принимает необязательное событие клика (React.MouseEvent), если требуется доступ к деталям взаимодействия
 * @property isModalOpen — флаг видимости: true — окно открыто, false — скрыто
 * @property title — заголовок, отображаемый в верхней части содержимого
 * @property message — основной текст сообщения в теле окна
 * @property btnText — текст на кнопке подтверждения/закрытия
 * @property imgSrc — путь к изображению (иконке, иллюстрации), отображаемому над заголовком
 */
export type ModalProps = {
  onClose: (e?: React.MouseEvent) => void;
  isModalOpen: boolean;
  title: string;
  message: string;
  btnText: string;
  imgSrc: string;
};

export const Modal = ({ isModalOpen, onClose, title, message, btnText, imgSrc }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleOverlayClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEsc);
      document.addEventListener('mousedown', handleOverlayClick);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.removeEventListener('mousedown', handleOverlayClick);
    };
  }, [isModalOpen, onClose]);
  if (!isModalOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal} ref={modalRef}>
        <img src={imgSrc} alt='icon' className={styles.icon} />
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <PrimaryButton className={styles.button} label={btnText} onClick={onClose} />
      </div>
    </div>
  );
};
