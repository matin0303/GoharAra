import axios, { RawAxiosRequestHeaders } from 'axios';
import * as cheerio from 'cheerio';

// تعریف تایپ‌ها
interface PriceItem {
    label: string;
    amount: number | null;
    amountText: string;
    formattedAmount: string;
    changeType: string;
    isGreen: boolean;
    isRed: boolean;
}

interface GoldPriceData {
    prices: PriceItem[];
    updateTime: string;
    totalItems: number;
}

interface EstjtRequestHeaders extends RawAxiosRequestHeaders {
    'User-Agent': string;
    'Accept': string;
    'Accept-Language': string;
    'Cache-Control': string;
}


async function extractGoldPrices(): Promise<GoldPriceData | null> {
    const headers: EstjtRequestHeaders = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'fa-IR,fa;q=0.9,en;q=0.8',
        'Cache-Control': 'no-cache'
    };

    try {
        const response = await axios.get<string>('https://www.estjt.ir/tv/', {
            headers: headers,
            timeout: 30000
        });

        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            
            const priceItems: PriceItem[] = [];
            
            $('.price-table > div').each((index: number, element) => {
                const label = $(element).find('.label').text().trim();
                const amountElement = $(element).find('.amount');
                const amountText = amountElement.text().trim();
                const amountClass = amountElement.attr('class') || '';
                
                const isGreen = amountClass.includes('green');
                const isRed = amountClass.includes('red');
                const changeType = isGreen ? '⬆️' : (isRed ? '⬇️' : '➖');
                
                const numbers = amountText.match(/[\d,]+/g);
                let cleanNumber: number | null = null;
                let formattedNumber: string = amountText;
                
                if (numbers && numbers.length > 0) {
                    const rawNumber = numbers[0].replace(/,/g, '');
                    if (/^\d+$/.test(rawNumber)) {
                        cleanNumber = parseInt(rawNumber, 10);
                        formattedNumber = cleanNumber.toLocaleString('fa-IR');
                    }
                }
                
                if (label) {
                    priceItems.push({
                        label: label,
                        amount: cleanNumber,
                        amountText: amountText,
                        formattedAmount: formattedNumber,
                        changeType: changeType,
                        isGreen: isGreen,
                        isRed: isRed
                    });
                }
            });
            
            // استخراج زمان بروزرسانی
            let updateTime: string = '';
            $('.price-date').each((index: number, element) => {
                updateTime = $(element).text().trim();
            });
            
            // اگر با کلاس مستقیم پیدا نشد، با selector جایگزین
            if (!updateTime) {
                $('div:contains("آخرین بروزرسانی")').each((index: number, element) => {
                    updateTime = $(element).text().trim();
                });
            }
            
            const result: GoldPriceData = {
                prices: priceItems,
                updateTime: updateTime,
                totalItems: priceItems.length
            };

            console.log(JSON.stringify(result, null, 2));
            
            return result;
        }
        return null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                console.error(`Status: ${error.response.status}`);
            }
        } else {
            console.error(`❌ خطا در استخراج اطلاعات: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        return null;
    }
}

// فقط همین تابع را export می‌کنیم
export { extractGoldPrices };