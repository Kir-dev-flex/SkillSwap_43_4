import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'favorites_user_ids';

const getInitialFavorites = (): number[] => {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((id) => typeof id === 'number');
    }

    return [];
  } catch {
    return [];
  }
};

export const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(getInitialFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds));
    } catch {
      /* empty */
    }
  }, [favoriteIds]);

  const isFavorite = useCallback((userId: number) => favoriteIds.includes(userId), [favoriteIds]);

  const toggleFavorite = useCallback((userId: number) => {
    setFavoriteIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }, []);

  return {
    favoriteIds,
    isFavorite,
    toggleFavorite,
  };
};
