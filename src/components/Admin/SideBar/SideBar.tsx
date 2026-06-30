'use client'
import { useAppSelector } from '@/hook/useRedux'
import { selectRole } from '@/lib/redux/slices/authSlice'
import { BookPlus, File, FilePlus, Home, ListOrdered, LucideBellPlus, PackagePlusIcon, PlusIcon, PlusSquare, ShoppingBag, Text, ChevronRight, ChevronLeft, Users } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'

export default function SideBar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const role = useAppSelector(selectRole);
    
    // تعریف آیتم‌های پایه (بدون کاربران)
    const baseSidebarItems = [
        { href: '/admin/products', icon: ShoppingBag, label: 'محصولات' },
        { href: '/admin/products/addProduct', icon: PackagePlusIcon, label: 'افزودن محصول' },
        { href: '/admin/articles', icon: File, label: 'مقالات' },
        { href: '/admin/articles/addArticle', icon: FilePlus, label: 'افزودن مقاله' },
        { href: '/admin/orders', icon: ListOrdered, label: 'سفارشات' },
        { href: '/', icon: Home, label: 'خانه' }
    ]
    const usersItem = { href: '/admin/users', icon: Users, label: 'کاربران' }
    const sidebarItems = role === 'manager' ? [...baseSidebarItems.slice(0, -1), usersItem, ...baseSidebarItems.slice(-1)]: baseSidebarItems

    const isActive = (href:string) => {
        if (href === '/') {
            return pathname === '/'
        }
        return pathname.endsWith(href)
    }

    return (
        <>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden absolute top-4 right-2 z-80 p-2 bg-gray-800 text-white rounded-lg shadow-lg"
            >
                {isOpen ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
            </button>

            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div className={`
                fixed max-md:right-0 md:static h-full max-h-150 shadow-xl/30 bg-gray-50
                transition-all duration-300 ease-in-out z-40
                ${isOpen ? 'w-15' : 'w-0 md:w-15'}
                rounded-l-lg
            `}>
                <div className='w-full h-full flex flex-col justify-between items-center py-5 '>
                    <div className='w-full h-full flex flex-col justify-start items-center gap-10'>
                        {sidebarItems.filter(item => item.href !== '/').map((item, index) => (
                            <div key={index} className='relative w-full flex justify-center items-center group'>
                                <Link 
                                    href={item.href} 
                                    className={`
                                        w-full flex justify-center items-center p-2 transition-all duration-200
                                        ${isActive(item.href) ? 'text-primary scale-110' : 'text-gray-600'}
                                        hover:text-primary hover:scale-110
                                    `}
                                >
                                    <item.icon size={20} />
                                </Link>
                                
                                <div className="
                                    absolute right-full mr-1 px-3 py-1 z-20 bg-gray-800 text-white font-kalameh 
                                    rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100
                                    transition-opacity duration-200 pointer-events-none
                                ">
                                    <Link href={item.href} className="text-white hover:text-orange-300">
                                        {item.label}
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className='w-full relative flex justify-center items-center group'>
                        <Link 
                            href={'/'} 
                            className={`
                                w-full flex justify-center items-center p-2 transition-all duration-200
                                ${isActive('/') ? 'text-primary scale-110' : 'text-gray-600'}
                                hover:text-primary hover:scale-110
                            `}
                        >
                            <Home size={20} />
                        </Link>
                        
                        <div className="
                            absolute right-full mr-2 px-3 py-1 bg-gray-800 text-white 
                            rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100
                            transition-opacity duration-200 pointer-events-none
                            hidden md:block
                        ">
                            <Link href={'/'} className="text-white hover:text-orange-300">
                                خانه
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}