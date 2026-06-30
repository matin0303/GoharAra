"use client"
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react'
import { JSX } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation';
import { IoSearch } from "react-icons/io5";
import { ChevronDown, File, FileBox, Gem, Home, Info, LayoutDashboard, LogIn, LogInIcon, LogOut, LucideShoppingBag, MenuIcon, Nut, Shapes, ShoppingBag, ShoppingCartIcon, Text, User, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hook/useRedux';
import { clearAuth, selectIsAuthenticated, selectRole } from '@/lib/redux/slices/authSlice';
import { useSelector } from 'react-redux';
import { selectTotalItems } from '@/lib/redux/slices/shoppingCardSlice';
import { removeTokenOnCookies } from '@/lib/utils';

export default function Header(): JSX.Element {
  const router = usePathname();
  const router2 = useRouter();
  const dispatch = useAppDispatch();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchButtonClicked, setSearchButtonClicked] = useState(0);
  const [openSearchBar, setOpenSearchBar] = useState(false)
  const [openMobileNavbar, setOpenMobileNavbar] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const role = useAppSelector(selectRole);
  const totalItems = useSelector(selectTotalItems);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const startTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setOpenSearchBar(false);
      setSearchButtonClicked(0)
    }, 5000);
  };

  const handleButtonClick = () => {
    setOpenSearchBar(true);
    setSearchButtonClicked(searchButtonClicked + 1)
    startTimer();
  };

  const handleInputFocus = () => {
    if (openSearchBar) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    }
  };

  const handleInputBlur = () => {
    if (openSearchBar) {
      startTimer();
    }
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    removeTokenOnCookies()
    dispatch(clearAuth());
    setIsDropdownOpen(false)
    setOpenMobileNavbar(false)
  }
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (searchButtonClicked > 1) {
      router2.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  }, [searchButtonClicked]);


  const ActiveStyle = " before:animate-nav before:content-[''] before:absolute before:w-[14px] before:h-[3px] before:bg-primary before:left-1/2 before:right-1/2 before:bottom-0 before:translate-1/2 before:rounded"
  return (
    <>
      <header className={` w-full absolute text-white z-50 top-0 left-0  h-16 flex justify-between items-center px-7 max-md:px-0 ${isScrolled ? 'md:fixed md:bg-black/50 md:backdrop-blur-sm rounded-b-md' : ''}`}>
        <span className={`max-md:hidden max-lg:${openSearchBar && 'hidden'} select-none w-full flex justify-start items-center font-extrabold text-3xl ${isScrolled ?'text-icon-primary':'text-primary'}  font-sarvenaz `}>
          <Link href='/' className='flex justify-center items-center'>
          <Gem className='rotate-30'/>
            گوهر آرا
          </Link>
        </span>
        <nav className='w-full flex justify-center items-center h-16'>
          <div className={`w-4/5 max-md:hidden relative max-[91rem]:w-full max-lg:min-w-96 max-sm:min-w-full flex justify-center items-center ${router !== '/' ? '' : isScrolled ? '' : "bg-gray-100"}   h-16 rounded-xl`}>
            {!isScrolled &&
              <>
                <div className={`absolute bg-gray-100 max-xl:hidden top-7 -left-2.5 w-5 z-10 h-3  ${router !== '/' ? 'hidden' : "flex"}`}>
                  <div className='w-5/10 h-full '></div>
                  <div className='w-5/10 h-full bg-neutral-500 rounded-tr-full'></div>
                </div>
                <div className={`absolute bg-gray-100 max-xl:hidden top-7 -right-2.5 w-5 z-10 h-3  ${router !== '/' ? 'hidden' : "flex"}`}>
                  <div className='w-5/10 h-full bg-neutral-400 rounded-tl-full'></div>
                  <div className='w-2/10 h-full bg-gray-100'></div>
                </div>
              </>
            }

            <ul className={`w-full mx-1 z-20 flex justify-center items-center gap-10 max-xl:gap-4 ${isScrolled ? 'bg-transparent' : 'bg-black'}  p-4 rounded-2xl font-[sarvenaz] text-lg`}>
              <li className='relative shrink-0 '>
                <Link className={router === '/' ? ActiveStyle : ""} href={'/'}>خانه</Link>
              </li>
              <li className='relative shrink-0'>
                <Link className={router === '/products' ? ActiveStyle : ""} href={'/products'} >محصولات</Link>
              </li>
              <li className='relative shrink-0'>
                <Link className={router === '/about' ? ActiveStyle : ""} href={'/about'} >درباره ما</Link>
              </li>
              <li className='relative shrink-0'>
                <Link className={router === '/articles' ? ActiveStyle : ""} href={'/articles'} >مقاله ها</Link>
              </li>
            </ul>
          </div>

          {/* mobile */}
          <div className='md:hidden fixed top-0 left-0 w-full bg-black/90 backdrop-blur-sm h-16 flex justify-between items-center pl-3 rounded-b-md'>
            <div>
              <button onClick={() => { setOpenMobileNavbar(true) }} className='p-2'><MenuIcon /></button>
            </div>

            <div className=' w-full flex gap-2 justify-end items-center '>
              <div className={` ${openSearchBar ? 'w-1/2 max-lg:w-full' : 'w-0'} flex flex-row-reverse justify-between items-center shadow-lg shadow-gray-300 rounded-4xl bg-gray-100 duration-300`}>
                <input
                  ref={inputRef}
                  type="text"
                  onChange={(e: any) => { setSearchQuery(e.target.value) }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { handleButtonClick() } }}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur} className={`${openSearchBar ? 'w-full px-2' : 'w-0'} h-10  font-bold text-2 border-none outline-none text-black text-right  font-[paeez] text-3xl max-sm:text-2xl`} placeholder='جستجو محصول' />
                <button onClick={handleButtonClick} className={` cursor-pointer shadow-md/30 text-2xl ${openSearchBar ? 'text-primary border-1 border-primary rounded-full py-2' : 'text-white'} shadow-none max-md:px-2 `}>{<IoSearch />}</button>
              </div>
              {isAuthenticated ?
                // <Link href={'/shoppingCard'} className='text-white relative'>
                //   {<ShoppingCartIcon />}
                //   {totalItems > 0 &&
                //     <span className='absolute -bottom-2 -right-2 font-kalameh text-xs text-white px-1 rounded-full bg-primary'>{totalItems}</span>
                //   }
                // </Link>
                <></>
                :
                <Link href={'/login'} className='text-white'>{<LogIn />}</Link>
              }
            </div>
          </div>

          {openMobileNavbar && (
            <>
              <div className=' w-full flex md:hidden h-screen fixed top-0 left-0 font-sarvenaz text-2xl z-50' >
                <AnimatePresence>
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className='min-w-70 bg-black px-3 relative z-20'>

                    <button onClick={() => setOpenMobileNavbar(false)} className='w-full cursor-pointer flex justify-start items-center h-16 p-2'>
                      <X className='text-white' size={25} />
                    </button>
                    <Link href='/' className='w-full font-sarvenaz text-3xl flex justify-start mb-2 text-primary items-center'><Gem className='rotate-30'/> گوهرآرا</Link>
                    <div className='w-full  flex justify-between items-center flex-col'>
                      <ul className='w-full'>
                        {[
                          { href: '/', icon: Home, label: 'خانه' },
                          { href: '/products', icon: LucideShoppingBag, label: 'محصولات' },
                          { href: '/articles', icon: Text, label: 'مقالات' },
                          { href: '/about', icon: Info, label: 'درباره ما' },
                          // { href: '/shoppingCard', icon: ShoppingCartIcon, label: 'سبدخرید' },
                        ].map((item, index) => (
                          <motion.li
                            key={item.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ delay: index * 0.2, duration: 0.2 }}
                            className='relative p-2 rounded-md mt-3'
                            onClick={() => { setOpenMobileNavbar(false) }}
                          >
                            <Link href={item.href} className='relative w-full flex justify-start items-center z-20'>
                              <item.icon size={30} />
                              <span className='w-full flex justify-center items-center text-lg'>{item.label}</span>
                            </Link>

                            <div className={`absolute inset-0 ${router === item.href ? 'bg-icon-primary' : ''} opacity-90 rounded-lg z-10`} />
                          </motion.li>
                        ))}
                      </ul>

                      {isAuthenticated && (role === 'admin' || role === 'manager') &&
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className='text-white w-full py-3 text-lg font-kalameh'
                          onClick={() => { setOpenMobileNavbar(false) }}

                        >
                          <div className='relative p-2 rounded-md'>
                            <Link href={role === 'admin' || role === 'manager' ? '/admin/products' : ''} className='relative w-full flex justify-start items-center gap-3 z-20'>
                              <LayoutDashboard size={30} className='text-blue-400' />
                              <span className='w-full flex justify-start items-center text-blue-400'>
                                داشبورد مدیریت
                              </span>
                            </Link>
                            <div className='absolute inset-0 opacity-70 rounded-lg z-10' />
                          </div>
                        </motion.div>
                      }
                      {isAuthenticated &&
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ delay: 0.3, duration: 0.3 }}
                          className='text-white w-full py-3 text-sm font-kalameh'
                        >
                          <div className='relative p-2 rounded-md'>
                            <button onClick={handleLogout} className='relative w-full flex justify-start items-center gap-3 z-20'>
                              <LogInIcon size={30} className='text-red-400' />
                              <span className='w-full flex justify-start items-center text-red-400'>
                                خروج از حساب کاربری
                              </span>
                            </button>
                            <div className='absolute inset-0 opacity-70 rounded-lg z-10' />
                          </div>
                        </motion.div>
                      }

                    </div>
                  </motion.div>
                </AnimatePresence>
                <div
                  onClick={() => setOpenMobileNavbar(false)}
                  className={`absolute ${!openMobileNavbar && 'hidden'} inset-0 w-full bg-black opacity-30 z-10`}
                />

              </div>
            </>
          )}
        </nav>

        <div className=' w-full flex gap-2 justify-end items-center max-md:hidden'>
          <div className={` ${openSearchBar ? 'w-1/2 max-lg:w-full' : 'w-0'} flex flex-row-reverse justify-between items-center shadow-lg shadow-gray-300 rounded-4xl bg-gray-100 duration-300`}>
            <input
              ref={inputRef}
              type="text"
              onChange={(e: any) => { setSearchQuery(e.target.value) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { handleButtonClick() } }}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur} className={`${openSearchBar ? 'w-full px-2' : 'w-0'} h-10  font-bold text-2 border-none outline-none text-black text-right  font-[paeez] text-3xl`} placeholder='جستجو محصول' />
            <button onClick={handleButtonClick} className='text-black cursor-pointer shadow-md/30 text-2xl p-2.5 rounded-full bg-gray-200'>{<IoSearch />}</button>
          </div>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className='text-black shadow-md/30 text-2xl p-2.5 rounded-full bg-gray-200 hover:bg-gray-300 transition-all duration-300 flex items-center gap-1'
                >
                  <User />
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className='absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50'
                    >
                      {(role === 'admin' || role === 'manager') && (
                        <Link href="/admin/products">
                          <motion.div
                            whileHover={{ backgroundColor: '#fff7ed' }}
                            className='flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-primary transition-all duration-200 border-b border-gray-100'
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <LayoutDashboard size={18} />
                            <span className='text-sm font-semibold'>داشبورد</span>
                          </motion.div>
                        </Link>
                      )}

                      {/* Logout Button */}
                      <motion.button
                        whileHover={{ backgroundColor: '#fef2f2' }}
                        onClick={handleLogout}
                        className='w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:text-red-600 transition-all duration-200'
                      >
                        <LogOut size={18} />
                        <span className='text-sm font-semibold'>خروج از حساب</span>
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            </div>

          ) : (
            <Link href={'/login'} className='relative text-black shadow-md/30 text-2xl p-2.5 rounded-full bg-gray-200'>{<LogIn />}</Link>
          )}

          {/* <Link href={'/shoppingCard'} className='relative text-black shadow-md/30 text-2xl p-2.5 rounded-full bg-gray-200'>
            <ShoppingCartIcon />
            {totalItems > 0 &&
              <span className='absolute -bottom-1 right-0 font-kalameh text-sm text-white px-1 rounded-full bg-primary'>{totalItems}</span>
            }
          </Link> */}

        </div>
      </header>
    </>
  )
}