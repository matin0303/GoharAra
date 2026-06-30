'use client'
import React from 'react'
import { FaFacebook, FaInstagram, FaTelegram } from "react-icons/fa";
import Link from 'next/link'
import { MapPin, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <section className="pt-16 bg-black text-white font-kalameh">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 font-sarvenaz">تماس با ما</h3>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center gap-2">
                <Phone size={18} />
                <span dir="ltr"> 0901 - 079 - 1929 </span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={18} />
                <span>info@goharara.ir</span>
              </div>
              
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-sarvenaz">دسترسی سریع</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="/products" className="hover:text-orange-400 transition-colors">محصولات</Link></li>
              <li><Link href="/articles" className="hover:text-orange-400 transition-colors">وبلاگ</Link></li>
              <li><Link href="/about" className="hover:text-orange-400 transition-colors">درباره ما</Link></li>
              <li><Link href="tel:09010791929" className="hover:text-orange-400 transition-colors">تماس با ما</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-sarvenaz">شبکه‌های اجتماعی</h3>
            <div className="flex gap-3 pr-5">
              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://www.instagram.com/goharara"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="اینستاگرام Pestonuts"
              >
                <FaInstagram size={20} />
              </motion.a>

              <motion.a
                whileHover={{ scale: 1.1 }}
                href="https://t.me/goharara"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="تلگرام Pestonuts"
              >
                <FaTelegram size={20} />
              </motion.a>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4 font-sarvenaz">ساعات کاری</h3>
            <div className="space-y-2 text-gray-400">
              <p>شنبه تا پنجشنبه: ۹ صبح تا ۸ شب</p>
              <p>جمعه: ۱۰ صبح تا ۲ بعد از ظهر</p>
              <p className="text-green-400 mt-2">پشتیبانی ۲۴ ساعته آنلاین</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} گوهرآرا. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </section>
  )
}
