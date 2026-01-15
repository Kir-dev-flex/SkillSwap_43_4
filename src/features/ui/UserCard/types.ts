import { TagCategory } from '../tag/types';

export type TUserCardProps = {
  likedState: boolean;
  userData: TUserData;
  isDetail: boolean;
  disabled?: boolean;
  onClickLiked: (e?: React.MouseEvent) => void;
  onClickDetail: (e?: React.MouseEvent) => void;
};

export type TUserData = {
  avatar: string | null;
  name: string;
  city: string;
  age: number;
  about: string;
  teach: TSkills[];
  learn: TSkills[];
  extraLearnCount: number;
};

export type TSkills = {
  title: string;
  category: TagCategory;
};
