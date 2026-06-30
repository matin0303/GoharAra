'use client'
import { useAdminOrderDetail, useMarkOrderAsSeen } from '@/hook/useOrder';
import React from 'react'
import { motion } from 'framer-motion'
import OrderReceipt from '@/components/Admin/Orders/OrderReceipt';
import toast from 'react-hot-toast';

export default function page({ params }: { params: any }) {
    const { id } = params;
    const { data} = useAdminOrderDetail(id);
    const { mutate: markOrderAsSeen} = useMarkOrderAsSeen();

    const handleMarkAsSeen = async (orderId: number) => {
        try {
          await markOrderAsSeen(orderId)
        } catch (error) {
          toast.error('خطا در ثبت وضعیت')
        }
      }

    return (
        <div className='w-full flex justify-center items-center py-20'>
            {data &&
                <motion.div
                    key={data.data.order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className='relative z-20'
                >
                    <OrderReceipt
                        order={data.data.order}
                        user={data.data.user}
                        items={data.data.items}
                        onMarkAsSeen={handleMarkAsSeen}
                    // isSeenLoading={seenLoading === orderData.order.id}
                    />
                </motion.div>
            }

        </div>
    )
}
