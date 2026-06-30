// src/hooks/useGoldPrice.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { goldPriceService, PriceItem, GoldPriceData, GoldPriceStats } from '@/services/api/endpoints/goldPrice';
import toast from 'react-hot-toast';

// ============ Query Keys ============
export const goldPriceKeys = {
    all: ['goldPrices'] as const,
    latest: () => [...goldPriceKeys.all, 'latest'] as const,
    list: (params?: any) => [...goldPriceKeys.all, 'list', params] as const,
    detail: (label: string) => [...goldPriceKeys.all, 'detail', label] as const,
    stats: () => [...goldPriceKeys.all, 'stats'] as const,
    search: (query: string) => [...goldPriceKeys.all, 'search', query] as const,
    changeType: (type: string) => [...goldPriceKeys.all, 'changeType', type] as const,
};

// ============ Get Latest Gold Prices ============
export const useLatestGoldPrices = () => {
    return useQuery<GoldPriceData | null>({
        queryKey: goldPriceKeys.latest(),
        queryFn: () => goldPriceService.getLatestGoldPrices(),
        staleTime: 30 * 1000, // 30 ثانیه
        refetchInterval: 60 * 1000, // هر 1 دقیقه
        refetchOnWindowFocus: true,
        retry: 3,
    });
};

// ============ Get All Gold Prices (with filter) ============
export const useGoldPrices = (params?: {
    label?: string;
    minAmount?: number;
    maxAmount?: number;
}) => {
    return useQuery<PriceItem[]>({
        queryKey: goldPriceKeys.list(params),
        queryFn: () => goldPriceService.getGoldPrices(params),
        staleTime: 30 * 1000,
        refetchInterval: 60 * 1000,
    });
};

// ============ Get Gold Price By Label ============
export const useGoldPriceByLabel = (label: string) => {
    return useQuery<PriceItem | null>({
        queryKey: goldPriceKeys.detail(label),
        queryFn: () => goldPriceService.getGoldPriceByLabel(label),
        enabled: !!label,
        staleTime: 30 * 1000,
    });
};

// ============ Get Gold Price Stats ============
export const useGoldPriceStats = () => {
    return useQuery<GoldPriceStats | null>({
        queryKey: goldPriceKeys.stats(),
        queryFn: () => goldPriceService.getGoldPriceStats(),
        staleTime: 60 * 1000, // 1 دقیقه
    });
};

// ============ Search Gold Prices ============
export const useSearchGoldPrices = (query: string) => {
    return useQuery<PriceItem[]>({
        queryKey: goldPriceKeys.search(query),
        queryFn: () => goldPriceService.searchGoldPrices(query),
        enabled: query.length > 0,
        staleTime: 30 * 1000,
    });
};

// ============ Get Prices By Change Type ============
export const usePricesByChangeType = (changeType: 'up' | 'down' | 'stable') => {
    return useQuery<PriceItem[]>({
        queryKey: goldPriceKeys.changeType(changeType),
        queryFn: () => goldPriceService.getPricesByChangeType(changeType),
        staleTime: 30 * 1000,
    });
};

// ============ Mutation: Refresh Gold Prices ============
export const useRefreshGoldPrices = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => goldPriceService.getLatestGoldPrices(),
        onSuccess: (data) => {
            if (data) {
                // به‌روزرسانی همه کش‌ها
                queryClient.setQueryData(goldPriceKeys.latest(), data);
                queryClient.invalidateQueries({ queryKey: goldPriceKeys.all });
                toast.success('قیمت‌ها با موفقیت به‌روزرسانی شدند');
            } else {
                toast.error('خطا در دریافت قیمت‌ها');
            }
        },
        onError: (error: Error) => {
            toast.error(error.message || 'خطا در به‌روزرسانی قیمت‌ها');
        },
    });
};