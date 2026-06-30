import { Suspense } from 'react';
import LoginContent from '@/components/Login/LoginContent';
import { FourSquare } from 'react-loading-indicators';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="w-full h-screen bg-[url('/loginBg.jpg')] bg-orange-950 font-[sarvenaz] bg-cover bg-center bg-no-repeat flex justify-center items-center">
        <FourSquare color='#ea580c' size='large' text='در حال بارگذاری محصولات...' />

      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}