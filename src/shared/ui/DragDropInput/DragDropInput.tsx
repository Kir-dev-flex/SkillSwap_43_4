import { FC, useRef, useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import ImageUploadIcon from './icons/ImageUploadIcon';
import styles from './DragDropInput.module.css';

/**
 * Интерфейс файла с превью
 */
export interface FileWithPreview {
  id: string;
  file: File;
  previewUrl: string;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  progress?: number;
  error?: string;
}

/**
 * Пропсы компонента DragDropInput
 */
export interface DragDropInputProps {
  value: FileWithPreview[];
  onChange: (files: FileWithPreview[]) => void;
  label?: string;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
}

/**
 * Компонент Drag and Drop для загрузки файлов
 * @param props - Свойства компонента
 * @returns {JSX.Element} Компонент загрузки файлов
 */
const DragDropInput: FC<DragDropInputProps> = ({
  value = [],
  onChange,
  label = 'Перетащите или выберите изображения навыка',
  multiple = true,
  maxFiles,
  accept = 'image/*',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);

  // Обновляем ref при изменении value
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  // Очистка URL при размонтировании
  useEffect(
    () => () => {
      valueRef.current.forEach((fileWithPreview) => {
        if (fileWithPreview.previewUrl && fileWithPreview.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(fileWithPreview.previewUrl);
        }
      });
    },
    []
  );

  /**
   * Создание превью для файлов
   */
  const createFilePreviews = useCallback(
    (files: File[]): FileWithPreview[] => {
      const currentCount = value.length;
      const remainingSlots = maxFiles ? maxFiles - currentCount : files.length;
      const filesToAdd = maxFiles ? files.slice(0, remainingSlots) : files;

      return filesToAdd.map((file) => ({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        status: 'pending' as const,
      }));
    },
    [value.length, maxFiles]
  );

  /**
   * Обработка добавления файлов
   */
  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files);
      const newFiles = createFilePreviews(fileArray);

      if (multiple) {
        onChange([...value, ...newFiles]);
      } else {
        // Очищаем старые preview URLs
        value.forEach((fileWithPreview) => {
          if (fileWithPreview.previewUrl && fileWithPreview.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(fileWithPreview.previewUrl);
          }
        });
        onChange(newFiles);
      }
    },
    [value, onChange, multiple, createFilePreviews]
  );

  /**
   * Обработка клика по зоне загрузки
   */
  const handleClick = useCallback(() => {
    if (maxFiles && value.length >= maxFiles) return;
    fileInputRef.current?.click();
  }, [maxFiles, value.length]);

  /**
   * Обработка изменения input файла
   */
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
      // Сбрасываем значение input, чтобы можно было выбрать тот же файл снова
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [handleFiles]
  );

  /**
   * Обработка drag over
   */
  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (maxFiles && value.length >= maxFiles) return;
      setIsDragging(true);
    },
    [maxFiles, value.length]
  );

  /**
   * Обработка drag leave
   */
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  /**
   * Проверка, является ли файл изображением
   */
  const isImageFile = useCallback((file: File): boolean => file.type.startsWith('image/'), []);

  /**
   * Обработка drop
   */
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (maxFiles && value.length >= maxFiles) return;

      const { files } = e.dataTransfer;
      if (!files || files.length === 0) return;

      // Фильтруем только изображения при перетаскивании
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(isImageFile);

      if (imageFiles.length === 0) return;

      // Создаем FileList из отфильтрованных файлов
      const dataTransfer = new DataTransfer();
      imageFiles.forEach((file) => dataTransfer.items.add(file));

      handleFiles(dataTransfer.files);
    },
    [maxFiles, value.length, handleFiles, isImageFile]
  );

  /**
   * Удаление файла
   */
  const handleRemoveFile = useCallback(
    (id: string) => {
      const fileToRemove = value.find((f) => f.id === id);
      if (fileToRemove?.previewUrl && fileToRemove.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      onChange(value.filter((f) => f.id !== id));
    },
    [value, onChange]
  );

  const isMaxFilesReached = maxFiles !== undefined && value.length >= maxFiles;
  const hasFiles = value.length > 0;

  return (
    <div className={styles.container}>
      {hasFiles && (
        <div className={styles.fileCount}>
          Изображений {value.length}
          {maxFiles && ` (максимум ${maxFiles})`}
        </div>
      )}
      <div
        ref={dropZoneRef}
        className={clsx(styles.dropZone, {
          [styles.dragging]: isDragging,
          [styles.disabled]: isMaxFilesReached,
        })}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        aria-label={label}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        <input
          ref={fileInputRef}
          type='file'
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          className={styles.fileInput}
          aria-label='Выбрать файлы'
          disabled={isMaxFilesReached}
        />
        <div className={styles.dropZoneContent}>
          <p className={styles.label}>{label}</p>
          <button type='button' className={styles.uploadButton} disabled={isMaxFilesReached}>
            <ImageUploadIcon className={styles.icon} />
            <span>Выбрать изображения</span>
          </button>
        </div>
      </div>
      {hasFiles && (
        <div className={styles.previewContainer}>
          {value.map((fileWithPreview) => (
            <div key={fileWithPreview.id} className={styles.previewItem}>
              <img
                src={fileWithPreview.previewUrl}
                alt={fileWithPreview.file.name}
                className={styles.previewImage}
              />
              <button
                type='button'
                className={styles.removeButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(fileWithPreview.id);
                }}
                aria-label={`Удалить ${fileWithPreview.file.name}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropInput;
