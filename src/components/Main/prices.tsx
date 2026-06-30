'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Coins, Gem, CircleDollarSign, TrendingUp, TrendingDown, Banknote } from 'lucide-react'
import { useEffect, useState, useMemo } from 'react'
import { useMarketPrices } from '@/hook/useGoldPrice'
import { useLatestGoldPrices } from '@/hook/useEstjtGoldPrice' // هوک جدید برای اسکرپر
import { MarketIndicator } from '@/types/api.types'

// Mapping API keys to our internal structure
const ITEM_CONFIG: Record<string, {
    icon: React.ReactNode;
    unit: string;
    category: 'coin' | 'gold' | 'currency';
    color: string;
    priority: number;
}> = {
    // سکه‌ها (coins) - از اسکرپر میاد
    'سکه طرح جدید': {
        icon: <Coins className='w-8 h-8' />,
        unit: 'تومان',
        category: 'coin',
        color: 'from-amber-400 to-yellow-600',
        priority: 1
    },
    'سکه طرح قدیم': {
        icon: <Coins className='w-8 h-8' />,
        unit: 'تومان',
        category: 'coin',
        color: 'from-yellow-400 to-amber-700',
        priority: 2
    },
    'نیم سکه': {
        icon: <Coins className='w-8 h-8' />,
        unit: 'تومان',
        category: 'coin',
        color: 'from-orange-400 to-red-600',
        priority: 3
    },
    'ربع سکه': {
        icon: <Coins className='w-8 h-8' />,
        unit: 'تومان',
        category: 'coin',
        color: 'from-pink-400 to-rose-600',
        priority: 4
    },
    'سکه گرمی': {
        icon: <Coins className='w-8 h-8' />,
        unit: 'تومان',
        category: 'coin',
        color: 'from-purple-400 to-violet-600',
        priority: 5
    },

    // طلا (gold) - از اسکرپر میاد
    'طلا ۲۴ عیار': {
        icon: <Gem className='w-8 h-8' />,
        unit: 'تومان / گرم',
        category: 'gold',
        color: 'from-yellow-400 to-amber-600',
        priority: 1
    },
    'طلا ۱۸ عیار': {
        icon: <Gem className='w-8 h-8' />,
        unit: 'تومان / گرم',
        category: 'gold',
        color: 'from-amber-400 to-orange-600',
        priority: 2
    },

    // ارزها (currency) - از API اصلی میاد
    ons: {
        icon: <CircleDollarSign className='w-8 h-8' />,
        unit: 'دلار',
        category: 'currency',
        color: 'from-green-400 to-emerald-600',
        priority: 1
    },
    price_dollar_rl: {
        icon: <Banknote className='w-8 h-8' />,
        unit: 'تومان',
        category: 'currency',
        color: 'from-blue-400 to-cyan-600',
        priority: 2
    },
}

// Map برای تطابق کلیدهای اسکرپر با عنوان‌های نمایشی
const SCRAPER_ITEM_TITLES: Record<string, string> = {
    'سکه طرح جدید': 'سکه امامی',
    'سکه طرح قدیم': 'سکه بهار آزادی',
    'نیم سکه': 'نیم سکه',
    'ربع سکه': 'ربع سکه',
    'سکه گرمی': 'سکه گرمی',
    'طلا ۲۴ عیار': 'طلای ۲۴ عیار',
    'طلا ۱۸ عیار': 'طلای ۱۸ عیار',
}

// Category order for display
const CATEGORY_ORDER: ('coin' | 'gold' | 'currency')[] = ['coin', 'gold', 'currency']

// Category labels
const CATEGORY_LABELS: Record<string, string> = {
    coin: 'سکه',
    gold: 'طلا',
    currency: 'ارز',
}

// Category icons for progress indicators
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
    coin: <Coins className='w-4 h-4 text-primary' />,
    gold: <Gem className='w-4 h-4 text-primary' />,
    currency: <CircleDollarSign className='w-4 h-4 text-primary' />,
}

interface PriceItem {
    key: string
    title: string
    price: number
    changePercent: number
    icon: React.ReactNode
    unit: string
    color: string
    category: 'coin' | 'gold' | 'currency'
    priority: number
    high: number
    low: number
    open: number
    lastUpdate: string
    changeType?: string
    isGreen?: boolean
    isRed?: boolean
}

export default function GoldPricesSection() {
    // هوک برای قیمت‌های طلا و سکه (اسکرپر)
    const { data: scraperData, isLoading: scraperLoading, error: scraperError } = useLatestGoldPrices()

    // هوک برای قیمت دلار (API اصلی)
    const { data: marketData, isLoading: marketLoading, error: marketError } = useMarketPrices()

    const [indices, setIndices] = useState<Record<string, number>>({
        coin: 0,
        gold: 0,
        currency: 0,
    })

    const [lastUpdate, setLastUpdate] = useState('')

    // تبدیل ریال به تومان (تقسیم بر ۱۰)
    const convertRialToToman = (value: number): number => {
        return Math.round(value / 10)
    }

    const findMatchingMarketKey = (marketName: string): string | null => {
        const mapping: Record<string, string> = {
            // سکه‌ها
            'sekeb': 'سکه طرح قدیم',  // سکه بهار آزادی
            'seke': 'سکه طرح جدید',   // سکه امامی
            'nim': 'نیم سکه',
            'rob': 'ربع سکه',
            'gerami': 'سکه گرمی',

            // طلا
            'geram24': 'طلا ۲۴ عیار',
            'geram18': 'طلا ۱۸ عیار',

            // ارزها (اینها در scraper نیستند)
            'ons': 'انس طلا',
            'price_dollar_rl': 'دلار آمریکا',
        };

        return mapping[marketName] || null;
    }

    const scraperItems = useMemo(() => {
        if (!scraperData?.prices) return []

        // ایجاد مپ برای دسترسی سریع به آیتم‌های مارکت
        const marketItemsMap = new Map();
        if (marketData?.response?.indicators) {
            marketData.response.indicators.forEach((item: MarketIndicator) => {
                // پیدا کردن کلید منطبق با اسکرپر
                const matchingKey = findMatchingMarketKey(item.name);
                if (matchingKey) {
                    marketItemsMap.set(matchingKey, item);
                }
            });
        }

        return scraperData.prices
            .filter((item: any) => {
                return ITEM_CONFIG[item.label]
            })
            .map((item: any) => {
                const config = ITEM_CONFIG[item.label]
                const title = SCRAPER_ITEM_TITLES[item.label] || item.label

                // پیدا کردن آیتم متناظر در مارکت
                const marketItem = marketItemsMap.get(item.label);

                // محاسبه changePercent
                let changePercent = 0;
                let high = item.amount || 0;
                let low = item.amount || 0;

                if (marketItem) {
                    changePercent = marketItem.dp ;
                    high = convertRialToToman(Number(marketItem.h)) || item.amount || 0;
                    low = convertRialToToman(Number(marketItem.l)) || item.amount || 0;
                } else {
                    changePercent = item.isGreen ? 0.5 : (item.isRed ? -0.5 : 0);
                    high = item.amount || 0;
                    low = item.amount || 0;
                }

                return {
                    key: item.label,
                    title: title,
                    price: item.amount || 0,
                    changePercent: changePercent,
                    icon: config.icon,
                    unit: config.unit,
                    color: config.color,
                    category: config.category,
                    priority: config.priority,
                    high: high,
                    low: low,
                    open: item.amount || 0,
                    lastUpdate: scraperData.updateTime || new Date().toISOString(),
                    changeType: item.changeType,
                    isGreen: item.isGreen,
                    isRed: item.isRed,
                }
            })
            .sort((a: any, b: any) => a.priority - b.priority)
    }, [scraperData, marketData])

    // پردازش داده‌های بازار (دلار)
    const marketItems = useMemo(() => {
        if (!marketData?.response?.indicators) return []

        return marketData.response.indicators
            .filter((item: MarketIndicator) => {
                // فقط ارزها (انس و دلار)
                return ['ons', 'price_dollar_rl'].includes(item.name)
            })
            .map((item: MarketIndicator) => {
                const config = ITEM_CONFIG[item.name]
                const title = item.title || ''

                // انس طلا به دلار است و نیازی به تبدیل ندارد
                const isOns = item.name === 'ons'
                const shouldConvert = !isOns

                return {
                    key: item.name,
                    title: title,
                    price: shouldConvert ? convertRialToToman(Number(item.p)) : Number(item.p),
                    changePercent: item.dp || 0,
                    icon: config.icon,
                    unit: config.unit,
                    color: config.color,
                    category: config.category,
                    priority: config.priority,
                    high: shouldConvert ? convertRialToToman(Number(item.h)) : Number(item.h),
                    low: shouldConvert ? convertRialToToman(Number(item.l)) : Number(item.l),
                    open: shouldConvert ? convertRialToToman(Number(item.o)) : Number(item.o),
                    lastUpdate: item.updated_at,
                }
            })
            .sort((a: any, b: any) => a.priority - b.priority)
    }, [marketData])

    // ترکیب همه آیتم‌ها
    const allItems = useMemo(() => {
        return [...scraperItems, ...marketItems]
    }, [scraperItems, marketItems])

    // Group items by category
    const groupedItems = useMemo(() => {
        const groups: Record<string, PriceItem[]> = {
            coin: [],
            gold: [],
            currency: [],
        }

        allItems.forEach((item: any) => {
            if (groups[item.category]) {
                groups[item.category].push(item)
            }
        })

        return groups
    }, [allItems])

    // Get current item for each category
    const getCurrentItem = (category: string): PriceItem | null => {
        const items = groupedItems[category] || []
        const index = indices[category] || 0
        return items.length > 0 ? items[index % items.length] : null
    }

    const currentCoin = getCurrentItem('coin')
    const currentGold = getCurrentItem('gold')
    const currentCurrency = getCurrentItem('currency')

    // Auto-rotate items
    useEffect(() => {
        const intervals: NodeJS.Timeout[] = []

        CATEGORY_ORDER.forEach((category) => {
            const items = groupedItems[category] || []
            if (items.length > 1) {
                const interval = setInterval(() => {
                    setIndices((prev) => ({
                        ...prev,
                        [category]: (prev[category] + 1) % items.length,
                    }))
                }, 5000)
                intervals.push(interval)
            }
        })

        return () => {
            intervals.forEach((interval) => clearInterval(interval))
        }
    }, [groupedItems])

    // Update last update time
    useEffect(() => {
        // اولویت با اسکرپر هست
        if (scraperData?.updateTime) {
            console.log(scraperData?.updateTime)
            setLastUpdate(scraperData?.updateTime)
        }

        // اگر اسکرپر نداشت، از مارکت استفاده کن
        if (!scraperData && (marketData?.response?.indicators?.length)) {
            const lastUpdateTime = marketData.response.indicators[0]?.updated_at
            if (lastUpdateTime) {
                const date = new Date(lastUpdateTime)
                if (!isNaN(date.getTime())) {
                    setLastUpdate(date.toLocaleTimeString('fa-IR'))
                    return
                }
            }
        }

        // setLastUpdate(new Date().toLocaleTimeString('fa-IR'))
    }, [scraperData, marketData])

    const formatPrice = (price: number): string => {
        return price.toLocaleString('fa-IR')
    }

    // Loading state
    if (scraperLoading || marketLoading) {
        return (
            <section className='bg-white py-20 relative w-full overflow-hidden md:pt-30 mt-10'>
                <div className='max-w-7xl mx-auto px-4 relative z-20'>
                    <div className='text-center'>
                        <h2 className='text-5xl font-black text-primary mb-4 font-paeez'>
                            قیمت لحظه‌ای طلا و سکه
                        </h2>
                        <div className='flex justify-center items-center gap-4 mt-8'>
                            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
                            <span className='text-gray-500'>در حال بارگذاری...</span>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // Error state
    if (scraperError || marketError) {
        return (
            <section className='bg-white py-20 relative w-full overflow-hidden md:pt-30 mt-10 font-kalameh'>
                <div className='max-w-7xl mx-auto px-4 relative z-20'>
                    <div className='text-center'>
                        <h2 className='text-5xl font-black text-primary mb-4 font-paeez'>
                            قیمت لحظه‌ای طلا و سکه
                        </h2>
                        <div className='bg-red-50 text-red-600 p-6 rounded-xl max-w-md mx-auto mt-8'>
                            <p className='font-bold'>خطا در دریافت اطلاعات</p>
                            <p className='text-sm mt-2'>لطفاً دوباره تلاش کنید</p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    // Check if we have data
    const hasData = currentCoin || currentGold || currentCurrency
    if (!hasData) {
        return (
            <section className='bg-white py-20 relative w-full overflow-hidden md:pt-30 mt-10'>
                <div className='max-w-7xl mx-auto px-4 relative z-20'>
                    <div className='text-center'>
                        <h2 className='text-5xl font-black text-primary mb-4 font-paeez'>
                            قیمت لحظه‌ای طلا و سکه
                        </h2>
                        <p className='text-gray-500 mt-8'>اطلاعاتی برای نمایش وجود ندارد</p>
                    </div>
                </div>
            </section>
        )
    }

    const PriceCard = ({ item, category, index }: { item: PriceItem, category: string, index: number }) => {
        return (
            <motion.div
                key={`${category}-card-${item.key}`}
                initial={{ opacity: 1, y: 30 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className='relative overflow-hidden bg-white rounded-3xl font-kalameh p-8 border border-gray-200 hover:border-amber-300 hover:shadow-xl transition-all duration-500 group'
            >
                <div className='absolute top-4 left-4 text-6xl font-serif text-gray-100 group-hover:text-amber-100 transition-colors duration-500 select-none'>
                    "
                </div>

                {/* Label */}
                <div className='mb-6'>
                    <span className='text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full'>
                        {CATEGORY_LABELS[category] || category}
                    </span>

                    <span className='text-xs w-full text-start text-gray-400 mr-1'>
                        {item.unit}
                    </span>
                </div>

                {/* Icon & Price Row */}
                <div className='flex justify-between items-center'>
                    <div className='relative mb-6 z-10'>
                        <motion.div
                            key={`${category}-icon-${item.key}`}
                            className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-500`}
                            whileHover={{ rotate: [0, -10, 10, 0] }}
                            transition={{ duration: 0.5 }}
                        >
                            {item.icon}
                        </motion.div>
                        <div className='absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center'>
                            <svg className='w-3 h-3 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={3} d='M5 13l4 4L19 7' />
                            </svg>
                        </div>
                    </div>

                    {/* Price Section */}
                    <div className='mb-3 relative z-10 flex flex-col min-w-[120px]'>
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={`${category}-content-${item.key}`}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                                className='flex flex-col items-end'
                            >
                                <h3 className='text-lg font-bold text-start w-full text-gray-900'>
                                    {item.title}
                                </h3>
                                <span className='text-3xl font-black text-gray-900'>
                                    {formatPrice(item.price)}
                                </span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Change & Mini Chart */}
                <div className='border-t border-gray-100 pt-4 relative z-10'>
                    <div className='flex items-center justify-between'>
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key={`${category}-change-${item.key}`}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.3 }}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold ${item.changePercent >= 0
                                    ? 'bg-green-50 text-green-600'
                                    : 'bg-red-50 text-red-600'
                                    }`}
                            >
                                {item.changePercent >= 0 ? <TrendingUp className='w-4 h-4' /> : <TrendingDown className='w-4 h-4' />}
                                <span dir='ltr'>{item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%</span>
                            </motion.div>
                        </AnimatePresence>

                        <div className='flex items-end gap-0.5 h-8'>
                            {[...Array(8)].map((_, i) => (
                                <motion.div
                                    key={`${category}-bar-${i}-${item.key}`}
                                    className={`w-1 rounded-full ${item.changePercent >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                                    animate={{
                                        height: [
                                            Math.random() * 24 + 8,
                                            Math.random() * 24 + 8,
                                            Math.random() * 24 + 8
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* High/Low Prices */}
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={`${category}-highlow-${item.key}`}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.3 }}
                            className='flex justify-between mt-3 text-xs text-gray-400'
                        >
                            <span>بالاترین: {formatPrice(item.high)}</span>
                            <span>پایین‌ترین: {formatPrice(item.low)}</span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </motion.div>
        )
    }

    return (
        <section className='bg-white py-10 relative w-full overflow-hidden md:pt-20 mt-10'>
            <div className='max-w-7xl mx-auto px-4 relative z-20'>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className='text-center mb-7'
                >
                    <h2 className='text-5xl font-black text-primary mb-4 font-paeez'>
                        قیمت لحظه‌ای طلا و سکه
                    </h2>

                    <motion.div
                        className='flex items-center justify-center gap-2 text-gray-500 text-sm font-kalameh'
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <span className='relative flex h-3 w-3'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-3 w-3 bg-green-500 '></span>
                        </span>
                        {lastUpdate}
                    </motion.div>

                    {/* Progress Indicators */}
                    <div className='flex items-center justify-center gap-8 mt-6 flex-wrap'>
                        {CATEGORY_ORDER.map((category) => {
                            const items = groupedItems[category] || []
                            const currentIndex = indices[category] || 0
                            if (items.length === 0) return null

                            return (
                                <div key={category} className='flex items-center gap-2'>
                                    {CATEGORY_ICONS[category]}
                                    <div className='flex gap-1'>
                                        {items.map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentIndex ? 'bg-primary w-4' : 'bg-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </motion.div>

                {/* 3 Main Cards */}
                <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto'>
                    {currentCoin && <PriceCard item={currentCoin} category='coin' index={0} />}
                    {currentGold && <PriceCard item={currentGold} category='gold' index={1} />}
                    {currentCurrency && <PriceCard item={currentCurrency} category='currency' index={2} />}
                </div>
            </div>

            {/* Background Blur Effects */}
            <div className='absolute lg:bottom-30 lg:right-30 max-lg:top-50 max-lg:inset-0 w-96 h-70 bg-primary rounded-full blur-3xl opacity-20' />
            <div className='absolute lg:bottom-40 lg:right-80 max-lg:top-120 w-96 h-70 bg-primary rounded-full blur-3xl opacity-20' />
            <div className='absolute lg:bottom-30 lg:right-140 max-lg:hidden w-96 h-70 bg-primary rounded-full blur-3xl opacity-20' />
            <div className='absolute lg:bottom-30 lg:right-200 max-xl:hidden w-96 h-70 bg-primary rounded-full blur-3xl opacity-20' />
            <div className='absolute lg:bottom-30 lg:right-250 max-xl:hidden w-96 h-70 bg-primary rounded-full blur-3xl opacity-20' />
        </section>
    )
}