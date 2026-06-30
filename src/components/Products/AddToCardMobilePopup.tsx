import { useState, useEffect } from 'react';
import { ShoppingCart, ShoppingBasket } from 'lucide-react';
import { IoCashOutline, IoScaleOutline } from 'react-icons/io5';
import { Plus } from 'lucide-react';
import { Product } from '@/types/api.types';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/redux/slices/shoppingCardSlice';


interface AddToCardSidebarProps {
	data?: {
		data: Product;
	};
}

export default function AddToCardMobilePopup({ data }: AddToCardSidebarProps) {
	const dispatch = useDispatch();
	const [selectedWeight, setSelectedWeight] = useState<number>(1000);
	const [customWeight, setCustomWeight] = useState<number>(0);
	const [isCustomWeight, setIsCustomWeight] = useState<boolean>(false);
	const [totalPrice, setTotalPrice] = useState<number>(0);

	const weights = [500, 1000, 5000];

	useEffect(() => {
		if (data?.data.price) {
			let selectedWeightInKg: number;

			if (isCustomWeight) {
				selectedWeightInKg = customWeight;
			} else {
				selectedWeightInKg = selectedWeight / 1000;
			}

			const calculatedPrice = data.data.price * selectedWeightInKg;
			setTotalPrice(calculatedPrice);
		}
	}, [selectedWeight, customWeight, isCustomWeight, data?.data.price]);

	const handleWeightChange = (weight: number) => {
		if (!isCustomWeight) {
			setSelectedWeight(weight);
		}
	};

	const handleCustomWeightToggle = () => {
		setIsCustomWeight(!isCustomWeight);
		if (!isCustomWeight) {
			setSelectedWeight(1);
		} else {
			setSelectedWeight(1000);
			setCustomWeight(1);
		}
	};

	const handleCustomWeightInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseFloat(e.target.value) || 0;
		if (value < 1) {
			setCustomWeight(1);
		} else {
			setCustomWeight(value);
		}
	};


	// const handleAddToCart = () => {
	// 	if (!data) return
	// 	let finalWeight: number;
	// 	if (isCustomWeight) {
	// 		finalWeight = customWeight;
	// 	} else {
	// 		finalWeight = selectedWeight / 1000;
	// 	}

	// 	const newCartItem = {
	// 		id: data?.data.id,
	// 		weight: finalWeight
	// 	};

	// 	const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
	// 	const existingItemIndex = cartItems.findIndex((item: any) => item.id === data?.data.id);
	// 	if (existingItemIndex !== -1) {
	// 		if(cartItems[existingItemIndex].weight === finalWeight){
	// 			toast.success('این محصول در سبد شما وجود دارد.')
	// 			return
	// 		}
	// 		cartItems[existingItemIndex] = newCartItem;
	// 	} else {
	// 		cartItems.push(newCartItem);
	// 	}
	// 	localStorage.setItem('cart', JSON.stringify(cartItems));
	// 	toast.success('محصول با موفقیت به سبد خرید اضافه شد.')
	// };
	const handleAddToCart = () => {
		if (!data) return;
		
		let finalWeight: number;
		if (isCustomWeight) {
			finalWeight = customWeight;
		} else {
			finalWeight = selectedWeight / 1000;
		}
	
		const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
		const existingItem = cartItems.find((item: any) => item.id === data.data.id);
		
		if (existingItem && existingItem.weight === finalWeight) {
			toast.error('این محصول با همین وزن در سبد شما وجود دارد.');
			return;
		}
	
		dispatch(addToCart({ 
			id: data.data.id, 
			weight: Math.abs(finalWeight)
		}));
		
		toast.success('محصول به سبد خرید اضافه شد.');
	};
	useEffect(() => {
		if (data?.data.price) {
			setTotalPrice(data.data.price);
		}
	}, [data?.data.price]);

	return (
		<>
			<div className='flex'>
				<ShoppingCart />
				<h3 className='text-xl text-start pr-2 text-black'>
					افزودن <span className='text-orange-600'>{data?.data.title}</span> به سبد خرید
				</h3>
			</div>

			<div className='flex justify-between items-center mt-7 border-b border-dashed border-gray-400 pb-2'>
				<div className='flex justify-center items-center'>
					<IoCashOutline size={20} />
					<h4 className='text-xl text-start pr-2 text-black'>قیمت محصول :</h4>
				</div>
				<div className='flex justify-center items-center'>
					<span className='text-3xl text-orange-600'>
						{(data?.data.price)?.toLocaleString()}
					</span>
					<img src="/Toman.svg" alt="تومان" className='w-6 h-6' />
				</div>
			</div>

			<div className='w-full mt-2 text-lg border-b border-dashed border-gray-400 py-4'>
				<div className='flex justify-start items-center mb-1'>
					<IoScaleOutline />
					<span className='pr-2'>وزن مورد نظر خود را انتخاب کنید : </span>
				</div>
				<div className='w-full flex justify-between items-center'>
					{weights.map((weight) => (
						<div key={weight} className='flex justify-center items-center'>
							<input
								type="radio"
								id={`w${weight}`}
								name="weight"
								checked={!isCustomWeight && selectedWeight === weight}
								onChange={() => handleWeightChange(weight)}
								disabled={isCustomWeight}
								className='cursor-pointer'
							/>
							<label
								htmlFor={`w${weight}`}
								className={`pr-1 cursor-pointer ${isCustomWeight ? 'opacity-50' : ''}`}
							>
								<span className='text-xl'>{weight.toLocaleString()}</span> گرم
							</label>
						</div>
					))}
				</div>
			</div>

			<div className='w-full mt-3 border-b-1 border-dashed border-gray-400 pb-7'>
				<div className='flex justify-start items-center'>
					<input
						type="checkbox"
						id='checkInput'
						checked={isCustomWeight}
						onChange={handleCustomWeightToggle}
					/>
					<label htmlFor="checkInput" className='pr-1 text-xl ml-2 shrink-0'>
						وزن دلخواه :
					</label>
				</div>
				<div className={`border-2 rounded-sm py-2 border-black flex justify-center items-center w-full ${!isCustomWeight ? 'opacity-50' : ''}`}>
					<input
						type="number"
						id='wInput'
						className='w-full outline-0 text-xl text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
						placeholder='اینجا وارد کنید'
						value={isCustomWeight ? customWeight || '' : ''}
						onChange={handleCustomWeightInput}
						disabled={!isCustomWeight}
						min="1"
					/>
					<label htmlFor="wInput" className='px-4 text-lg shrink-0 border-r-1 border-black'>
						کیلوگرم
					</label>
				</div>
			</div>

			<div className='mt-5 w-full flex flex-col justify-between items-center'>
				<div className='flex w-full justify-between items-center'>
					<div className='flex justify-start items-center mb-1'>
						<Plus size={18} />
						<span className='pr-2'>مجموع مبلغ سفارش شما:</span>
					</div>
					<div className='flex justify-center items-center'>
						<span className='text-2xl'>
							{totalPrice.toLocaleString()}
						</span>
						<img src="/Toman.svg" alt="تومان" className='w-6 h-6' />
					</div>
				</div>

				<div className='w-full h-12 rounded-sm flex justify-center items-center bg-orange-600 mt-14'>
					<button onClick={handleAddToCart} className='w-full h-full text-white font-[paeez] text-3xl cursor-pointer shadow-md flex flex-row-reverse justify-center items-center'>
						افزودن به سبدخرید
						<ShoppingBasket className='mr-1' />
					</button>
				</div>
			</div>
		</>
	);
};
