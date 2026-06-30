'use client'
import ArticleCard from '@/components/ArticleCard/ArticleCard'
import ArticleCardSkeleton from '@/components/Skeleton/ArticleCardSkeleton'
import PaginationComponent from '@/components/ui/Pagination'
// import { usePublishedArticles } from '@/hook/useArticle'
import { usePagination } from '@/hook/usePagination'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, AlertCircle, RefreshCw, Search, X } from 'lucide-react'
import Link from 'next/link'
import React, { useState, useRef, useEffect } from 'react'
import { mockArticles, Article } from '@/muckDatas/articles' // مسیر فایل mockDatas را تنظیم کنید

export default function ArticlesContent() {
    const [search, setSearch] = useState('')
    const [searchInput, setSearchInput] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)
    const { currentPage, handlePageChange, resetPage } = usePagination({ scrollToTop: true, });
    
    // const { data, isLoading, isError, refetch } = usePublishedArticles({ page: currentPage, limit: 12, search: search })
    
    // State برای مدیریت داده‌های mock
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [data, setData] = useState<{
        data: Article[],
        pagination: {
            total: number,
            page: number,
            limit: number,
            totalPages: number
        }
    } | null>(null)

    // شبیه‌سازی دریافت داده از API با تاخیر
    useEffect(() => {
        // Reset error state
        setIsError(false)
        setIsLoading(true)

        // شبیه‌سازی تاخیر شبکه
        const timer = setTimeout(() => {
            try {
                // فیلتر کردن مقالات بر اساس جستجو
                const filteredArticles = search
                    ? mockArticles.filter((article:any) => 
                        article.title.includes(search) || 
                        article.description.includes(search) ||
                        article.hashtags.some((tag:any) => tag.includes(search))
                      )
                    : mockArticles

                // محاسبه pagination
                const limit = 12
                const total = filteredArticles.length
                const totalPages = Math.ceil(total / limit)
                const startIndex = (currentPage - 1) * limit
                const endIndex = startIndex + limit
                const paginatedData = filteredArticles.slice(startIndex, endIndex)

                setData({
                    data: paginatedData,
                    pagination: {
                        total,
                        page: currentPage,
                        limit,
                        totalPages
                    }
                })
                setIsLoading(false)
            } catch (error) {
                setIsError(true)
                setIsLoading(false)
            }
        }, 500) // تاخیر 500ms برای شبیه‌سازی بارگذاری

        return () => clearTimeout(timer)
    }, [search, currentPage])

    // useEffect برای جستجو با تاخیر
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearch(searchInput)
        }, 1500)

        return () => clearTimeout(timer)
    }, [searchInput])

    // Reset page when search changes
    useEffect(() => {
        resetPage()
    }, [search])

    // تابع refetch برای شبیه‌سازی
    const refetch = () => {
        setIsLoading(true)
        setIsError(false)
        // مجدداً داده‌ها را بارگذاری می‌کند (useEffect اجرا خواهد شد)
        setSearch(search) // این باعث می‌شود useEffect دوباره اجرا شود
    }

    const handleClearSearch = () => {
        setSearchInput('')
        setSearch('')
        inputRef.current?.focus()
    }

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSearch(searchInput)
    }

    // Error State
    if (isError) {
        return (
            <div className='min-h-screen w-full pt-20 px-15 flex items-center justify-center'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='text-center bg-white rounded-2xl shadow-xl p-12 max-w-md border border-red-100'
                >
                    <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <AlertCircle size={40} className='text-red-500' />
                    </div>
                    <h2 className='text-2xl font-black text-gray-800 mb-3 font-sarvenaz'>
                        خطا در بارگذاری
                    </h2>
                    <p className='text-gray-600 mb-8'>
                        متأسفانه در دریافت مقالات مشکلی پیش آمده. لطفاً دوباره تلاش کنید.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => refetch()}
                        className='bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto'
                    >
                        <RefreshCw size={18} />
                        تلاش مجدد
                    </motion.button>
                </motion.div>
            </div>
        )
    }

    // Empty State (no articles at all)
    if (data?.data.length === 0 && !search) {
        return (
            <div className='min-h-screen w-full pt-20 px-15 flex items-center justify-center'>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className='text-center bg-white rounded-2xl shadow-xl p-12 max-w-md border border-gray-100'
                >
                    <div className='w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                        <FileText size={40} className='text-orange-400' />
                    </div>
                    <h2 className='text-2xl font-black text-gray-800 mb-3 font-sarvenaz'>
                        مقاله‌ای یافت نشد
                    </h2>
                    <p className='text-gray-600 mb-8'>
                        هنوز مقاله‌ای منتشر نشده. به زودی مقالات آموزشی و مفید درباره خشکبار اضافه خواهد شد.
                    </p>
                    <Link href="/">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className='bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20'
                        >
                            بازگشت به صفحه اصلی
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    // Success State
    return (
        <div className='min-h-screen w-full py-20 px-3 sm:px-15'>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='text-center mb-8 flex max-sm:flex-col justify-between items-center xl:px-30'
            >
                <h1 className='text-4xl font-black text-gray-800 mb-4 font-sarvenaz'>
                    مقالات
                    <span className='text-primary'> آموزشی</span>
                </h1>
                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='flex justify-center max-sm:w-full'
                >
                    <form onSubmit={handleSearchSubmit} className='w-full max-w-xl relative'>
                        <div className='relative group'>
                            {/* Search Icon */}
                            <Search
                                size={20}
                                className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors duration-300'
                            />

                            {/* Input */}
                            <input
                                ref={inputRef}
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder='جستجو در مقالات...'
                                className='w-full border-2 border-gray-200 rounded-2xl px-4 py-2 pr-12 pl-12 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 outline-none text-gray-700 font-kalameh text-lg placeholder:text-gray-400'
                            />

                            {/* Clear Button */}
                            <AnimatePresence>
                                {searchInput && (
                                    <motion.button
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0 }}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        type="button"
                                        onClick={handleClearSearch}
                                        className='absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-300'
                                    >
                                        <X size={16} className='text-gray-600' />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Search Tips - show when no results */}
                        {search && data?.data.length === 0 && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className='text-center text-gray-500 mt-3 text-sm'
                            >
                                نتیجه‌ای برای "{search}" یافت نشد
                            </motion.p>
                        )}
                    </form>
                </motion.div>

            </motion.div>
            {isLoading ?
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {[...Array(4)].map((_, index) => (
                        <div className='flex justify-center items-center w-full' key={index}>
                            <ArticleCardSkeleton />
                        </div>
                    ))}
                </div>
                :
                <>
                    {/* Articles Grid */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:px-30 font-kalameh'
                    >
                        <AnimatePresence mode='wait'>
                            {data?.data.map((articleData, index) => (
                                <ArticleCard key={articleData.slug || index} data={articleData} />
                            ))}
                        </AnimatePresence>
                    </motion.div>

                    {/* Empty Search Result */}
                    {search && data?.data.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className='text-center py-16 font-kalameh'
                        >
                            <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                                <Search size={40} className='text-gray-400' />
                            </div>
                            <h3 className='text-xl font-bold text-gray-700 mb-2 font-sarvenaz'>
                                مقاله‌ای با این عنوان پیدا نشد
                            </h3>
                            <p className='text-gray-500 mb-6'>
                                لطفاً عبارت دیگری را جستجو کنید
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleClearSearch}
                                className='bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300'
                            >
                                پاک کردن جستجو
                            </motion.button>
                        </motion.div>
                    )}

                    {data && data.data.length > 0 && (
                        <PaginationComponent
                            pagination={data.pagination}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                            className="mt-12 mb-8"
                            infoText="محصول"
                        />
                    )}
                </>
            }
        </div>
    )
}

// 'use client'
// import ArticleCard from '@/components/ArticleCard/ArticleCard'
// import ArticleCardSkeleton from '@/components/Skeleton/ArticleCardSkeleton'
// import PaginationComponent from '@/components/ui/Pagination'
// import { usePublishedArticles } from '@/hook/useArticle'
// import { usePagination } from '@/hook/usePagination'
// import { motion, AnimatePresence } from 'framer-motion'
// import { FileText, AlertCircle, RefreshCw, Search, X } from 'lucide-react'
// import Link from 'next/link'
// import React, { useState, useRef, useEffect } from 'react'

// export default function ArticlesContent() {
//     const [search, setSearch] = useState('')
//     const [searchInput, setSearchInput] = useState('')
//     const inputRef = useRef<HTMLInputElement>(null)
//     const { currentPage, handlePageChange, resetPage } = usePagination({ scrollToTop: true, });
//     const { data, isLoading, isError, refetch } = usePublishedArticles({ page: currentPage, limit: 12, search: search })

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setSearch(searchInput)
//         }, 1500)

//         return () => clearTimeout(timer)
//     }, [searchInput])
//     useEffect(() => {
//         resetPage()
//     }, [])

//     const handleClearSearch = () => {
//         setSearchInput('')
//         setSearch('')
//         inputRef.current?.focus()
//     }

//     const handleSearchSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         setSearch(searchInput)
//     }


//     // Error State
//     if (isError) {
//         return (
//             <div className='min-h-screen w-full pt-20 px-15 flex items-center justify-center'>
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className='text-center bg-white rounded-2xl shadow-xl p-12 max-w-md border border-red-100'
//                 >
//                     <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
//                         <AlertCircle size={40} className='text-red-500' />
//                     </div>
//                     <h2 className='text-2xl font-black text-gray-800 mb-3 font-sarvenaz'>
//                         خطا در بارگذاری
//                     </h2>
//                     <p className='text-gray-600 mb-8'>
//                         متأسفانه در دریافت مقالات مشکلی پیش آمده. لطفاً دوباره تلاش کنید.
//                     </p>
//                     <motion.button
//                         whileHover={{ scale: 1.05 }}
//                         whileTap={{ scale: 0.95 }}
//                         onClick={() => refetch()}
//                         className='bg-orange-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all duration-300 flex items-center gap-2 mx-auto'
//                     >
//                         <RefreshCw size={18} />
//                         تلاش مجدد
//                     </motion.button>
//                 </motion.div>
//             </div>
//         )
//     }

//     // Empty State (no articles at all)
//     if (data?.data.length === 0 && !search) {
//         return (
//             <div className='min-h-screen w-full pt-20 px-15 flex items-center justify-center'>
//                 <motion.div
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     className='text-center bg-white rounded-2xl shadow-xl p-12 max-w-md border border-gray-100'
//                 >
//                     <div className='w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6'>
//                         <FileText size={40} className='text-orange-400' />
//                     </div>
//                     <h2 className='text-2xl font-black text-gray-800 mb-3 font-sarvenaz'>
//                         مقاله‌ای یافت نشد
//                     </h2>
//                     <p className='text-gray-600 mb-8'>
//                         هنوز مقاله‌ای منتشر نشده. به زودی مقالات آموزشی و مفید درباره خشکبار اضافه خواهد شد.
//                     </p>
//                     <Link href="/">
//                         <motion.button
//                             whileHover={{ scale: 1.05 }}
//                             whileTap={{ scale: 0.95 }}
//                             className='bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-3 rounded-xl font-bold hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20'
//                         >
//                             بازگشت به صفحه اصلی
//                         </motion.button>
//                     </Link>
//                 </motion.div>
//             </div>
//         )
//     }

//     // Success State
//     return (
//         <div className='min-h-screen w-full py-20 px-3 sm:px-15'>
//             {/* Header */}
//             <motion.div
//                 initial={{ opacity: 0, y: -20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className='text-center mb-8 flex max-sm:flex-col justify-between items-center xl:px-30'
//             >
//                 <h1 className='text-4xl font-black text-gray-800 mb-4 font-sarvenaz'>
//                     مقالات
//                     <span className='text-orange-600'> آموزشی</span>
//                 </h1>
//                 {/* Search Bar */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2 }}
//                     className='flex justify-center max-sm:w-full'
//                 >
//                     <form onSubmit={handleSearchSubmit} className='w-full max-w-xl relative'>
//                         <div className='relative group'>
//                             {/* Search Icon */}
//                             <Search
//                                 size={20}
//                                 className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-600 transition-colors duration-300'
//                             />

//                             {/* Input */}
//                             <input
//                                 ref={inputRef}
//                                 type="text"
//                                 value={searchInput}
//                                 onChange={(e) => setSearchInput(e.target.value)}
//                                 placeholder='جستجو در مقالات...'
//                                 className='w-full border-2 border-gray-200 rounded-2xl px-4 py-2 pr-12 pl-12 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 transition-all duration-300 outline-none text-gray-700 font-kalameh text-lg placeholder:text-gray-400'
//                             />

//                             {/* Clear Button */}
//                             <AnimatePresence>
//                                 {searchInput && (
//                                     <motion.button
//                                         initial={{ opacity: 0, scale: 0 }}
//                                         animate={{ opacity: 1, scale: 1 }}
//                                         exit={{ opacity: 0, scale: 0 }}
//                                         whileHover={{ scale: 1.1 }}
//                                         whileTap={{ scale: 0.9 }}
//                                         type="button"
//                                         onClick={handleClearSearch}
//                                         className='absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-300'
//                                     >
//                                         <X size={16} className='text-gray-600' />
//                                     </motion.button>
//                                 )}
//                             </AnimatePresence>
//                         </div>

//                         {/* Search Tips - show when no results */}
//                         {search && data?.data.length === 0 && (
//                             <motion.p
//                                 initial={{ opacity: 0, y: -10 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 className='text-center text-gray-500 mt-3 text-sm'
//                             >
//                                 نتیجه‌ای برای "{search}" یافت نشد
//                             </motion.p>
//                         )}
//                     </form>
//                 </motion.div>

//             </motion.div>
//             {isLoading ?
//                 <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
//                     {[...Array(4)].map((_, index) => (
//                         <div className='flex justify-center items-center w-full'>
//                             <ArticleCardSkeleton key={index} />
//                         </div>
//                     ))}
//                 </div>
//                 :
//                 <>
//                     {/* Articles Grid */}
//                     <motion.div
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: 0.3 }}
//                         className='w-full  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:px-30 font-kalameh'
//                     >
//                         <AnimatePresence mode='wait'>
//                             {data?.data.map((articleData, index) => (
//                                 <ArticleCard data={articleData} />
//                             ))}
//                         </AnimatePresence>
//                     </motion.div>

//                     {/* Empty Search Result */}
//                     {search && data?.data.length === 0 && (
//                         <motion.div
//                             initial={{ opacity: 0, scale: 0.9 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             className='text-center py-16 font-kalameh'
//                         >
//                             <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
//                                 <Search size={40} className='text-gray-400' />
//                             </div>
//                             <h3 className='text-xl font-bold text-gray-700 mb-2 font-sarvenaz'>
//                                 مقاله‌ای با این عنوان پیدا نشد
//                             </h3>
//                             <p className='text-gray-500 mb-6'>
//                                 لطفاً عبارت دیگری را جستجو کنید
//                             </p>
//                             <motion.button
//                                 whileHover={{ scale: 1.05 }}
//                                 whileTap={{ scale: 0.95 }}
//                                 onClick={handleClearSearch}
//                                 className='bg-gray-200 text-gray-700 px-6 py-2 rounded-xl font-semibold hover:bg-gray-300 transition-all duration-300'
//                             >
//                                 پاک کردن جستجو
//                             </motion.button>
//                         </motion.div>
//                     )}

//                     {data &&
//                         <PaginationComponent
//                             pagination={data?.pagination}
//                             currentPage={currentPage}
//                             onPageChange={handlePageChange}
//                             className="mt-12 mb-8"
//                             infoText="محصول"
//                         />
//                     }
//                 </>
//             }
//         </div>
//     )
// }