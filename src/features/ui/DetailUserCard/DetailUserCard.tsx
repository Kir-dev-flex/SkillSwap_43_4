import { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';

import editIcon from './icons/edit.svg';
import share from './icons/share.svg';
import more from './icons/more.svg';

import styles from './DetailUserCard.module.css';
import PrimaryButton from '../../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../shared/ui/button/SecondaryButton/SecondaryButton';
import { LikeIcon } from '../../../shared/ui/icon-buttons/like/LikeIcon';

export type TDetailCardProps = {
  images: string[];
  isModal?: boolean;
  isLiked: boolean;
  titleDetailCardSkill: string;
  categorySkill: string;
  description: string;
  onClickLiked: () => void;
  onClickEdit: () => void;
  onClickDone: () => void;
  onClickOffer: () => void;
  modalTitle?: string;
  modalText?: string;
  link?: string;
};

const DetailUserCard: FC<TDetailCardProps> = ({
  images,
  isModal,
  isLiked,
  titleDetailCardSkill,
  categorySkill,
  description,
  onClickLiked,
  onClickEdit,
  onClickDone,
  onClickOffer,
  modalTitle,
  modalText,
  link = '#',
}) => (
  <div className={styles.detailUserCard}>
    {isModal ? (
      <div className={styles.modalContent}>
        <h2 className={styles.modalTitle}>{modalTitle}</h2>
        <p className={styles.modalText}>{modalText}</p>
      </div>
    ) : (
      <div className={styles.cardIcons}>
        <LikeIcon isLiked={isLiked} onClick={onClickLiked} />
        <img src={share} alt='поделиться' />
        <img src={more} alt='ещё' />
      </div>
    )}

    <div className={styles.cardWrapper}>
      <div className={styles.cardInfo}>
        <h1 className={styles.cardTitle}>{titleDetailCardSkill}</h1>
        <p className={styles.cardCategory}>{categorySkill}</p>
        <p className={styles.cardDescription}>{description}</p>

        <div className={styles.cardButtons}>
          {isModal ? (
            <>
              <SecondaryButton
                className={styles.cardButton}
                onClick={onClickEdit}
                label='Редактировать'
                icon={<img src={editIcon} alt='' />}
                iconPosition='right'
              />
              <PrimaryButton className={styles.cardButton} onClick={onClickDone} label='Готово' />
            </>
          ) : (
            <PrimaryButton
              className={styles.cardButton}
              onClick={onClickOffer}
              label='Предложить обмен'
            />
          )}
        </div>
      </div>

      <div className={styles.cardImages}>
        <Swiper spaceBetween={10} navigation modules={[Navigation]} className={styles.mainSwiper}>
          {images.map((img) => (
            <SwiperSlide key={img}>
              <img src={img} className={styles.mainSwiperImage} alt='изображение навыка' />
            </SwiperSlide>
          ))}
        </Swiper>

        {images.length > 1 && (
          <div className={styles.imagesPreviewWrapper}>
            {images.slice(1, 3).map((img) => (
              <img key={img} src={img} className={styles.previewImage} alt='' />
            ))}

            {images.length > 3 && (
              <a href={link} className={styles.lastImageWrapper}>
                <span className={styles.moreImagesText}>+ {images.length - 3}</span>
                <img src={images[3]} className={styles.previewImage} alt='' />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
);

export default DetailUserCard;
