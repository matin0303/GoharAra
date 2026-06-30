import { Suspense } from 'react';
import { FourSquare } from "react-loading-indicators";
import ProductsContent from '@/components/Products/ProductsContent';

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className='flex justify-center items-center min-h-screen'>
        <FourSquare color='#ea580c' size='large' text='در حال بارگذاری محصولات...' />
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}