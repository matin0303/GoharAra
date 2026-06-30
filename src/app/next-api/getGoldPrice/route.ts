import { NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// تایپ‌ها
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

// هدرهای ثابت
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'fa-IR,fa;q=0.9,en;q=0.8',
    'Cache-Control': 'no-cache'
} as const;

export async function GET() {
    try {
        const response = await axios.get<string>('https://www.estjt.ir/tv/', {
            headers: HEADERS,
            timeout: 30000
        });

        if (response.status !== 200) {
            return NextResponse.json(
                { error: `Failed to fetch data: Status ${response.status}` },
                { status: response.status }
            );
        }

        const $ = cheerio.load(response.data);
        const priceItems: PriceItem[] = [];

        // استخراج قیمت‌ها
        $('.price-table > div').each((index: number, element: any) => {
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
                    label,
                    amount: cleanNumber,
                    amountText,
                    formattedAmount: formattedNumber,
                    changeType,
                    isGreen,
                    isRed
                });
            }
        });

        // استخراج زمان بروزرسانی
        let updateTime: string = '';
        $('.price-date').each((index: number, element: any) => {
            updateTime = $(element).text().trim();
        });

        if (!updateTime) {
            $('div:contains("آخرین بروزرسانی")').each((index: number, element: any) => {
                updateTime = $(element).text().trim();
            });
        }

        const result: GoldPriceData = {
            prices: priceItems,
            updateTime: updateTime || new Date().toLocaleString('fa-IR'),
            totalItems: priceItems.length
        };

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, s-maxage=60',
                'CDN-Cache-Control': 'no-cache',
            },
        });

    } catch (error) {
        console.error('Error fetching gold prices:', error);
        
        let errorMessage = 'Internal server error';
        let statusCode = 500;

        if (axios.isAxiosError(error)) {
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timeout';
                statusCode = 408;
            } else if (error.response) {
                errorMessage = `Server responded with status ${error.response.status}`;
                statusCode = error.response.status;
            } else if (error.request) {
                errorMessage = 'No response received from server';
                statusCode = 503;
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}

// برای کش کردن درخواست‌های تکراری (اختیاری)
export const dynamic = 'force-dynamic';