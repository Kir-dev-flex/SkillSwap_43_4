import { TagCategory } from '../tag/types';

export type TUserCardProps = {
  likedState: boolean;
  userData: TUserData;
  isDetail: boolean;
  disabled?: boolean;
  onClickLiked: () => void;
  onClickDetail: () => void;
};

export type TUserData = {
  avatar: string | null;
  name: string;
  city: string;
  age: number;
  about: string;
  teach: TSkills[];
  learn: TSkills[];
};

export type TSkills = {
  title: string;
  category: TagCategory;
};
