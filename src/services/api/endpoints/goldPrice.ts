import axios from 'axios';
import { MarketApiResponse } from '@/types/api.types';

class GoldPriceService {
  private readonly basePath = 'https://api.tgju.org/v1/widget/tmp';

  private readonly defaultKeys = [
    'geram18',
    'geram24',
    'ons',
    'price_dollar_rl',
    'gerami',
    'rob',
    'nim',
    'sekee',
    'sekeb',
  ];

  async getPrices(): Promise<MarketApiResponse> {
    try {
      const response = await axios.get<MarketApiResponse>(
        `${this.basePath}?keys=${this.defaultKeys.join(',')}`
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'خطا در دریافت قیمت بازار'
      );
    }
  }

  async getPriceByKey(key: string): Promise<MarketApiResponse> {
    try {
      const response = await axios.get<MarketApiResponse>(
        `${this.basePath}?keys=${key}`
      );

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message ||
          'خطا در دریافت قیمت'
      );
    }
  }
}

export interface PriceItem {
    label: string;
    amount: number ;
    amountText: string;
    formattedAmount: string;
    changeType: string;
    isGreen: boolean;
    isRed: boolean;
}

export interface GoldPriceData {
    prices: PriceItem[];
    updateTime: string;
    totalItems: number;
}

export interface GetGoldPricesParams {
    label?: string;
    minAmount?: number;
    maxAmount?: number;
}

export interface GoldPriceStats {
    totalItems: number;
    lastUpdate: string;
    averagePrice: number;
    minPrice: number;
    maxPrice: number;
    itemsWithPrice: number;
}

class EstjtGoldPriceService {
    private baseUrl = '/next-api/getGoldPrice';

    async getLatestGoldPrices(): Promise<GoldPriceData | null> {
        try {
            const response = await axios.get<GoldPriceData>(this.baseUrl, {
                timeout: 30000,
                headers: {
                    'Cache-Control': 'no-cache',
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching gold prices:', error);
            
            if (axios.isAxiosError(error)) {
                if (error.code === 'ECONNABORTED') {
                    throw new Error('زمان درخواست به پایان رسید');
                }
                if (error.response?.status === 404) {
                    throw new Error('سرویس قیمت طلا یافت نشد');
                }
                if (error.response?.status === 500) {
                    throw new Error('خطای داخلی سرور');
                }
            }
            
            throw new Error('خطا در دریافت قیمت‌های طلا');
        }
    }

    async getGoldPrices(params?: GetGoldPricesParams): Promise<PriceItem[]> {
        const data = await this.getLatestGoldPrices();
        if (!data) return [];

        let prices = data.prices;

        if (params?.label) {
            prices = prices.filter(item => 
                item.label.includes(params.label!)
            );
        }

        if (params?.minAmount !== undefined) {
            prices = prices.filter(item => 
                item.amount !== null && item.amount >= params.minAmount!
            );
        }

        if (params?.maxAmount !== undefined) {
            prices = prices.filter(item => 
                item.amount !== null && item.amount <= params.maxAmount!
            );
        }

        return prices;
    }

    async getGoldPriceByLabel(label: string): Promise<PriceItem | null> {
        const data = await this.getLatestGoldPrices();
        if (!data) return null;
        
        return data.prices.find(item => item.label === label) || null;
    }

    async getGoldPriceStats(): Promise<GoldPriceStats | null> {
        const data = await this.getLatestGoldPrices();
        if (!data || data.prices.length === 0) return null;

        const pricesWithAmount = data.prices.filter(item => item.amount !== null);
        const amounts = pricesWithAmount.map(item => item.amount as number);
        
        const total = amounts.reduce((sum, val) => sum + val, 0);
        const average = amounts.length > 0 ? total / amounts.length : 0;
        const min = amounts.length > 0 ? Math.min(...amounts) : 0;
        const max = amounts.length > 0 ? Math.max(...amounts) : 0;

        return {
            totalItems: data.totalItems,
            lastUpdate: data.updateTime,
            averagePrice: Math.round(average),
            minPrice: min,
            maxPrice: max,
            itemsWithPrice: amounts.length
        };
    }

    async searchGoldPrices(query: string): Promise<PriceItem[]> {
        const data = await this.getLatestGoldPrices();
        if (!data) return [];

        return data.prices.filter(item => 
            item.label.includes(query) || 
            item.amountText.includes(query)
        );
    }

    async getPricesByChangeType(changeType: 'up' | 'down' | 'stable'): Promise<PriceItem[]> {
        const data = await this.getLatestGoldPrices();
        if (!data) return [];

        return data.prices.filter(item => {
            if (changeType === 'up') return item.isGreen;
            if (changeType === 'down') return item.isRed;
            return !item.isGreen && !item.isRed;
        });
    }

    // برای رفرش دستی
    async refreshPrices(): Promise<GoldPriceData | null> {
        // پاک کردن کش
        await fetch(this.baseUrl, {
            cache: 'no-store',
            headers: {
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            }
        });
        return this.getLatestGoldPrices();
    }
}

export const goldPriceService = new EstjtGoldPriceService();
export const priceService = new GoldPriceService();