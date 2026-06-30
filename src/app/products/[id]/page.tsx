"use client"
import AddToCardMobilePopup from '@/components/Products/AddToCardMobilePopup';
import AddToCardSidebar from '@/components/Products/AddToCardSidebar';
import ProductGallery from '@/components/Products/ProductGallery';
import { ChevronLeft, PhoneCall, ShoppingBasket } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Muckdata } from '@/muckDatas/productCard';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductsWithRealPrices } from '@/muckDatas/calcPrice';
import Link from 'next/link';

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [openAddToCard, setOpenAddToCard] = React.useState(false)
  const [images, setImages] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [data, setData] = React.useState<any>(null)
  const dataWithPrice = useProductsWithRealPrices()

  // ✅ ref برای کنترل اجرا
  const effectRun = useRef(false)

  useEffect(() => {
    setIsLoading(true)
    const product = dataWithPrice.products.find(item => item.id === Number(id))
    if (product) {
      setData({ data: product })
      const imagesArray = product.images
        .replace(/[\[\]"]/g, '')
        .split(',')
        .map(img => img.trim());
      setImages(imagesArray)
    }
    setIsLoading(false)
  }, [dataWithPrice.products]) 

  if (!isLoading && !data) {
    return <div className='w-full h-screen font-sarvenaz text-orange-600 text-2xl flex justify-center items-center flex-row-reverse'> محصول یافت نشد <span className='text-3xl mx-2'>404 - </span> </div>
  }

  if (isLoading) {
    return <div className='w-full h-screen font-sarvenaz text-orange-600 text-2xl flex justify-center items-center flex-row-reverse'>در حال بارگذاری...</div>
  }

  return (
    <div className='w-full min-h-screen pt-20 pb-5 sm:px-10 bg-white font-[sarvenaz]'>
      <div className='mx-auto px-2 sm:px-10 pb-4'>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className='flex items-center gap-2 text-sm text-gray-500'
        >
          <Link href="/"  className='hover:text-primary transition-colors'>خانه</Link>
          <ChevronLeft className='w-4 h-4' />
          <Link href="/products" className='hover:text-primary transition-colors'>محصولات</Link>
          <ChevronLeft className='w-4 h-4' />
          <span className='text-gray-800 font-bold'>{data?.data.title}</span>
        </motion.div>
      </div>
      <div className='flex justify-center items-center'>
        <div className='relative w-full max-w-7xl h-full flex max-md:flex-col justify-center items-start gap-1.5'>
          <div className='w-170 max-md:w-full min-h-140 flex justify-evenly items-start  flex-col sticky max-md:relative top-0 right-0 p-3 max-lg:pb-5 rounded-sm shadow-md '>
            <ProductGallery images={images} />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className='mt-6 w-full bg-gradient-to-br from-primary/2 to-primary/5 rounded-2xl p-2 max-md:p-6 border border-icon-primary'
            >
               <h1 className=' text-2xl hidden max-md:block max-md:pr-5 mb-2 text-primary'><li>{data?.data.title}</li></h1>
              <div className='flex justify-between items-center mb-4'>
                <div>
                  <span className='text-sm text-gray-500 block'>قیمت لحظه‌ای</span>
                  <div className='flex items-baseline gap-1 mt-1'>
                    <span className='text-4xl font-black text-primary'>
                      {data.data.realPrice ? data.data.realPrice.toLocaleString() : '..........'}
                    </span>
                    <span className='text-sm text-gray-500'>تومان</span>
                  </div>
                </div>
                <div className='text-right'>
                  <span className='text-sm text-gray-500 block'>وزن</span>
                  <div className='flex items-baseline gap-1 mt-1'>
                    <span className='text-2xl font-bold text-gray-700'>
                      {(data.data.weight).toLocaleString()}
                    </span>
                    <span className='text-sm text-gray-500'>گرم</span>
                  </div>
                </div>
              </div>

            </motion.div>

            <div className='w-full h-12 rounded-sm justify-center items-center bg-black'>
              <Link href='tel:09010791929' className='w-full h-full text-white font-[paeez] text-3xl shadow-md/30 flex justify-center items-center flex-row-reverse'> مشاوره تلفنی <PhoneCall className='pl-2' /></Link>
            </div>
          </div>
          <div className=' w-full sm:min-h-150 h-full rounded-sm shadow-md p-10 max-md:p-3 '>
            <div className='w-full flex justify-center items-center flex-col'>
              <h1 className='w-full text-start text-2xl max-md:hidden text-primary'><li>{data?.data.title}</li></h1>
              <div className='max-w-3xl flex justify-center items-center'>
                <p className=' mt-5 text-center text-xl leading-relaxed text-gray-700'>
                  {data?.data.description}
                </p>
              </div>
            </div>
            <div></div>
          </div>
          {/* <AddToCardSidebar data={data}/>

        <button onClick={() => { setOpenAddToCard(true) }} className='lg:hidden cursor-pointer w-full px-3 flex justify-between items-center fixed bottom-0 left-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-2xl shadow-xs/90 shadow-red-600 h-13'>
          <span className='text-white flex flex-row-reverse text-lg'>افزودن به سبدخرید <ShoppingBasket className='pl-1' /></span>

          <div className='z-5 flex justify-center items-center'>
            <span className=' text-3xl text-white'> {(data?.data.price)?.toLocaleString()} </span>
            <img src="/Toman.svg" alt="تومان" className='w-6 h-6 brightness-0 invert' />
          </div>

        </button>
        <div className={`z-10 w-full ${openAddToCard ? 'opacity-100 visible  h-full' : 'opacity-0 invisible h-0'} flex flex-col h-full fixed left-0 bottom-0 transition-discrete duration-300 backdrop-blur-2xl justify-center items-end`}>
          <div onClick={() => { setOpenAddToCard(false) }} className='h-full w-full' />
          <div className={`relative w-full  pt-7 p-2 rounded-t-2xl`}>
            <div onClick={() => { setOpenAddToCard(false) }} className='absolute top-0 left-0 p-2'><IoClose size={23} /></div>
            <AddToCardMobilePopup data={data}/>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  )
}