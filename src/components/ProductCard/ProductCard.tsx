'use client';
import { addToCart } from '@/lib/redux/slices/shoppingCardSlice';
import { Product, ProductsWithRealPrices } from '@/types/api.types';
import { ProductCardData } from '@/types/types';
import { PlusIcon, Check } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

// export default function ProductCard({ data  }: { data: Product}) {
  export default function ProductCard({ data  }: { data: ProductsWithRealPrices}) {

	const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [customWeight, setCustomWeight] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleAddToCard = () => {
    // وقتی روی تیک کلیک میشه
    handleAddToCart();
    setIsOpen(false);
  };

  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value) || 0;
    if (value < 1) {
      setCustomWeight(1);
    } else {
      setCustomWeight(value);
    }
  };

  const handleAddToCart = () => {
    if (!data) return;
    if(customWeight <= 0 ){
      toast.error('ابتدا وزن را وارد کنید')
      return
    }
    const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
		const existingItem = cartItems.find((item: any) => item.id === data.id);
		
		if (existingItem && existingItem.weight === customWeight) {
			toast.error('این محصول با همین وزن در سبد شما وجود دارد.');
			return;
		}
	
		dispatch(addToCart({ 
			id: data.id, 
			weight: Math.abs(customWeight)
		}));
		
		toast.success('محصول به سبد خرید اضافه شد.');
  };

  useEffect(() => {
    const imagesArray = data.images
      .replace(/[\[\]"]/g, '') 
      .split(',')
      .map(img => img.trim());
    setImages(imagesArray)
  }, [data]);

  return (
    <div className="select-none relative min-w-55 max-w-60 max-sm:min-w-full h-70 flex justify-center items-end shadow-md/30 rounded-2xl mb-1 bg-gray-100">
      <div className="w-full flex justify-center items-center flex-col z-20">
        <Link href={`/products/${data.id}`} className="relative w-full">
          <img src={images[0]} alt="img" className="overflow-hidden h-60 w-full aspect-square object-cover rounded-t-2xl" />
          <div className="absolute text-white top-0 left-0 w-full h-[60px] bg-gradient-to-b from-black to-transparent rounded-t-2xl px-3 flex justify-end items-center font-[sarvenaz] text-lg">
            {data.title}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[10px] bg-gradient-to-t from-white to-transparent px-3 flex justify-end items-center font-[sarvenaz] text-lg">
          </div>
        </Link>

        <div className="w-full flex justify-center items-center font-[yekan] text-white duration-500 transition-all">
          <div className="BTN  flex items-end justify-start">
            <div className={`flex bg-black justify-center items-center h-10 text-white rounded-2xl rounded-tl-none rounded-br-none transition-all duration-500 font-DancingScript ${isOpen ? 'w-30' : 'w-13'}`}>
              <span>{data.weight}</span> <span className='pl-1 font-kalameh'>g</span>
              {/* <button onClick={handleClick} className={`${isOpen ? 'hidden' : 'flex'} group h-full w-full justify-center items-center cursor-pointer`}>
                <PlusIcon size={20} strokeWidth={4} />
              </button>
              <button onClick={handleAddToCard} className={`${isOpen ? 'flex' : 'hidden'} group h-full w-full justify-center items-center border-r-2 border-white max-w-8 cursor-pointer`}>
                <Check size={20} strokeWidth={4} className='group-hover:text-orange-600' />
              </button>
              <input
                ref={inputRef}
                type="number"
                value={customWeight || ''}
                onChange={handleWeightChange}
                min="1"
                className={`outline-0 border-b-3 text-lg border-solid border-white w-full max-w-10 h-4 mx-2 transition-all duration-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isOpen ? 'block' : 'hidden'}`}
              />
              <span className={`text-xs h-full justify-center font-serif items-center text-center ${isOpen ? 'flex' : 'hidden'}`}>
                Kg
              </span> */}
            </div>
            <div className="w-3 h-3 bg-black rounded-tr-full">
              <div className="w-full h-full bg-gray-100 rounded-bl-full border-l-4 border-solid border-white"></div>
            </div>
          </div>

          <div className='w-full flex justify-end items-center '>
            <img src="./Toman.svg" alt="تومان" className='w-5 h-5' />
            <span className='text-black mx-1'>{data.realPrice ? data.realPrice.toLocaleString() : '000000000'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}