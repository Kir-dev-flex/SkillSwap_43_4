export type ExchangeOffer = {
  fromUserId: number;
  toUserId: number;
  createdAt: string;
};

const STORAGE_KEY = 'exchangeOffers';

export const getExchangeOffers = (): Record<number, ExchangeOffer> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const hasExchangeOffer = (skillId?: number | null): boolean => {
  if (!skillId) return false;
  const offers = getExchangeOffers();
  return Boolean(offers[skillId]);
};

export const saveExchangeOffer = (skillId: number, offer: ExchangeOffer) => {
  const offers = getExchangeOffers();
  offers[skillId] = offer;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(offers));
};
