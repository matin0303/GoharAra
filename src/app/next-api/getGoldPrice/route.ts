import { NextResponse } from 'next/server';
import axios from 'axios';

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

export async function GET() {
    try {
        const response = await axios.get<GoldPriceData>('https://pestonuts.ir/bk/api/gold-price', {
            timeout: 30000,
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            }
        });

        if (response.status !== 200) {
            return NextResponse.json(
                { error: `Failed to fetch data: Status ${response.status}` },
                { status: response.status }
            );
        }

        // داده‌ها را مستقیماً از بک‌اند دریافت می‌کنیم
        const result = response.data;

        return NextResponse.json(result, {
            headers: {
                'Cache-Control': 'no-store, max-age=0, s-maxage=60',
                'CDN-Cache-Control': 'no-cache',
            },
        });

    } catch (error) {
        console.error('Error fetching gold prices from backend:', error);
        
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
                errorMessage = 'No response received from backend server';
                statusCode = 503;
            }
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: statusCode }
        );
    }
}

export const dynamic = 'force-dynamic';