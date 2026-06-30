'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Diamond,
  Shield,
  Star,
  Users,
  Award,
  ChevronLeft,
  BadgeCheck,
  Heart,
  Clock,
  Phone,
  Mail,
  MapPin,
  Gem,
  Sparkles,
  Scale,
  Crown,
  Gift,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { useProducts } from '@/hook/useProduct'
import ProductCard from '@/components/ProductCard/ProductCard'
import { useProductsWithRealPrices } from '@/muckDatas/calcPrice'

const stats = [
  {
    icon: Users,
    label: 'مشتریان راضی',
    value: '۵,۰۰۰+',
    suffix: 'نفر',
    color: 'from-primary-400 to-primary-600'
  },
  {
    icon: Gem,
    label: 'انواع طلا و جواهر',
    value: '۲۰۰+',
    suffix: 'مدل',
    color: 'from-amber-400 to-amber-600'
  },
  {
    icon: Clock,
    label: 'سابقه فعالیت',
    value: '۱۲+',
    suffix: 'سال',
    color: 'from-yellow-400 to-yellow-600'
  },
  {
    icon: Shield,
    label: 'ضمانت اصالت',
    value: '۱۰۰%',
    suffix: 'تضمینی',
    color: 'from-primary-500 to-primary-700'
  },
]

const features = [
  {
    icon: Diamond,
    title: 'طلا و جواهرات اصیل',
    description: 'تمام محصولات ما دارای ضمانت‌نامه اصالت و عیار هستند و تحت نظارت اتحادیه طلا تولید می‌شوند.',
    color: 'bg-primary-50 text-primary-600'
  },
  {
    icon: Shield,
    title: 'ضمانت کیفیت و اصالت',
    description: 'ما کیفیت و اصالت طلا را تضمین می‌کنیم. تمامی محصولات دارای مهر تضمین و عیار سنجی شده‌اند.',
    color: 'bg-blue-50 text-blue-600'
  },
  {
    icon: Scale,
    title: 'توزین دقیق و شفاف',
    description: 'وزن دقیق هر محصول با ترازوهای دیجیتال استاندارد محاسبه و قیمت بر اساس وزن و عیار مشخص می‌شود.',
    color: 'bg-primary-50 text-primary-600'
  },
  {
    icon: Award,
    title: 'طراحی منحصر‌به‌فرد',
    description: 'مجموعه‌ای از طرح‌های خاص و منحصر‌به‌فرد که توسط هنرمندان برجسته طلا و جواهر طراحی شده‌اند.',
    color: 'bg-purple-50 text-purple-600'
  },
  {
    icon: Sparkles,
    title: 'بروزرسانی لحظه‌ای قیمت',
    description: 'قیمت‌ها بر اساس نرخ لحظه‌ای طلا در بازار جهانی به‌روزرسانی می‌شوند تا بهترین معامله را داشته باشید.',
    color: 'bg-teal-50 text-teal-600'
  },
  {
    icon: Heart,
    title: 'رضایت مشتری',
    description: 'رضایت شما اولویت ماست. تیم پشتیبانی ما همیشه آماده پاسخگویی به سوالات شماست.',
    color: 'bg-rose-50 text-rose-600'
  },
]

const teamMembers = [
  {
    name: 'فاطمه رضایی',
    role: 'طراح ارشد طلا و جواهر',
    image: '/team3.jpg',
    description: 'با ۱۰ سال تجربه در طراحی جواهرات'
  },
  {
    name: 'علی محمدی',
    role: 'مدیر عامل و بنیان‌گذار',
    image: '/team1.jpg',
    description: 'کارشناس ارشد صنعت طلا و جواهر'
  },
  {
    name: 'سارا کریمی',
    role: 'مدیر فروش و مشاوره',
    image: '/team2.jpg',
    description: 'مشاور تخصصی خرید طلا و جواهر'
  },
]

export default function AboutPage() {
  // const { data, isLoading, isError } = useProducts({ page: 1, limit: 5 });
  const dataWithPrice = useProductsWithRealPrices()

  return (
    <div className="min-h-screen bg-white font-kalameh">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br rounded-b-4xl from-purple-600 via-icon-primary to-purple-800 text-white overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-48 -mt-48" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/10 rounded-full -ml-36 -mb-36" />
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-white/5 rounded-full" />

        <div className="max-w-7xl mx-auto px-4 py-20 lg:py-32 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm mb-6"
              >
                <BadgeCheck size={16} />
                <span>مرجع تخصصی طلا و جواهرات اصیل</span>
              </motion.div>

              <h1 className="text-4xl lg:text-6xl font-black mb-6 font-sarvenaz leading-tight">
                زیبایی اصیل
                <span className="block text-white">طلا و جواهرات</span>
                را با ما تجربه کنید
              </h1>

              <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
                ما با سال‌ها تجربه در صنعت طلا و جواهر، بهترین و باکیفیت‌ترین محصولات را
                با تضمین اصالت و عیار به شما ارائه می‌دهیم. هر قطعه طلا، داستانی از هنر و اصالت است.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link href={'/products'}>
                  <motion.span
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20  text-primary-600 cursor-pointer px-8 py-4 rounded-xl font-bold text-lg  transition-all duration-300 shadow-xl flex items-center gap-2"
                  >
                    مشاهده محصولات
                    <ChevronLeft size={20} />
                  </motion.span>
                </Link>

                <Link href="tel:09010791929">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/20 backdrop-blur-sm cursor-pointer text-white px-8 py-4 rounded-xl font-bold text-lg border-2 border-white/30  transition-all duration-300"
                  >
                    مشاوره رایگان
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src="/landpic4.jpg"
                  alt="طلا و جواهرات"
                  fill
                  className="object-cover rounded-3xl shadow-2xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/20 to-transparent rounded-3xl" />
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Diamond size={24} className="text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">ضمانت اصالت</p>
                  <p className="text-xs text-gray-500">گواهی عیار</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Zap size={24} className="text-amber-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">قیمت لحظه‌ای</p>
                  <p className="text-xs text-gray-500">بروزرسانی آنلاین</p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Stats Section */}
      <section className="relative -mt-10 z-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:border-primary transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br  rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon size={24} className="text-primary" />
                </div>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-black text-gray-800">{stat.value}</span>
                  <span className="text-sm text-gray-500">{stat.suffix}</span>
                </div>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-gray-800 mb-4 font-sarvenaz">
              چرا
              <span className="text-primary">   ما را انتخاب کنید</span>
              ؟
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              ما به کیفیت و اصالت محصولاتمان افتخار می‌کنیم و همیشه در تلاشیم تا بهترین تجربه را برای شما رقم بزنیم
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-black text-gray-800 mb-4 font-sarvenaz">
              محصولات
              <span className="text-primary"> محبوب</span>
            </h2>
            <p className="text-gray-600">
              برخی از بهترین محصولات ما که بیشترین طرفدار را دارند
            </p>
          </motion.div>

          <div dir='ltr' className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
            {dataWithPrice.products.slice(0, 5 ).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <ProductCard data={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}