'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Clock, 
  ShoppingBag, 
  Receipt, 
  Package,
  ChevronDown,
  ChevronUp,
  BadgeCheck,
  AlertCircle,
  ExternalLink,
  Hash
} from 'lucide-react'
import { AdminOrder, Product, ProfileResponse } from '@/types/api.types'

type OrderItem = {
  order_item_id: number
  quantity: number
  unit_price: number
  total_price: number
  product: Product
}

type OrderReceiptProps = {
  order: AdminOrder
  user: ProfileResponse
  items: OrderItem[]
  onMarkAsSeen?: (orderId: number) => void
  isSeenLoading?: boolean
}

export default function OrderReceipt({ 
  order, 
  user, 
  items, 
  onMarkAsSeen,
  isSeenLoading = false 
}: OrderReceiptProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(price))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden font-kalameh"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-tr-full -ml-12 -mb-12" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <Receipt size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-sarvenaz">
                رسید سفارش #{order.id}
              </h2>
              <p className="text-white/80 text-sm mt-0.5">
                {formatDate(order.created_at)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
           
            {/* Seen/Unseen Badge */}
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 backdrop-blur-sm ${
                order.seen 
                  ? 'bg-white/20 border border-white/30' 
                  : 'bg-orange-700/50 border border-orange-400'
              }`}
            >
              {order.seen ? (
                <>
                  <Eye size={16} />
                  دیده شده
                </>
              ) : (
                <>
                  <EyeOff size={16} />
                  جدید
                </>
              )}
            </motion.span>
            
            {/* Mark as Seen Button */}
            {!order.seen && onMarkAsSeen && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onMarkAsSeen(order.id)}
                disabled={isSeenLoading}
                className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-bold hover:bg-orange-50 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 shadow-lg"
              >
                {isSeenLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block"
                  >
                    ⏳
                  </motion.span>
                ) : (
                  <CheckCircle size={16} />
                )}
                تأیید مشاهده
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Status & Amount Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Amount */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="md:col-span-2 p-5 rounded-xl bg-gradient-to-br from-orange-50 to-white border-2 border-orange-200 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingBag size={20} className="text-orange-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">مبلغ کل سفارش</p>
                <p className="font-black text-2xl text-orange-600">
                  {formatPrice(order.total_amount)}
                  <span className="text-sm font-normal mr-2 text-gray-600">تومان</span>
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-500">تعداد اقلام</p>
              <p className="font-bold text-lg text-gray-700">{items.length} محصول</p>
            </div>
          </motion.div>

          {/* Order ID & Date */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-xl bg-gray-50 border-2 border-gray-200 space-y-3"
          >
            <div className="flex items-center gap-2">
              <Hash size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">شماره سفارش</p>
                <p className="font-bold text-sm">#{order.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">آخرین بروزرسانی</p>
                <p className="font-bold text-sm">{formatDate(order.updated_at)}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Customer Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-50 rounded-xl p-5 border border-gray-200 mb-4"
        >
          <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <User size={16} className="text-orange-600" />
            </div>
            اطلاعات مشتری
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">نام و نام خانوادگی</p>
                <p className="font-bold text-sm truncate">
                  {user.first_name} {user.last_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">شماره تماس</p>
                <p className="font-bold text-sm truncate" dir="ltr">
                  {user.phone}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">ایمیل</p>
                <p className="font-bold text-sm truncate" dir="ltr">
                  {user.email || '---'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-100">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Calendar size={14} className="text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 truncate">تاریخ ثبت سفارش</p>
                <p className="font-bold text-sm truncate">
                  {new Date(order.created_at).toLocaleDateString('fa-IR')}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full p-5 flex items-center justify-between hover:bg-gray-100 transition-colors"
          >
            <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <Package size={16} className="text-orange-600" />
              </div>
              اقلام سفارش
              <span className="text-xs font-normal text-gray-500 mr-2">
                ({items.length} محصول)
              </span>
            </h3>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-gray-200"
            >
              <ChevronDown size={16} className="text-gray-500" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5">
                  {/* Table Header - Desktop */}
                  <div className="hidden md:grid grid-cols-12 gap-3 text-xs font-bold text-gray-500 uppercase bg-gray-100 p-3 rounded-lg mb-2">
                    <div className="col-span-1 text-center">#</div>
                    <div className="col-span-4">نام محصول</div>
                    <div className="col-span-2 text-center">مقدار</div>
                    <div className="col-span-2 text-center">قیمت واحد</div>
                    <div className="col-span-2 text-center">قیمت کل</div>
                    <div className="col-span-1 text-center">لینک</div>
                  </div>

                  {/* Table Body */}
                  <div className="space-y-2">
                    {items.map((item, index) => (
                      <motion.div
                        key={item.order_item_id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white rounded-xl p-4 border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all duration-300"
                      >
                        {/* Mobile View */}
                        <div className="md:hidden space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                                {index + 1}
                              </span>
                              <Link 
                                href={`/products/${item.product.id}`}
                                className="font-bold text-gray-800 hover:text-orange-600 transition-colors flex items-center gap-1"
                              >
                                {item.product.title}
                                <ExternalLink size={14} className="text-orange-400" />
                              </Link>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <p className="text-xs text-gray-500">مقدار</p>
                              <p className="font-bold">{item.quantity.toLocaleString('fa-IR')} کیلو</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">قیمت واحد</p>
                              <p className="font-bold">{formatPrice(item.unit_price)} ت</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">قیمت کل</p>
                              <p className="font-bold text-orange-600">{formatPrice(item.total_price)} ت</p>
                            </div>
                          </div>
                        </div>

                        {/* Desktop View */}
                        <div className="hidden md:grid grid-cols-12 gap-3 items-center text-sm">
                          <div className="col-span-1 text-center">
                            <span className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full inline-flex items-center justify-center text-xs font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div className="col-span-4 font-bold text-gray-800">
                            {item.product.title}
                          </div>
                          <div className="col-span-2 text-center">
                            <span className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                              {item.quantity.toLocaleString('fa-IR')} کیلو
                            </span>
                          </div>
                          <div className="col-span-2 text-center text-gray-600 font-medium">
                            {formatPrice(item.unit_price)} 
                            <span className="text-xs mr-1">ت</span>
                          </div>
                          <div className="col-span-2 text-center font-bold text-orange-600">
                            {formatPrice(item.total_price)}
                            <span className="text-xs mr-1">ت</span>
                          </div>
                          <div className="col-span-1 text-center">
                            <Link 
                              href={`/products/${item.product.id}`}
                              className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-orange-100 hover:text-orange-600 rounded-lg transition-all"
                              title={`مشاهده ${item.product.title}`}
                            >
                              <ExternalLink size={14} />
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Total & Summary */}
                  <div className="mt-4 p-4 bg-white rounded-xl border-2 border-orange-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <p className="text-xs text-gray-500">جمع کل سفارش</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {items.length} محصول | {items.reduce((sum, item) => sum + item.quantity, 0).toLocaleString('fa-IR')} کیلوگرم
                        </p>
                      </div>
                      <div className="text-left">
                        <p className="text-2xl font-black text-orange-600">
                          {formatPrice(order.total_amount)}
                        </p>
                        <p className="text-xs text-gray-500">تومان</p>
                      </div>
                    </div>
                  </div>

                  {/* Description for each product */}
                  <div className="mt-4 space-y-2">
                    {items.map((item) => (
                      <div 
                        key={`desc-${item.order_item_id}`}
                        className="flex items-start gap-2 text-xs text-gray-500 bg-white p-3 rounded-lg border border-gray-100"
                      >
                        <BadgeCheck size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <Link 
                            href={`/products/${item.product.id}`}
                            className="font-bold text-gray-700 hover:text-orange-600 transition-colors"
                          >
                            {item.product.title}
                          </Link>
                          {item.product.description && (
                            <p className="mt-0.5 text-gray-500">{item.product.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs text-gray-400 px-1"
        >
          <div className="flex items-center gap-2">
            <Hash size={12} />
            <span>شناسه سفارش: ORD-{String(order.id).padStart(6, '0')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={12} />
            <span>بروزرسانی: {formatDate(order.updated_at)}</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}