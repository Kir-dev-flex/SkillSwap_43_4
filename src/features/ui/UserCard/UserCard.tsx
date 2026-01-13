import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar } from '../../../shared/ui/avatar/avatar';
import { LikeIcon } from '../../../shared/ui/icon-buttons/like/LikeIcon';
import PrimaryButton from '../../../shared/ui/button/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../../shared/ui/button/SecondaryButton/SecondaryButton';
import Tag from '../tag/Tag';
import ClockIcon from './icons/ClockIcon';
import { TUserCardProps } from './types';
import { formatUserAge } from '../../../utils/text/ageUtils';

import styles from './UserCard.module.css';

// типы для добавления detailUrl
interface UpdatedUserCardProps extends TUserCardProps {
  userData: TUserCardProps['userData'] & {
    detailUrl?: string;
    skillId?: number;
  };
}

/**
 * Компонент UserCard - карточка пользователя для платформы обмена навыками
 * @param {UpdatedUserCardProps} props - Свойства компонента
 * @returns {JSX.Element} Карточка пользователя
 */
const UserCard: React.FC<UpdatedUserCardProps> = ({
  likedState,
  userData,
  isDetail,
  disabled = false,
  onClickLiked,
  onClickDetail,
}) => {
  const { avatar, name, city, age, about, teach, learn, extraLearnCount, id, skillId } = userData;
  const formattedAge = formatUserAge(age);
  const detailPath = skillId ? `/skill?id=${skillId}` : `/skill?userId=${id}`;

  const handleDetailClick = () => {
    if (onClickDetail) {
      onClickDetail();
    }
  };

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
            {extraLearnCount > 0 && <Tag title={`+${extraLearnCount}`} tagCategory='more' />}
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
                onClick={onClickDetail}
                className={styles.exchangeButton}
              />
            ) : (
              <Link to={detailPath} className={styles.linkWrapper} onClick={handleDetailClick}>
                <PrimaryButton label='Подробнее' className={styles.detailButton} />
              </Link>
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
