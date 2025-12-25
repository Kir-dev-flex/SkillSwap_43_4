export interface Subcategory {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  subcategories: Subcategory[];
}

export interface City {
  id: string;
  name: string;
}

export interface Like {
  id: number;
  userId: number;
  likedUserId: number;
  likedAt: string;
}

export interface Notification {
  id: number;
  type: 'exchange_proposed' | 'exchange_accepted' | 'exchange_declined';
  title: string;
  message: string;
  relatedUserId: number;
  skillId: number;
  createdAt: string;
  isRead: boolean;
}

export interface Skill {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  subcategoryId: number;
  images: string[];
  userId: number;
}

export interface User {
  id: number;
  name: string;
  location: string;
  age: number;
  gender: string;
  avatarUrl: string;
  birthDate: string;
  email: string;
  password: string;
  skillCanTeach: number;
  subcategoriesWantToLearn: number[];
}

// Типы для ответов API
export type UsersResponse = User[];
export type CategoriesResponse = Category[];
export type CitiesResponse = City[];
export type LikesResponse = Like[];
export type NotificationsResponse = Notification[];
export type SkillsResponse = Skill[];
