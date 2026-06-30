// 'use client';

// import ProductCard from '@/components/ProductCard/ProductCard';
// import { useProducts } from '@/hook/useProduct';
// import { useRouter, useSearchParams } from 'next/navigation';
// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import {
//   Search,
//   X,
//   Package,
//   Filter,
// } from 'lucide-react';
// import { FourSquare } from "react-loading-indicators";
// import PaginationComponent from '@/components/ui/Pagination';
// import { usePagination } from '@/hook/usePagination';
// import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton';

// export default function ProductsContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const searchQuery = searchParams.get('search') || undefined;

//   const [searchInput, setSearchInput] = useState('');
//   const [activeCategory, setActiveCategory] = useState(searchQuery || 'همه');
//   const { currentPage, handlePageChange, resetPage } = usePagination({ scrollToTop: true, });

//   const { data, isLoading, isError } = useProducts({
//     page: currentPage,
//     limit: 15,
//     search: activeCategory === 'همه' ? undefined : activeCategory
//   });

//   const categories = [
//     { label: 'همه', value: undefined, icon: '' },
//     { label: 'مغز پسته', value: 'مغز پسته', icon: ' ' },
//     { label: 'پسته اکبری', value: 'پسته اکبری', icon: ' ' },
//     { label: 'پسته خندان', value: 'پسته خندان', icon: ' ' },
//     { label: 'پسته کله قوچی', value: 'پسته کله قوچی', icon: ' ' },
//   ];

//   function handleSearch(query: string) {
//     resetPage();
//     if (query.trim()) {
//       router.push(`/products?search=${encodeURIComponent(query.trim())}`);
//       setActiveCategory(query.trim());
//     } else {
//       router.push(`/products`);
//       setActiveCategory('همه');
//     }
//   }

//   function handleCategoryClick(category: typeof categories[0]) {
//     resetPage();
//     setActiveCategory(category.label);
//     if (category.value) {
//       router.push(`/products?search=${encodeURIComponent(category.value)}`);
//     } else {
//       router.push(`/products`);
//     }
//   }

//   const handleSearchSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     handleSearch(searchInput);
//   };

//   return (
//     <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 font-kalameh'>
//       <div className='w-full mx-auto px-0 md:px-10'>
//         {/* Header */}
//         <motion.div
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className='text-center mb-6'
//         >
//           <h1 className='text-5xl font-black text-gray-900 font-[sarvenaz]'>
//             محصولات
//             <span className='text-primary'> ویژه</span>
//           </h1>
//         </motion.div>

//         {/* Search & Filters Bar */}
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2 }}
//           className='bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-8'
//         >
//           <div>
//             <p className='text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2'>
//               <Filter size={16} className='text-primary' />
//               جستجو و دسته‌بندی محصولات
//             </p>

//             <div className='flex max-lg:flex-col flex-row-reverse justify-between items-start gap-3'>
//               {/* Search Input */}
//               <form onSubmit={handleSearchSubmit} className='w-full lg:max-w-150'>
//                 <div className='relative'>
//                   <Search size={20} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
//                   <input
//                     type="text"
//                     value={searchInput}
//                     onChange={(e) => setSearchInput(e.target.value)}
//                     placeholder="جستجوی محصول..."
//                     className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 outline-none text-black text-right'
//                   />
//                   {searchInput && (
//                     <button
//                       type="button"
//                       onClick={() => {
//                         setSearchInput('');
//                         router.push('/products');
//                         setActiveCategory('همه');
//                         resetPage();
//                       }}
//                       className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors'
//                     >
//                       <X size={18} />
//                     </button>
//                   )}
//                 </div>
//               </form>

//               {/* Categories */}
//               <div className='relative w-full'>
//                 <div className='flex gap-2 overflow-x-auto pb-2 w-full scroll-smooth'>
//                   {categories.map((cat) => (
//                     <motion.button
//                       key={cat.label}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                       onClick={() => handleCategoryClick(cat)}
//                       className={`sm:px-4 px-2 sm:py-2.5 py-1 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${activeCategory === cat.label
//                         ? 'bg-primary text-white shadow-lg shadow-primary/20'
//                         : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                         }`}
//                     >
//                       <span>{cat.icon}</span>
//                       {cat.label}
//                     </motion.button>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>

//         {/* Products Grid */}
//         <div className='min-h-[400px] w-full'>
//           {isLoading ? (
//                  <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
//                  {[...Array(10)].map((_, index) => (
//                   <div className='flex justify-center items-center w-full'>
//                     <ProductCardSkeleton key={index} />
//                   </div>
//                  ))}
//              </div>
//           ) : isError ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className='flex flex-col items-center justify-center h-96 text-center'
//             >
//               <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4'>
//                 <X size={32} className='text-red-500' />
//               </div>
//               <h3 className='text-xl font-bold text-gray-800 mb-2'>خطا در بارگذاری</h3>
//               <p className='text-gray-500 mb-4'>متأسفانه در دریافت محصولات مشکلی پیش آمده است</p>
//               <button
//                 onClick={() => window.location.reload()}
//                 className='px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-orange-700 transition-all'
//               >
//                 تلاش مجدد
//               </button>
//             </motion.div>
//           ) : data?.data.length === 0 ? (
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               className='flex flex-col items-center justify-center h-96 text-center'
//             >
//               <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
//                 <Package size={32} className='text-gray-400' />
//               </div>
//               <h3 className='text-xl font-bold text-gray-800 mb-2'>محصولی یافت نشد</h3>
//               <p className='text-gray-500 mb-4'>
//                 {activeCategory !== 'همه'
//                   ? `محصولی در دسته "${activeCategory}" پیدا نشد`
//                   : 'هیچ محصولی برای نمایش وجود ندارد'}
//               </p>
//               <button
//                 onClick={() => {
//                   setActiveCategory('همه');
//                   setSearchInput('');
//                   resetPage();
//                   router.push('/products');
//                 }}
//                 className='px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all'
//               >
//                 مشاهده همه محصولات
//               </button>
//             </motion.div>
//           ) : (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
//                 dir='ltr'
//               >
//                 {data?.data.map((product, index) => (
//                   <motion.div
//                     key={product.id || index}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: index * 0.05 }}
//                     className='flex justify-center items-center w-full h-full'
//                   >
//                     <div className='w-full h-full max-sm:min-w-90 px-5'>
//                       <ProductCard data={product} />
//                     </div>
//                   </motion.div>
//                 ))}
//               </motion.div>

//               {/* Pagination Component */}
//               {data &&
//                 <PaginationComponent
//                   pagination={data?.pagination}
//                   currentPage={currentPage}
//                   onPageChange={handlePageChange}
//                   className="mt-12 mb-8"
//                   infoText="محصول"
//                 />
//               }
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import ProductCard from '@/components/ProductCard/ProductCard';
// import { useProducts } from '@/hook/useProduct'; // کامنت شده
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  X,
  Package,
  Filter,
} from 'lucide-react';
// import { FourSquare } from "react-loading-indicators"; // استفاده نمی‌شود
import PaginationComponent from '@/components/ui/Pagination';
import { usePagination } from '@/hook/usePagination';
import ProductCardSkeleton from '../Skeleton/ProductCardSkeleton';
import { Muckdata } from '@/muckDatas/productCard';
import { useGold18Price } from '@/hook/useGoldPrice';
import { useProductsWithRealPrices } from '@/muckDatas/calcPrice';
// === پایان داده‌های Mock ===

export default function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('search') || undefined;

  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchQuery || 'همه');
  const { currentPage, handlePageChange, resetPage } = usePagination({ scrollToTop: true, });

  const dataWithPrice = useProductsWithRealPrices()

  // === استفاده از داده‌های Mock به جای API ===
  // const { data, isLoading, isError } = useProducts({
  //   page: currentPage,
  //   limit: 15,
  //   search: activeCategory === 'همه' ? undefined : activeCategory
  // });

  // تابع فیلتر و جستجو با useMemo برای بهینه‌سازی
  const filteredData = useMemo(() => {
    let filtered = dataWithPrice.products;

    // فیلتر بر اساس دسته‌بندی (فقط اگر دسته‌بندی انتخاب شده باشد)
    if (activeCategory !== 'همه') {
      filtered = filtered.filter(item => 
        item.title === activeCategory || // تطابق دقیق با عنوان
        item.title.includes(activeCategory)  // تطابق جزئی با عنوان
        // item.description.includes(activeCategory) 
      );
    }

    // فیلتر بر اساس جستجوی متنی (اگر searchInput خالی نباشد)
    if (searchInput.trim()) {
      const searchTerm = searchInput.trim().toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        // item.description.toLowerCase().includes(searchTerm) ||
        item.id.toString().includes(searchTerm) ||
        item.price.toString().includes(searchTerm) ||
        item.weight.toString().includes(searchTerm)
      );
    }

    return filtered;
  }, [dataWithPrice.products, activeCategory, searchInput]);

  // تابع پیجینیشن
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * 15;
    const endIndex = startIndex + 15;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        total: filteredData.length,
        page: currentPage,
        limit: 15,
        totalPages: Math.ceil(filteredData.length / 15)
      }
    };
  };

  const data = getPaginatedData();
  const isLoading = false; // بدون لودینگ چون داده‌ها محلی هستند
  const isError = false; // بدون خطا
  // === پایان استفاده از داده‌های Mock ===

  const categories = [
    { label: 'همه', value: undefined, icon: '' },
    { label: 'نیمست', value: 'نیمست', icon: ' ' },
    { label: 'گردنبند', value: 'گردنبند', icon: ' ' },
    { label: 'گوشواره', value: "گوشواره", icon: ' ' },
    { label: 'دستبند', value: 'دستبند', icon: ' ' },
  ];

  function handleSearch(query: string) {
    resetPage();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setActiveCategory('همه'); // وقتی جستجو انجام میشه، دسته‌بندی رو ریست کن
    } else {
      router.push(`/products`);
      setActiveCategory('همه');
    }
  }

  function handleCategoryClick(category: typeof categories[0]) {
    resetPage();
    setActiveCategory(category.label);
    setSearchInput(''); // وقتی دسته‌بندی انتخاب میشه، جستجو رو پاک کن
    if (category.value) {
      router.push(`/products?search=${encodeURIComponent(category.value)}`);
    } else {
      router.push(`/products`);
    }
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchInput);
  };

  // تابع ریست کامل فیلترها
  const resetAllFilters = () => {
    setSearchInput('');
    setActiveCategory('همه');
    resetPage();
    router.push('/products');
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-50 to-white py-20 font-kalameh'>
      <div className='w-full mx-auto px-0 md:px-10'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='text-center mb-6'
        >
          <h1 className='text-5xl font-black text-gray-900 font-[sarvenaz]'>
            محصولات
            <span className='text-primary'> ویژه</span>
          </h1>

        </motion.div>

        {/* Search & Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-2xl shadow-lg border border-gray-200 p-4 mb-8'
        >
          <div>
            <div className='flex justify-between items-center mb-3'>
              <p className='text-sm font-semibold text-gray-600 flex items-center gap-2'>
                <Filter size={16} className='text-primary' />
                جستجو و دسته‌بندی محصولات
              </p>
              {/* دکمه ریست فیلترها */}
              {(searchInput || activeCategory !== 'همه') && (
                <button
                  onClick={resetAllFilters}
                  className='text-xs text-red-500 hover:text-red-700 font-semibold flex items-center gap-1'
                >
                  <X size={14} />
                  حذف فیلترها
                </button>
              )}
            </div>

            <div className='flex max-lg:flex-col flex-row-reverse justify-between items-start gap-3'>
              {/* Search Input */}
              <form onSubmit={handleSearchSubmit} className='w-full lg:max-w-150'>
                <div className='relative'>
                  <Search size={20} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="جستجوی محصول بر اساس نام، قیمت، وزن، توضیحات..."
                    className='w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 outline-none text-black text-right'
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchInput('');
                        resetPage();
                        // اگر دسته‌بندی فعال بود، آن را حفظ کن
                        if (activeCategory === 'همه') {
                          router.push('/products');
                        }
                      }}
                      className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors'
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </form>

              {/* Categories */}
              <div className='relative w-full'>
                <div className='flex gap-2 overflow-x-auto pb-2 w-full scroll-smooth'>
                  {categories.map((cat) => (
                    <motion.button
                      key={cat.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleCategoryClick(cat)}
                      className={`sm:px-4 px-2 sm:py-2.5 py-1 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 whitespace-nowrap flex-shrink-0 ${
                        activeCategory === cat.label
                          ? 'bg-primary text-white shadow-lg shadow-primary/20'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      {cat.label}
                      {/* نمایش تعداد محصولات در هر دسته */}
                    
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Products Grid */}
        <div className='min-h-[400px] w-full'>
          {isLoading ? (
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {[...Array(10)].map((_, index) => (
                <div className='flex justify-center items-center w-full' key={index}>
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : isError ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex flex-col items-center justify-center h-96 text-center'
            >
              <div className='w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4'>
                <X size={32} className='text-red-500' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-2'>خطا در بارگذاری</h3>
              <p className='text-gray-500 mb-4'>متأسفانه در دریافت محصولات مشکلی پیش آمده است</p>
              <button
                onClick={() => window.location.reload()}
                className='px-6 py-2 bg-primary text-white rounded-xl font-semibold hover:bg-orange-700 transition-all'
              >
                تلاش مجدد
              </button>
            </motion.div>
          ) : data?.data.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className='flex flex-col items-center justify-center h-96 text-center'
            >
              <div className='w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
                <Package size={32} className='text-gray-400' />
              </div>
              <h3 className='text-xl font-bold text-gray-800 mb-2'>محصولی یافت نشد</h3>
              <p className='text-gray-500 mb-4'>
                {activeCategory !== 'همه' && searchInput
                  ? `محصولی با جستجوی "${searchInput}" در دسته "${activeCategory}" پیدا نشد`
                  : activeCategory !== 'همه'
                  ? `محصولی در دسته "${activeCategory}" پیدا نشد`
                  : searchInput
                  ? `محصولی با جستجوی "${searchInput}" پیدا نشد`
                  : 'هیچ محصولی برای نمایش وجود ندارد'
                }
              </p>
              <button
                onClick={resetAllFilters}
                className='px-6 py-2 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all'
              >
                مشاهده همه محصولات
              </button>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'
                dir='ltr'
              >
                {data.data.map((product, index) => (
                  <motion.div
                    key={product.id || index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className='flex justify-center items-center w-full h-full'
                  >
                    <div className='w-full h-full max-sm:min-w-90 px-5'>
                      <ProductCard data={product}  />
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination Component */}
              {data && data.pagination.totalPages > 1 && (
                <PaginationComponent
                  pagination={data?.pagination}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  className="mt-12 mb-8"
                  infoText="محصول"
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}