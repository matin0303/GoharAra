import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaRegMoneyBillAlt } from 'react-icons/fa'
import { ArrowLeftIcon, Minus, NutIcon, Plus, PlusCircle, ShoppingBasket, Trash } from 'lucide-react'
import { Product } from '@/types/api.types'
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, selectCartItems, updateItemWeight } from '@/lib/redux/slices/shoppingCardSlice'

interface cartProps {
  data: Product , 
	onDelete : (id:number)=>void
	onUpdateWeight:() =>void
}

export default function ShoppingCard({ data , onDelete , onUpdateWeight }: cartProps) {
  const dispatch = useDispatch();
  const [weight, setWeight] = useState<number>(0)
  const [images, setImages] = useState<string[]>([])
  const cartItems = useSelector(selectCartItems);

  function handleWeight() {
    const itemWithId = cartItems.find((item: any) => item.id === data.id);
    if (itemWithId) {
      setWeight(Math.abs(itemWithId.weight))
    }
  }

  function updateWeightInCart(newWeight: number) {
    const itemIndex = cartItems.findIndex((item: any) => item.id === data.id);
    if (itemIndex !== -1) {
      dispatch(updateItemWeight({id:data.id,weight:newWeight}))
      setWeight(Math.abs(newWeight));
    }
  }

  function handleIncrease() {
    const newWeight = weight + 0.5;
    updateWeightInCart(Math.abs(newWeight));
		onUpdateWeight()
  }

  function handleDecrease() {
    if (weight > 0.5) {
      const newWeight = weight - 0.5;
      updateWeightInCart(Math.abs(newWeight));
			onUpdateWeight()
    }
  }

  function handleDelete() {
    dispatch(removeFromCart(data.id));
		onDelete(data.id)
  }

  useEffect(() => {
    handleWeight()
    const imagesArray = data.images
      .replace(/[\[\]"]/g, '')
      .split(',')
      .map(img => img.trim());
    setImages(imagesArray)
  }, [data]);

  return (
    <div className='w-full h-50 max-md:h-auto flex justify-center items-center border-gray-200 border-t-1 max-md:flex-col'>
      <div className='flex justify-between items-center w-full p-5'>
        <div className='flex flex-col justify-center items-center gap-1'>
          <img src={images[0]} className='w-30 rounded-lg object-cover aspect-square' alt="" />
          <Link href={`products/${data.id}`} className='font-kalameh text-sm px-1 py-1 w-full text-blue-400 rounded-sm flex justify-between'>
            مشاهده <ArrowLeftIcon />
          </Link>
        </div>

        <div className='pr-5 flex flex-col w-full gap-2 text-lg max-sm:text-sm'>
          <div className='flex justify-start items-center gap-2'>
            <NutIcon />
            <span className='text-xl'>{data.title}</span>
          </div>

          <div className='flex justify-start items-center gap-2'>
            <PlusCircle />
            <span className=''>مجموع سفارش : <span className='font-kalameh px-2 font-bold'>{weight}</span> کیلوگرم</span>
          </div>

          <div className='flex justify-start items-center gap-2'>
            <FaRegMoneyBillAlt />
            <span className=''>مجموع مبلغ : <span className='font-kalameh px-2 font-bold'>{(data.price * weight).toLocaleString()}</span> تومان</span>
          </div>

          <div className='flex justify-start items-center gap-2'>
            <ShoppingBasket />
            <span className=''> تأمین کننده : دیوپسته </span>
          </div>
        </div>
      </div>
      
      <div className='flex flex-col max-md:flex-row justify-start items-start mt-2 h-full max-md:w-full ml-5 gap-2'>
        <div className='flex justify-center max-md:justify-start items-center w-full py-2 max-md:px-5'>
          <Trash 
            size={20} 
            className='text-red-500 hover:text-red-700 cursor-pointer' 
            onClick={handleDelete}
          />
        </div>

        <div className='w-full rounded-sm border-1 max-w-25 border-gray-100 flex flex-col max-md:flex-row justify-between items-center'>
          <button 
            className='cursor-pointer hover:bg-gray-100 rounded-sm p-1'
            onClick={handleIncrease}
          >
            <Plus size={18} />
          </button>
          
          <input 
            type="text" 
            value={weight} 
            className='outline-0 min-w-3 max-w-7 text-center' 
            readOnly
          />
          
          <button 
            className={`cursor-pointer hover:bg-gray-100 rounded-sm p-1 ${weight <= 0.5 ? 'opacity-30 cursor-not-allowed' : ''}`}
            onClick={handleDecrease}
            disabled={weight <= 0.5}
          >
            <Minus size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}