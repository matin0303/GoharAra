import { useMemo } from 'react';
import { useGold18Price } from '@/hook/useGoldPrice';
import { Muckdata } from '@/muckDatas/productCard';
import { useGoldPrices } from '@/hook/useEstjtGoldPrice';
import { Product, ProductsWithRealPrices } from '@/types/api.types';

// تابع گرد کردن به نزدیک‌ترین هزار تومان
const roundToNearestThousand = (price: number) => {
  return Math.round(price / 1000) * 1000;
};

// تابع محاسبه قیمت واقعی هر محصول به تومان
const calculateRealPrice = (weight: number, goldPrice: number) => {
  // قیمت طلا به ازای هر گرم (به ریال)
  const pricePerGram = goldPrice;
  
  // قیمت طلا + ۲۰% اجرت + ۷% سود
  // فرمول: قیمت طلا * (1 + 0.20 + 0.07) = قیمت طلا * 1.27
  const priceWithProfit = pricePerGram * 1.27; // ۱ + ۲۰% + ۷%
  
  // محاسبه قیمت نهایی = وزن * (قیمت طلا + اجرت + سود)
  const totalRial = weight * priceWithProfit;
  
  // تبدیل به تومان و گرد کردن به نزدیک‌ترین هزار
  return roundToNearestThousand(Math.round(totalRial / 10));
};

// هوک اصلی برای دریافت محصولات با قیمت واقعی
export const useProductsWithRealPrices = () => {
  const { data , isLoading ,isError:error} = useGoldPrices({label: 'طلا ۱۸ عیار'})
  const goldPrice = useMemo(() => {
    if (!data) return null;
    return data[0].amount;
  }, [data]);
  
  // محاسبه قیمت واقعی برای هر محصول
  const productsWithRealPrices= useMemo(() => {
    if (!goldPrice) return Muckdata;
    
    return Muckdata.map(product => {
      // قیمت طلا به ازای هر گرم (به ریال)
      const pricePerGram = goldPrice;
      
      // محاسبات دقیق
      const laborCost = pricePerGram * 0.1; // ۲۰% اجرت
      const profit = pricePerGram * 0.07; // ۷% سود
      const totalPerGram = pricePerGram + laborCost + profit; // جمع هر گرم
      const totalRial = product.weight * totalPerGram; // کل به ریال
      
      // تبدیل به تومان
      const realPriceInToman = Math.round(totalRial);
      
      return {
        ...product,
        // قیمت واقعی به تومان با گرد کردن به نزدیک‌ترین هزار
        realPrice: roundToNearestThousand(realPriceInToman),
        // اطلاعات اضافی برای نمایش
        // goldPricePerGram: roundToNearestThousand(pricePerGram), // قیمت هر گرم طلا به تومان
        // laborCostPerGram: roundToNearestThousand(laborCost ), // اجرت هر گرم به تومان
        // profitPerGram: roundToNearestThousand(profit ), // سود هر گرم به تومان
        // totalPerGram: roundToNearestThousand(totalPerGram ), // جمع هر گرم به تومان
        // weight: product.weight,
        // laborCostTotal: roundToNearestThousand(laborCost * product.weight), // کل اجرت به تومان
        // profitTotal: roundToNearestThousand(profit * product.weight), // کل سود به تومان
        // basePrice: roundToNearestThousand(pricePerGram * product.weight), // قیمت پایه به تومان
      };
    });
  }, [goldPrice]);
  
  return {
    products: productsWithRealPrices,
    goldPrice: goldPrice ? roundToNearestThousand(Math.round(goldPrice / 10)) : null,
    isLoading,
    error,
  };
};