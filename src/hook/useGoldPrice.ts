import { useQuery } from '@tanstack/react-query';
import { priceService } from '@/services/api/endpoints/goldPrice';

// ============ Query Keys ============
export const priceKeys = {
  all: ['prices'] as const,

  market: () => [...priceKeys.all, 'market'] as const,

  single: (key: string) =>
    [...priceKeys.all, 'single', key] as const,
};

// ============ Get All Market Prices ============
export const useMarketPrices = () => {
  return useQuery({
    queryKey: priceKeys.market(),

    queryFn: () => priceService.getPrices(),
    refetchInterval: 30 * 1000,
    staleTime: 15 * 1000,

    retry: 2,
  });
};

// ============ Get Single Price ============
export const usePrice = (key: string) => {
  return useQuery({
    queryKey: priceKeys.single(key),

    queryFn: () => priceService.getPriceByKey(key),

    enabled: !!key,

    refetchInterval: 30 * 1000,

    staleTime: 15 * 1000,

    retry: 2,
  });
};

// ============ Helper Hooks ============
export const useGold18Price = () => {
  return usePrice('geram18');
};

export const useGold24Price = () => {
  return usePrice('geram24');
};

export const useDollarPrice = () => {
  return usePrice('price_dollar_rl');
};

export const useOuncePrice = () => {
  return usePrice('ons');
};

export const useImamiCoinPrice = () => {
  return usePrice('sekee');
};

export const useBaharCoinPrice = () => {
  return usePrice('sekeb');
};

export const useHalfCoinPrice = () => {
  return usePrice('nim');
};

export const useQuarterCoinPrice = () => {
  return usePrice('rob');
};

export const useGramCoinPrice = () => {
  return usePrice('gerami');
};