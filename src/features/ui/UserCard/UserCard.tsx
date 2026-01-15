import React from 'react';
import { Avatar } from '../../../shared/ui/avatar/avatar';
import { LikeIcon } from '../../../shared/ui/icon-buttons/like/LikeIcon';
import PrimaryButton from '../../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../shared/ui/button/SecondaryButton/SecondaryButton';
import Tag from '../tag/Tag';
import ClockIcon from './icons/ClockIcon';
import { TUserCardProps } from './types';
import { formatUserAge } from '../../../utils/text/ageUtils';

import styles from './UserCard.module.css';

/**
 * Компонент UserCard - карточка пользователя для платформы обмена навыками
 * @param {TUserCardProps} props - Свойства компонента
 * @returns {JSX.Element} Карточка пользователя
 */
const UserCard: React.FC<TUserCardProps> = ({
  likedState,
  userData,
  isDetail,
  disabled = false,
  onClickLiked,
  onClickDetail,
}) => {
  const { avatar, name, city, age, about, teach, learn } = userData;
  const formattedAge = formatUserAge(age);

  return (
    <div className={`${styles.userCard} ${isDetail ? styles.detailCard : ''}`}>
      <div className={styles.header}>
        <div className={styles.userInfo}>
          <Avatar src={avatar} />
          <div className={styles.userDetails}>
            <h3 className={styles.userName}>{name}</h3>
            <div className={styles.userMeta}>
              <span className={styles.userCity}>{city},</span>
              <span className={styles.userAge}> {formattedAge}</span>
            </div>
          </div>
        </div>

        {/* Иконка лайка - показываем только не на детальной странице */}
        {!isDetail && (
          <div className={styles.likeContainer}>
            <LikeIcon isLiked={likedState} onClick={onClickLiked} />
          </div>
        )}
      </div>

      <div className={styles.info}>
        {/* "О себе" - показываем только если есть текст и на детальной странице */}
        {isDetail && about && (
          <div className={styles.section}>
            <p className={styles.aboutText}>{about}</p>
          </div>
        )}

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Может научить:</h4>
          <div className={`${styles.tagsContainer} ${styles.singleTag}`}>
            {teach.map((skill) => (
              <Tag
                key={`teach-${skill.category}-${skill.title}`}
                title={skill.title}
                tagCategory={skill.category}
              />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Хочет научиться:</h4>
          <div className={styles.tagsContainer}>
            {learn.map((skill) => (
              <Tag
                key={`learn-${skill.category}-${skill.title}`}
                title={skill.title}
                tagCategory={skill.category}
              />
            ))}
            {/* +N теперь формируется в truncateTags на странице, чтобы не дублировать */}
          </div>
        </div>

        {/* Кнопка - показываем только не на детальной странице */}
        {!isDetail && (
          <div className={styles.buttonContainer}>
            {disabled ? (
              <SecondaryButton
                label='Обмен предложен'
                icon={<ClockIcon />}
                iconPosition='right'
                onClick={(e) => {
                  e.stopPropagation();
                  onClickDetail(e);
                }}
                className={styles.exchangeButton}
              />
            ) : (
              <PrimaryButton
                label='Подробнее'
                onClick={(e) => {
                  e.stopPropagation();
                  onClickDetail(e);
                }}
                className={styles.detailButton}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const MemoizedUserCard = React.memo(UserCard);
export { MemoizedUserCard as UserCard };
export default MemoizedUserCard;
