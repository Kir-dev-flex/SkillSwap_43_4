export type TagCategory =
  | 'business'
  | 'art'
  | 'language'
  | 'education'
  | 'home'
  | 'health'
  | 'more';

export type TagCategoryProps = {
  title: string;
  tagCategory: TagCategory;
};

export const TAG_CATEGORIES = {
  BUSINESS: 'business' as TagCategory,
  ART: 'art' as TagCategory,
  LANGUAGE: 'language' as TagCategory,
  EDUCATION: 'education' as TagCategory,
  HOME: 'home' as TagCategory,
  HEALTH: 'health' as TagCategory,
  MORE: 'more' as TagCategory,
} as const;
