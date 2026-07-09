'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { TipTapEditor } from '@/components/Admin/Article/CreateArticle/Editor/TipTapEditor'
import toast from 'react-hot-toast'
import { useCreateArticle, useUpdateArticle } from '@/hook/useArticle';
import { Article, SLUG_REGEX } from '@/types/api.types';
import { Loader2, Info, Upload, FileText, Tag, Globe, Image as ImageIcon, ArrowRight, ArrowLeft, Plus, Edit, Check, Type, AlignLeft, Text } from 'lucide-react';
import DOMPurify from 'dompurify';
import { FileUploader } from '../Admin/FileUploader/FileUploader'
import { motion, AnimatePresence } from 'framer-motion';

const articleSchema = z.object({
	title: z.string()
		.min(3, 'عنوان حداقل ۳ کاراکتر')
		.max(255, 'عنوان حداکثر ۲۵۵ کاراکتر'),
	slug: z.string()
		.min(3, 'slug حداقل ۳ کاراکتر')
		.regex(SLUG_REGEX, 'slug فقط می‌تواند شامل حروف کوچک، اعداد و خط تیره باشد'),
	description: z.string()
		.max(500, 'توضیحات حداکثر ۵۰۰ کاراکتر')
		.optional()
		.or(z.literal('')),
	content: z.string()
		.min(1, 'محتوا نمی‌تواند خالی باشد')
		.refine((val) => {
			const stripped = val.replace(/<[^>]*>/g, '').trim();
			return stripped.length >= 10;
		}, 'محتوا حداقل ۱۰ کاراکتر (بدون تگ‌های HTML)'),
	is_published: z.boolean(),
	hashtags: z.string(),
	image: z.string()
});

type ArticleFormData = z.infer<typeof articleSchema>;

type ArticleFormProps = {
	initialData?: Article;
	isEditing?: boolean;
	setOpenEditModal?: (e: boolean) => void;
};

export default function ArticleForm({ initialData, isEditing = false, setOpenEditModal }: ArticleFormProps) {
	const router = useRouter();
	const [step, setStep] = useState(2);

	const parseHashtags = (hashtags: string[] | undefined) => {
		if (Array.isArray(hashtags)) {
			return hashtags.join(', ');
		}
		if (typeof hashtags === 'string') {
			try {
				const parsed = JSON.parse(hashtags);
				return Array.isArray(parsed) ? parsed.join(', ') : hashtags;
			} catch {
				return hashtags;
			}
		}
		return '';
	};

	const [hashtagsInput, setHashtagsInput] = useState(
		parseHashtags(initialData?.hashtags)
	);
	const [content, setContent] = useState(initialData?.content || '');

	const { mutate: createArticle, isPending: isCreating } = useCreateArticle();
	const { mutate: updateArticle, isPending: isUpdating } = useUpdateArticle();

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		setValue,
		trigger,
	} = useForm<ArticleFormData>({
		resolver: zodResolver(articleSchema),
		defaultValues: {
			title: initialData?.title || '',
			slug: initialData?.slug || '',
			description: initialData?.description || '',
			content: initialData?.content || '',
			is_published: initialData?.is_published || false,
			hashtags: parseHashtags(initialData?.hashtags) || '',
			image: initialData?.image || undefined
		},
	});

	const isPending = isCreating || isUpdating;
	const image = watch('image');
	const title = watch('title');
	const slug = watch('slug');
	const description = watch('description');

	const handleImageUpload = (url: string, file: File) => {
		const newImages = url;
		setValue('image', newImages, { shouldValidate: true });

		if (isEditing && initialData?.id) {
			const formData = watch();

			const articleData = {
				title: formData.title,
				slug: formData.slug,
				description: formData.description || '',
				content: formData.content,
				is_published: formData.is_published,
				hashtags: hashtagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag),
				image: formData.image
			};
			updateArticle({
				id: initialData.id,
				data: { ...articleData, image: newImages }
			});
		}
	};

	const handleDeleteImage = (url: string) => {
		const newImages = '';
		setValue('image', newImages, { shouldValidate: true });

		if (isEditing && initialData?.id) {
			const formData = watch();
			const articleData = {
				title: formData.title,
				slug: formData.slug,
				description: formData.description || '',
				content: formData.content,
				is_published: formData.is_published,
				hashtags: hashtagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag),
				image: undefined
			};
			updateArticle({
				id: initialData.id,
				data: { ...articleData, image: undefined }
			});
		}
	};

	const handleNextStep = async () => {
		if (step === 1) {
			const isValid = await trigger(['title', 'slug']);
			if (isValid) setStep(2);
		} else if (step === 2) {
			setValue('content', content, { shouldValidate: true });

			await new Promise(resolve => setTimeout(resolve, 100));

			const isValid = await trigger(['content']);
			if (isValid) {
				setStep(3);
			} else {
				console.log('Validation errors:', errors);
			}
		}
	};

	const handlePrevStep = () => {
		if (step === 2) setStep(1);
		if (step === 3) setStep(2);
	};

	const onSubmit = (data: ArticleFormData) => {
		const finalHtml = data.content
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&amp;/g, '&')
		.replace(/&quot;/g, '"')

		const articleData = {
			title: data.title,
			slug: data.slug,
			description: data.description || '',
			content: finalHtml,
			is_published: data.is_published,
			hashtags: hashtagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag),
			image: data.image
		};
		if (isEditing && initialData) {
			updateArticle({ id: initialData.id, data: articleData }, {
				onSuccess: () => {
					setOpenEditModal?.(false)
					router.push('/admin/articles')
				},
			});
		} else {
			createArticle(articleData, {
				onSuccess: () => router.push('/admin/articles'),
			});
		}
	};

	const generateSlug = () => {
		const title = (document.getElementById('title') as HTMLInputElement)?.value;
		if (title) {
			const slug = title
				.toLowerCase()
				.replace(/[^a-z0-9]+/g, '-')
				.replace(/^-+|-+$/g, '');
			setValue('slug', slug);
		}
	};

	// Step indicators
	const steps = [
		{ number: 1, title: 'اطلاعات اولیه', icon: Type },
		{ number: 2, title: 'متن مقاله', icon: AlignLeft },
		{ number: 3, title: 'تصویر و انتشار', icon: ImageIcon },
	];

	return (
		<motion.form
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			onSubmit={handleSubmit(onSubmit)}
			className="w-3xl max-lg:max-w-3xl max-lg:w-full mx-auto bg-white rounded-2xl shadow-2xl p-8 border border-orange-100 relative overflow-hidden font-kalameh"
		>
			{/* Decorative background */}
			<div className="absolute top-0 right-0 w-40 h-40 bg-orange-600/5 rounded-bl-full -mr-20 -mt-20" />
			<div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-600/5 rounded-tr-full -ml-16 -mb-16" />

			{/* Header with steps */}
			<div className="mb-8">
				<motion.h2
					initial={{ x: -20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.4 }}
					className="text-3xl font-bold mb-6 relative text-center"
				>
					<span className="bg-gradient-to-l from-orange-600 to-orange-400 bg-clip-text text-transparent font-sarvenaz">
						{isEditing ? 'ویرایش مقاله' : 'ایجاد مقاله جدید'}
					</span>
				</motion.h2>

				{/* Step Indicators */}
				<div className="flex items-center justify-center gap-2 mb-8">
					{steps.map((s, index) => (
						<div key={s.number} className="flex items-center">
							<motion.div
								initial={{ scale: 0.5 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.5, type: "spring" }}
								className={`flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer transition-all duration-300 ${step >= s.number
										? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
										: 'bg-gray-100 text-gray-400'
									}`}
								onClick={() => {
									if (s.number < step) setStep(s.number);
								}}
							>
								<span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${step > s.number
										? 'bg-white text-orange-600'
										: step === s.number
											? 'bg-white/20 text-white'
											: 'bg-gray-200 text-gray-500'
									}`}>
									{step > s.number ? <Check size={16} /> : <s.icon size={16} />}
								</span>
								<span className="text-sm font-medium hidden sm:block">{s.title}</span>
							</motion.div>
							{index < steps.length - 1 && (
								<div className={`w-8 h-0.5 mx-1 transition-all duration-300 ${step > s.number ? 'bg-orange-600' : 'bg-gray-200'
									}`} />
							)}
						</div>
					))}
				</div>
			</div>

			<AnimatePresence mode="wait">
				{/* Step 1: Basic Info (Title, Slug, Description, Hashtags) */}
				{step === 1 && (
					<motion.div
						key="step1"
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 50 }}
						transition={{ duration: 0.4 }}
					>
						{/* Title & Slug Row */}
						<div className="flex flex-col sm:flex-row gap-4 mb-5">
							{/* Title */}
							<div className="flex-1">
								<label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
									<FileText size={18} className="text-orange-600" />
									عنوان مقاله <span className="text-orange-600">*</span>
								</label>
								<input
									id="title"
									{...register('title')}
									onBlur={generateSlug}
									className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 outline-none hover:border-orange-300"
									placeholder="مثال: چگونه مقاله بنویسیم؟"
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

							{/* Slug */}
							<div className="w-full sm:w-64">
								<label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
									<Globe size={18} className="text-orange-600" />
									slug <span className="text-orange-600">*</span>
								</label>
								<div className="relative">
									<input
										{...register('slug')}
										className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pl-10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 outline-none hover:border-orange-300 font-mono text-sm text-right"
										placeholder="نوشتن-مقاله"
										dir="ltr"
									/>
									<motion.button
										whileHover={{ scale: 1.1 }}
										whileTap={{ scale: 0.9 }}
										type="button"
										onClick={generateSlug}
										className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
										title="ساخت خودکار از عنوان"
									>
										<Info size={18} />
									</motion.button>
								</div>
								{errors.slug && (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-red-500 text-sm mt-2 flex items-center gap-1"
									>
										<span>⚠</span> {errors.slug.message}
									</motion.p>
								)}
							</div>
						</div>

						{/* Description */}
						<div className="mb-5">
							<label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
								<Text size={18} className="text-orange-600" />
								توضیحات کوتاه (اختیاری)
							</label>
							<textarea
								{...register('description')}
								rows={3}
								className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 outline-none hover:border-orange-300 resize-none"
								placeholder="خلاصه‌ای کوتاه از مقاله خود بنویسید..."
							/>
							<div className="flex justify-between items-center mt-1">
								{errors.description ? (
									<motion.p
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										className="text-red-500 text-sm flex items-center gap-1"
									>
										<span>⚠</span> {errors.description.message}
									</motion.p>
								) : (
									<p className="text-xs text-gray-400 flex items-center gap-1">
										<Info size={12} />
										حداکثر ۵۰۰ کاراکتر
									</p>
								)}
								<span className="text-xs text-gray-400">
									{description?.length || 0}/500
								</span>
							</div>
						</div>

						{/* Hashtags */}
						<div className="mb-5">
							<label className="flex items-center gap-2 text-sm font-semibold mb-2 text-gray-700">
								<Tag size={18} className="text-orange-600" />
								هشتگ‌ها (اختیاری)
							</label>
							<input
								value={hashtagsInput}
								onChange={(e) => setHashtagsInput(e.target.value)}
								className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 outline-none hover:border-orange-300"
								placeholder="مثال: مقاله نویسی , نوشتن,  مقاله (با کاما جدا کنید)"
							/>
							<p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
								<Info size={12} />
								هشتگ‌ها را با کاما (,) از هم جدا کنید
							</p>
						</div>

						{/* Preview Card */}
						{(title || slug || description) && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-gray-50 rounded-xl p-4 border border-gray-200"
							>
								<p className="text-xs text-gray-500 mb-2">پیش‌نمایش</p>
								<div className="space-y-2">
									{title && (
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600">عنوان:</span>
											<span className="font-semibold text-gray-800">{title}</span>
										</div>
									)}
									{slug && (
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600">slug:</span>
											<span className="font-semibold text-gray-800 font-mono text-sm" dir="ltr">{slug}</span>
										</div>
									)}
									{description && (
										<div className="flex justify-between items-start">
											<span className="text-sm text-gray-600">توضیحات:</span>
											<span className="font-medium text-gray-700 text-sm text-left flex-1 mr-4">{description}</span>
										</div>
									)}
								</div>
							</motion.div>
						)}
					</motion.div>
				)}

				{/* Step 2: Content */}
				{step === 2 && (
					<motion.div
						key="step2"
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -50 }}
						transition={{ duration: 0.4 }}
					>
						<div className="mb-5">
							<label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
								<AlignLeft size={18} className="text-orange-600" />
								متن مقاله <span className="text-orange-600">*</span>
							</label>
							<div className="border-2 border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-500 transition-all duration-300 min-h-[400px]">
								<TipTapEditor
									content={content}
									onChange={(newContent) => {
										setContent(newContent);
										setValue('content', newContent, { shouldValidate: false });
									}}
								/>
							</div>
							{errors.content && (
								<motion.p
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									className="text-red-500 text-sm mt-2 flex items-center gap-1"
								>
									<span>⚠</span> {errors.content.message}
								</motion.p>
							)}
							<div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
								<Info size={12} />
								<span>حداقل ۱۰ کاراکتر برای متن مقاله الزامی است</span>
							</div>
						</div>
					</motion.div>
				)}

				{/* Step 3: Image & Publish */}
				{step === 3 && (
					<motion.div
						key="step3"
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -50 }}
						transition={{ duration: 0.4 }}
					>
						{/* Thumbnail */}
						<div className="mb-6">
							<label className="flex items-center gap-2 text-sm font-semibold mb-3 text-gray-700">
								<ImageIcon size={18} className="text-orange-600" />
								تصویر بندانگشتی مقاله
							</label>
							<div className="bg-gray-50 rounded-xl p-4 border-2 border-dashed border-gray-300 hover:border-orange-400 transition-all duration-300">
								<FileUploader
									folder="article"
									onUploadSuccess={handleImageUpload}
									onUploadError={(error) => toast.error(error)}
									onDeleteImage={handleDeleteImage}
									images={image ? Array(image) : []}
								/>
							</div>
						</div>

						{/* Publish Status */}
						<div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
							<label className="flex items-center gap-3 cursor-pointer">
								<div className="relative">
									<input
										type="checkbox"
										{...register('is_published')}
										className="sr-only peer"
									/>
									<div className="w-10 h-6 bg-gray-300 rounded-full peer-checked:bg-orange-600 transition-all duration-300 peer-focus:ring-2 peer-focus:ring-orange-500/20"></div>
									<div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 peer-checked:translate-x-4"></div>
								</div>
								<div>
									<span className="text-sm font-semibold text-gray-700">انتشار فوری مقاله</span>
									<p className="text-xs text-gray-500 mt-0.5">
										اگر این گزینه را انتخاب نکنید، مقاله به صورت پیش‌نویس ذخیره می‌شود
									</p>
								</div>
							</label>
						</div>

						{/* Summary Card */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="bg-gradient-to-r from-orange-50 to-white rounded-xl p-4 border border-orange-200"
						>
							<p className="text-sm font-semibold text-orange-600 mb-2">خلاصه مقاله</p>
							<div className="space-y-2 text-sm">
								{title && (
									<div className="flex justify-between">
										<span className="text-gray-600">عنوان:</span>
										<span className="font-medium">{title}</span>
									</div>
								)}
								{description && (
									<div className="flex justify-between">
										<span className="text-gray-600">توضیحات:</span>
										<span className="font-medium truncate max-w-[200px]">{description}</span>
									</div>
								)}
								{content && (
									<div className="flex justify-between">
										<span className="text-gray-600">متن:</span>
										<span className="font-medium truncate max-w-[200px]">
											{content.replace(/<[^>]*>/g, '').substring(0, 50)}...
										</span>
									</div>
								)}
								{image && (
									<div className="flex justify-between">
										<span className="text-gray-600">تصویر:</span>
										<span className="font-medium text-green-600">آپلود شده ✓</span>
									</div>
								)}
							</div>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Navigation Buttons */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.9, duration: 0.4 }}
				className="flex gap-3 pt-6 border-t border-gray-100 mt-6"
			>
				{step > 1 && (
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="button"
						onClick={handlePrevStep}
						className="px-6 bg-white text-gray-700 py-3 rounded-xl font-semibold border-2 border-gray-200 hover:border-orange-300 hover:text-orange-600 transition-all duration-300 flex items-center gap-2"
					>
						<ArrowRight size={18} />
						مرحله قبل
					</motion.button>
				)}

				{step < 3 ? (
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="button"
						onClick={handleNextStep}
						className="flex-1 relative bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30 overflow-hidden"
					>
						<span className="relative z-10 flex items-center justify-center gap-2">
							مرحله بعد
							<ArrowLeft size={18} />
						</span>
					</motion.button>
				) : (
					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						type="submit"
						disabled={isPending}
						className="flex-1 relative bg-gradient-to-r from-orange-600 to-orange-500 text-white py-3 rounded-xl font-semibold hover:from-orange-700 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-orange-600/20 hover:shadow-xl hover:shadow-orange-600/30 overflow-hidden"
					>
						<span className="relative z-10 flex items-center justify-center gap-2">
							{isPending ? (
								<>
									<Loader2 size={20} className="animate-spin" />
									{isEditing ? 'در حال ویرایش...' : 'در حال ایجاد...'}
								</>
							) : (
								<>
									{isEditing ? (
										<><Edit size={18} /> ویرایش مقاله</>
									) : (
										<><Plus size={18} /> ایجاد مقاله</>
									)}
								</>
							)}
						</span>
					</motion.button>
				)}
			</motion.div>
		</motion.form>
	);
};