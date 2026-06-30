'use client'
import { useProfile } from '@/hook/useAuth'
import React, { useEffect } from 'react'
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';

export default function page() {
    const { data } = useProfile()
    useEffect(() => {
        if (data && (data?.data.role === 'manager' || 'admin') ) {
            redirect('/');
        }
        else {
            redirect('admin/products');
        }
    }, [data])
    return (
        <div className='w-full h-screen justify-center items-center font-sarvenaz text-xl'>
            در حال انتقال به داشبورد...
        </div>
    )
}
