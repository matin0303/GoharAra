// app/articles/page.js
import { Suspense } from 'react';
import ArticlesContent from '@/components/Articles/ArticlesContent'; 
import ArticleCardSkeleton from '@/components/Skeleton/ArticleCardSkeleton';

export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <div className='min-h-screen w-full py-20 px-3 sm:px-15'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl font-black text-gray-800 mb-4 font-sarvenaz'>
            مقالات
            <span className='text-primary'> آموزشی</span>
          </h1>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {[...Array(8)].map((_, index) => (
            <ArticleCardSkeleton key={index} />
          ))}
        </div>
      </div>
    }>
      <ArticlesContent />
    </Suspense>
  );
}