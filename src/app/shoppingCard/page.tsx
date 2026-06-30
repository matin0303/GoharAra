'use client'
import ShoppingCard from '@/components/shoppingCard/ShoppingCard'
import ShoppingCardSkeleton from '@/components/Skeleton/ShoppingCardSkeleton'
import { useCreateOrder } from '@/hook/useOrder'
import { useProductByIds } from '@/hook/useProduct'
import { clearCart, selectCartItems } from '@/lib/redux/slices/shoppingCardSlice'
import { OrderItemRequest, Product } from '@/types/api.types'
import { List, ListCheckIcon, Plus, ShoppingBag, ShoppingBasket, Truck } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { FaStumbleupon } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion';
import Link from 'next/link'
import { useRouter } from 'next/navigation'


export default function page() {
  const dispatch = useDispatch();
  const router = useRouter()
  const [cardProducts, setCardProducts] = useState<Product[] | null>(null)
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [updateTotalPrice, setUpdateTotalPrice] = useState<number>(0);
  const [openAddToCard, setOpenAddToCard] = React.useState(false)
  const cartItems = useSelector(selectCartItems);
  const { mutate: products, isPending, isError } = useProductByIds()
  const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder();

  function handleDelete(id: number) {
    setCardProducts(prev => {
      if (!prev) return null;
      return prev.filter(product => product.id !== id);
    });
  }
  function handleUpdateCardWeight() {
    setUpdateTotalPrice(updateTotalPrice + 1)
  }
  const handleSubmit = () => {
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');

    const orderItems: OrderItemRequest[] = cartItems
      .filter((item: OrderItemRequest) =>
        cardProducts?.some(product => product.id === item.id)
      )
      .map((item: OrderItemRequest) => ({
        id: item.id,
        weight: Math.abs(item.weight),
      }));

    createOrder(
      { items: orderItems },
      {
        onSuccess: (response) => {
          dispatch(clearCart())
          setCardProducts(null)
          setOpenAddToCard(false)
        },
        onError:(error)=>{
          if(error.message === 'ابتد وارد حساب خود شوید.'){
            router.push('/login?redirect=shoppingCard')
          }
        }
      }
    );
  };

  useEffect(() => {
    const ids = cartItems.map((item: any) => item.id);
    if (ids.length > 0) {
      products(ids, {
        onSuccess(response) {
          setCardProducts(response.data)
        }
      });
    }
  }, []);

  useEffect(() => {
    if (cardProducts && cardProducts.length > 0 && cartItems) {
      const total = cardProducts.reduce((sum, product) => {
        const cartItem = cartItems.find((item: any) => item.id === product.id);
        const weight = cartItem ? Math.abs(cartItem.weight) : 0;
        return sum + (weight * product.price);
      }, 0);

      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [cardProducts, updateTotalPrice , cartItems]);

  const [cartCount, setCartCount] = useState(0);
  
  useEffect(() => {
    try {
      setCartCount(cartItems.length);
    } catch (error) {
      setCartCount(0);
    }
  }, []); 

  return (
    <div className='w-full min-h-screen pt-20 px-20 max-md:px-0 font-sarvenaz text-2xl'>
      <div className='w-full flex justify-start max-md:justify-between items-center gap-1 px-2'>
        <span className='text-orange-600 max-sm:text-lg'>محصولاتی که به سبد خرید اضافه کردید</span>
        <span className=' px-3 rounded-full max-sm:text-lg text-white bg-orange-400 flex justify-center items-center '>{(cartCount)}</span>
      </div>
      <div className='w-full h-full relative flex'>
        <div className='w-full h-full p-2'>
          {/* Skeleton loading state */}
          {isPending && [...Array(3)].map((_, index) => (
            <motion.div
              key={`skeleton-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ShoppingCardSkeleton />
            </motion.div>
          ))}

          {/* Actual data */}
          {!isPending && cardProducts && cardProducts.length > 0 && cardProducts.map((data, index) => (
            <motion.div
              key={data.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              layout
            >
              <ShoppingCard
                data={data}
                onDelete={handleDelete}
                onUpdateWeight={handleUpdateCardWeight}
              />
            </motion.div>
          ))}

          {/* Empty Cart State - Simple Version */}
          {!isPending && (!cardProducts || cardProducts.length === 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className='flex flex-col items-center justify-center py-16 px-4 text-center'
            >
              <div className='w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6'>
                <ShoppingBag size={40} className='text-orange-400' />
              </div>
              <h3 className='text-xl font-bold text-gray-700 mb-2 font-kalameh'>
                سبد خرید خالی است
              </h3>
              <p className='text-gray-500 text-sm mb-6'>
                محصولی به سبد خرید اضافه نشده است
              </p>
              <Link href="/products">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className='bg-orange-400 text-white px-6 py-2.5 rounded-md font-semibold hover:bg-orange-500 transition-all duration-300'
                >
                  رفتن به فروشگاه
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
        {(cardProducts && cardProducts.length > 0) && (
          <>
            <div className=' sticky font-kalameh top-0 left-0 max-lg:hidden w-110 h-120 rounded-sm shadow-md p-3 text-gray-700 '>
              <div className='w-full h-full flex flex-col justify-between'>
                <div>
                  <span className=' text-lg flex flex-row-reverse gap-2 justify-end items-start'>لیست محصولات سبد شما : <ListCheckIcon className='text-orange-600' /></span>
                  <div className='w-full pr-7 max-h-50 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 '>
                    <ul className=' text-sm list-disc flex flex-col justify-center items-start gap-2'>
                      {cardProducts && cardProducts.map((data, index) => (
                        <li key={index}>{data.title}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className=''>
                  <div className='text-lg mt-5 pt-3 border-t-1 border-gray-200 flex flex-col gap-2'>
                    <div className='flex justify-between items-start flex-row-reverse gap-2'>
                      <span>رایگان</span>

                      <div className='flex justify-end items-start flex-row-reverse gap-2'>
                        هزینه ارسال :
                        <Truck className='text-orange-600' />
                      </div>

                    </div>
                  </div>
                  <div className='text-sm mt-5 pt-3 border-t-1 border-gray-200 flex justify-between gap-2'>
                    <span className='flex justify-end items-start flex-row-reverse gap-2'>
                      مجموع سفارشات سبد : <Plus className='text-orange-600' />
                    </span>
                    <div className=' flex justify-center items-center'>
                      <span className=' text-xl font-bold text-orange-600'>{(totalPrice).toLocaleString()}</span>
                      <img src="/Toman.svg" alt="تومان" className='w-6 h-6' />
                    </div>
                  </div>
                  <div className='w-full h-12 rounded-sm flex justify-center items-center bg-orange-600 mt-14 '>
                    <button onClick={handleSubmit} className='w-full h-full text-white font-[paeez] text-3xl shadow-md/30 flex flex-row-reverse justify-center items-center cursor-pointer'>پرداخت و ثبت<FaStumbleupon size={25} className='pl-1' /></button>
                  </div>

                </div>
              </div>
            </div>

            <button onClick={() => { setOpenAddToCard(true) }} className='lg:hidden z-3000 cursor-pointer w-full px-3 flex justify-between items-center fixed bottom-0 left-0 bg-gradient-to-r from-orange-400 to-orange-600 rounded-t-2xl shadow-xs/90 shadow-red-600 h-13'>
              <span className='text-white flex flex-row-reverse text-lg'>ثبت سفارش نهایی<ShoppingBasket className='pl-1' /></span>

              <div className='z-5 flex justify-center items-center'>
                <span className=' text-3xl text-white'> {(totalPrice)?.toLocaleString()} </span>
                <img src="/Toman.svg" alt="تومان" className='w-6 h-6 brightness-0 invert' />
              </div>

            </button>
            <div className={`z-10 w-full ${openAddToCard ? 'opacity-100 visible  h-full' : 'opacity-0 invisible h-0'} flex flex-col  h-full fixed left-0 bottom-0 transition-discrete duration-300 backdrop-blur-2xl justify-center items-end`}>
              <div onClick={() => { setOpenAddToCard(false) }} className='h-full w-full' />
              <div className={`relative w-full bg-gray-100 pt-7 p-2 rounded-t-2xl`}>
                <div onClick={() => { setOpenAddToCard(false) }} className='absolute top-0 left-0 p-2'><IoClose size={23} /></div>
                <div className='w-full h-full flex flex-col justify-between'>
                  <div>
                    <span className=' text-lg flex flex-row-reverse gap-2 justify-end items-start'>لیست محصولات سبد شما : <ListCheckIcon className='text-orange-600' /></span>
                    <div className='w-full pr-7 max-h-50 overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 '>
                      <ul className=' text-sm list-disc flex flex-col justify-center items-start gap-2'>
                        {cardProducts && cardProducts.map((data, index) => (
                          <li key={index}>{data.title}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className=''>
                    <div className='text-lg mt-5 pt-3 border-t-1 border-gray-200 flex flex-col gap-2'>
                      <div className='flex justify-between items-start flex-row-reverse gap-2'>
                        <span>رایگان</span>

                        <div className='flex justify-end items-start flex-row-reverse gap-2'>
                          هزینه ارسال :
                          <Truck className='text-orange-600' />
                        </div>

                      </div>
                    </div>
                    <div className='text-sm mt-5 pt-3 border-t-1 border-gray-200 flex justify-between gap-2'>
                      <span className='flex justify-end items-start flex-row-reverse gap-2'>
                        مجموع سفارشات سبد : <Plus className='text-orange-600' />
                      </span>
                      <div className=' flex justify-center items-center'>
                        <span className=' text-xl font-bold text-orange-600'>{(totalPrice).toLocaleString()}</span>
                        <img src="/Toman.svg" alt="تومان" className='w-6 h-6' />
                      </div>
                    </div>
                    <div className='w-full h-12 rounded-sm flex justify-center items-center bg-orange-600 mt-14 '>
                      <button onClick={handleSubmit} className='w-full h-full text-white font-[paeez] text-3xl shadow-md/30 flex flex-row-reverse justify-center items-center cursor-pointer'>پرداخت و ثبت<FaStumbleupon size={25} className='pl-1' /></button>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
