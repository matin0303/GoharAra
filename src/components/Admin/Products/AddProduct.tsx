'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProduct, useUpdateProduct } from '@/hook/useProduct';
import { AddProduct, Product, ProductType } from '@/types/api.types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FileUploader } from '../FileUploader/FileUploader';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Plus, ArrowRight, ArrowLeft, Check, ChevronDown, X } from 'lucide-react';


// Product type display names
const ProductTypeLabels: Record<ProductType, string> = {
  [ProductType.GOLD_18]: 'طلا ۱۸ عیار',
  [ProductType.SAHAT_BAHAR]: 'سکه بهار آزادی',
  [ProductType.SAHAT_EMAMI]: 'سکه امامی',
  [ProductType.NIM_SAHAT]: 'نیم سکه',
  [ProductType.ROB_SAHAT]: 'ربع سکه',
  [ProductType.SAHAT_SOT]: 'سکه سوت',
};

// Schema with conditional logic
const productSchema = z.discriminatedUnion('productType', [
  z.object({
    productType: z.literal(ProductType.GOLD_18),
    title: z.string().min(3, 'نام حداقل ۳ کاراکتر').max(255, 'نام حداکثر ۲۵۵ کاراکتر'),
    weight: z.number().positive('وزن باید مثبت باشد'),
    wages: z.number().min(0, 'اجرت نمی‌تواند منفی باشد'),
    profit: z.number().min(0, 'سود نمی‌تواند منفی باشد'),
    tax: z.number().min(0, 'مالیات نمی‌تواند منفی باشد'),
    gemPrice: z.number().min(0, 'قیمت افزوده نمی‌تواند منفی باشد'),
    gemActive: z.boolean(),
    description: z.string().optional(),
    images: z.array(z.string()).min(1, 'حداقل یک تصویر الزامی است').max(4, 'حداکثر ۴ تصویر مجاز است'),
  }),
  z.object({
    productType: z.literal(ProductType.SAHAT_SOT),
    title: z.string().min(3, 'نام حداقل ۳ کاراکتر').max(255, 'نام حداکثر ۲۵۵ کاراکتر'),
    weightSot: z.number().positive('وزن سوت باید مثبت باشد'),
    priceType: z.enum(['percent', 'toman']),
    priceValue: z.number().positive('مقدار باید مثبت باشد'),
    description: z.string().optional(),
    images: z.array(z.string()).min(1, 'حداقل یک تصویر الزامی است').max(4, 'حداکثر ۴ تصویر مجاز است'),
  }),
  z.object({
    productType: z.enum([ProductType.SAHAT_BAHAR, ProductType.SAHAT_EMAMI, ProductType.NIM_SAHAT, ProductType.ROB_SAHAT]),
    title: z.string().min(3, 'نام حداقل ۳ کاراکتر').max(255, 'نام حداکثر ۲۵۵ کاراکتر'),
    priceType: z.enum(['percent', 'toman']),
    priceValue: z.number().positive('مقدار باید مثبت باشد'),
    description: z.string().optional(),
    images: z.array(z.string()).min(1, 'حداقل یک تصویر الزامی است').max(4, 'حداکثر ۴ تصویر مجاز است'),
  }),
]);

type ProductFormData = z.infer<typeof productSchema>;

type ProductFormProps = {
  initialData?: AddProduct;
  isEditing?: boolean;
  setOpenEditeModal?: (e: boolean) => void
};

// Custom Select Component
interface SelectOption {
  value: ProductType;
  label: string;
  icon?: string;
}

const ProductTypeSelect = ({ 
  value, 
  onChange, 
  error 
}: { 
  value: ProductType; 
  onChange: (value: ProductType) => void;
  error?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const options: SelectOption[] = Object.values(ProductType).map(type => ({
    value: type,
    label: ProductTypeLabels[type],
    icon: type === ProductType.GOLD_18 ? '✨' :
          type === ProductType.SAHAT_BAHAR ? '🪙' :
          type === ProductType.SAHAT_EMAMI ? '🪙' :
          type === ProductType.NIM_SAHAT ? '🪙' :
          type === ProductType.ROB_SAHAT ? '🪙' :
          '🪙'
  }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div ref={selectRef} className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full border-2 rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 bg-white flex items-center justify-between ${
          error ? 'border-red-500' : isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-gray-200 hover:border-primary/50'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">{selectedOption?.icon}</span>
          <span className="font-medium">{selectedOption?.label}</span>
        </div>
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-2xl overflow-hidden"
          >
            {options.map((option) => (
              <motion.div
                key={option.value}
                whileHover={{ backgroundColor: '#F3F4F6' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-3 cursor-pointer flex items-center gap-2 transition-colors duration-200 ${
                  option.value === value ? 'bg-primary/10 text-primary' : 'text-gray-700'
                }`}
              >
                <span className="text-lg">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
                {option.value === value && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mr-auto"
                  >
                    <Check size={16} className="text-primary" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm mt-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export const ProductForm = ({ initialData, isEditing = false, setOpenEditeModal }: ProductFormProps) => {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();

  const getInitialProductType = (): ProductType => {
    if (initialData?.productType && Object.values(ProductType).includes(initialData.productType as ProductType)) {
      return initialData.productType as ProductType;
    }
    return ProductType.GOLD_18;
  };

  const getInitialPriceType = (): 'percent' | 'toman' => {
    if (initialData?.priceType && ['percent', 'toman'].includes(initialData.priceType)) {
      return initialData.priceType as 'percent' | 'toman';
    }
    return 'percent';
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productType: getInitialProductType(),
      title: initialData?.title || '',
      weight: initialData?.weight || 0,
      weightSot: initialData?.weightSot || 0,
      wages: initialData?.wages || 0,
      profit: initialData?.profit || 0,
      tax: initialData?.tax || 0,
      gemPrice: initialData?.gemPrice || 0,
      gemActive: initialData?.gemActive || false,
      priceType: getInitialPriceType(),
      priceValue: initialData?.priceValue || 0,
      description: initialData?.description || '',
      images: initialData?.images || [],
    } as any,
  });

  const images = watch('images');
  const title = watch('title');
  const productType = watch('productType');
  const priceType = watch('priceType');
  const gemActive = watch('gemActive');

  const handleImageUpload = (url: string, file: File) => {
    if (images.length < 4) {
      const newImages = [...images, url];
      setValue('images', newImages);

      if (isEditing && initialData?.id) {
        const formData = watch();
        updateProduct({
          id: initialData.id,
          data: { ...formData, images: newImages }
        });
      }
    }
  };

  const handleDeleteImage = (url: string) => {
    const newImages = images.filter(image => image !== url);
    setValue('images', newImages);

    if (isEditing && initialData?.id) {
      const formData = watch();
      updateProduct({
        id: initialData.id,
        data: { ...formData, images: newImages }
      });
    }
  };

  const handleNextStep = async () => {
    let isValid = false;
    if (productType === ProductType.GOLD_18) {
      isValid = await trigger(['title', 'weight', 'wages', 'profit', 'tax']);
    } else if (productType === ProductType.SAHAT_SOT) {
      isValid = await trigger(['title', 'weightSot', 'priceValue']);
    } else {
      isValid = await trigger(['title', 'priceValue']);
    }
    if (isValid) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  const onSubmit = (data: ProductFormData) => {
    // The data already has English productType values
    if (isEditing && initialData) {
      updateProduct({ id: initialData.id, data: data as any }, {
        onSuccess() {
          setOpenEditeModal?.(false)
        }
      });
    } else {
      createProduct(data as any);
      router.push('/admin/products')
    }
  };

  const isPending = isCreating || isUpdating;

  const steps = [
    { number: 1, title: 'اطلاعات پایه' },
    { number: 2, title: 'جزئیات تکمیلی' },
  ];

  const isGoldType = productType === ProductType.GOLD_18;
  const isCoinType = !isGoldType;
  const isSotType = productType === ProductType.SAHAT_SOT;

  return (
    <motion.form
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl bg-white p-8 rounded-2xl shadow-2xl border border-primary/10 relative overflow-hidden font-kalameh"
    >
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full -ml-12 -mb-12" />

      {/* Header with steps */}
      <div className="mb-8">
        <motion.h2
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-3xl font-bold mb-6 relative text-center"
        >
          <span className="bg-gradient-to-l from-primary to-primary/60 bg-clip-text text-transparent font-sarvenaz">
            {isEditing ? 'ویرایش محصول' : 'محصول جدید'}
          </span>
        </motion.h2>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, index) => (
            <div key={s.number} className="flex items-center">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2, type: "spring" }}
                className={`flex items-center gap-2 px-2 py-1 rounded-full ${
                  step >= s.number
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-400'
                } transition-all duration-300`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step > s.number
                    ? 'bg-white text-primary'
                    : step === s.number
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step > s.number ? <Check size={16} /> : s.number}
                </span>
                <span className="text-sm font-medium hidden sm:block">{s.title}</span>
              </motion.div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${
                  step > s.number ? 'bg-primary' : 'bg-gray-200'
                } transition-all duration-300`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Product Type & Base Info */}
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
          >
            {/* Product Type Select - Custom */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                نوع محصول <span className="text-primary">*</span>
              </label>
              <ProductTypeSelect
                value={productType}
                onChange={(value) => setValue('productType', value)}
                error={errors.productType?.message}
              />
            </div>

            {/* Title */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                نام محصول <span className="text-primary">*</span>
              </label>
              <input
                {...register('title')}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-primary/50"
                placeholder="نام محصول را وارد کنید..."
              />
              {errors.title && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <span>⚠</span> {errors.title.message}
                </motion.p>
              )}
            </div>

            {/* Conditional Fields based on product type */}
            {isGoldType ? (
              /* Gold 18 Fields */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      وزن (گرم) <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.001"
                      {...register('weight', { valueAsNumber: true })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-primary/50"
                      placeholder="۰.۰۰۰"
                    />
                    {(errors as any).weight && (
                      <p className="text-red-500 text-sm mt-1">{(errors as any).weight.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      اجرت (%) <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('wages', { valueAsNumber: true })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-primary/50"
                      placeholder="۰"
                    />
                    {(errors as any).wages && (
                      <p className="text-red-500 text-sm mt-1">{(errors as any).wages.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      سود (%) <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('profit', { valueAsNumber: true })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-primary/50"
                      placeholder="۰"
                    />
                    {(errors as any).profit && (
                      <p className="text-red-500 text-sm mt-1">{(errors as any).profit.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      مالیات (%) <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register('tax', { valueAsNumber: true })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-primary/50"
                      placeholder="۰"
                    />
                    {(errors as any).tax && (
                      <p className="text-red-500 text-sm mt-1">{(errors as any).tax.message}</p>
                    )}
                  </div>
                </div>

                {/* Gem Price with Toggle */}
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-semibold text-gray-700">
                      قیمت افزوده نگین و یاقوت
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{gemActive ? 'فعال' : 'غیرفعال'}</span>
                      <button
                        type="button"
                        onClick={() => setValue('gemActive', !gemActive)}
                        className={`w-12 h-6 rounded-full transition-all duration-300 ${
                          gemActive ? 'bg-primary' : 'bg-gray-300'
                        } relative`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 ${
                            gemActive ? 'left-6' : 'left-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                  {gemActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <div className="relative">
                        <input
                          type="number"
                          step="1000"
                          {...register('gemPrice', { valueAsNumber: true })}
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-primary/50"
                          placeholder="قیمت افزوده را وارد کنید..."
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium bg-gray-50 px-3 py-1 rounded-lg">
                          تومان
                        </span>
                      </div>
                      {(errors as any).gemPrice && (
                        <p className="text-red-500 text-sm mt-1">{(errors as any).gemPrice.message}</p>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            ) : (
              /* Coin Fields */
              <div className="space-y-4">
                {isSotType && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      وزن سوت <span className="text-primary">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('weightSot', { valueAsNumber: true })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-primary/50"
                      placeholder="وزن سوت را وارد کنید..."
                    />
                    {(errors as any).weightSot && (
                      <p className="text-red-500 text-sm mt-1">{(errors as any).weightSot.message}</p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                      قیمت افزوده<span className="text-primary">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register('priceType')}
                        value="percent"
                        className="w-4 h-4 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm">درصد</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        {...register('priceType')}
                        value="toman"
                        className="w-4 h-4 text-primary focus:ring-primary/20"
                      />
                      <span className="text-sm">تومان</span>
                    </label>
                  </div>
                </div>

                <div>
               
                  <div className="relative">
                    <input
                      type="number"
                      step={priceType === 'percent' ? '0.1' : '1000'}
                      {...register('priceValue', { valueAsNumber: true })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-20 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-primary/50"
                      placeholder={priceType === 'percent' ? '۰' : '۰'}
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium bg-gray-50 px-3 py-1 rounded-lg">
                      {priceType === 'percent' ? 'درصد' : 'تومان'}
                    </span>
                  </div>
                  {(errors as any).priceValue && (
                    <p className="text-red-500 text-sm mt-1">{(errors as any).priceValue.message}</p>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Description & Images (Unchanged) */}
        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
          >
            {/* Description */}
            <div className="mb-5">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                توضیحات
              </label>
              <textarea
                {...register('description')}
                rows={4}
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-primary/50 resize-none"
                placeholder="توضیحات محصول را وارد کنید..."
              />
            </div>

            {/* Images */}
            <div className="mb-6" dir='ltr'>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                تصاویر <span className="text-primary">*</span>
                <span className="text-xs text-gray-500 font-normal mr-2">
                  (حداقل ۱، حداکثر ۴)
                </span>
              </label>

              <div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300 hover:border-primary/50 transition-all duration-300">
                <FileUploader
                  folder="product"
                  onUploadSuccess={handleImageUpload}
                  onUploadError={(error) => toast.error(error)}
                  onDeleteImage={handleDeleteImage}
                  images={images}
                  maxFiles={4}
                />
              </div>

              {errors.images && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <span>⚠</span> {errors.images.message}
                </motion.p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.4 }}
        className="flex gap-3 pt-4 border-t border-gray-100"
      >
        {step === 1 ? (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleNextStep}
              className="flex-1 relative bg-gradient-to-r from-primary to-primary/80 text-white py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                مرحله بعد
                <ArrowLeft size={18} />
              </span>
            </motion.button>
          </>
        ) : (
          <>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handlePrevStep}
              className="px-6 bg-white text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-primary/50 hover:text-primary transition-all duration-300 flex items-center gap-2"
            >
              <ArrowRight size={18} />
              مرحله قبل
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isPending}
              className="flex-1 relative bg-gradient-to-r from-primary to-primary/80 text-white py-3 rounded-xl font-semibold hover:from-primary/90 hover:to-primary/70 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isPending ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      ⏳
                    </motion.span>
                    در حال ذخیره...
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <>
                        <Edit size={18} /> ویرایش
                      </>
                    ) : (
                      <>
                        <Plus size={18} /> ایجاد
                      </>
                    )}
                  </>
                )}
              </span>
            </motion.button>
          </>
        )}
      </motion.div>
    </motion.form>
  );
};