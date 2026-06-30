'use client'
import OrdersTable from '@/components/Admin/Orders/OrdersTable';
import InfoDialog from '@/components/Shared/InfoDialog';
import { useAdminOrders, useDeleteOrder, useGetAdminOrderDetail } from '@/hook/useOrder';
import React, {useState } from 'react'
import { FourSquare } from 'react-loading-indicators';

export default function page() {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [productId, setProductId] = useState<number | null>(null)

  const { data, isLoading } = useAdminOrders();
  const { mutate: deleteOrder} = useDeleteOrder();

  function handleOpenEditModal(id: number) {

  }

  function handleOpenDeleteModal(id: number) {
    setProductId(id)
    setOpenDeleteModal(true)
  }


  return (
    <div>
      <div className='relative z-20 py-20 md:px-10'>
        <div className='px-5'>
          <h2 className='font-sarvenaz text-2xl text-orange-600'>لیست سفارشات</h2>
        </div>
        <div dir='ltr' className='w-full flex justify-center items-center'>
          {isLoading ? (
            <FourSquare color='#ea580c' size='large' text='در حال بارگذاری محصولات...' />
          ) : data && data.data.length > 0 ? (
            <OrdersTable rows={data.data} setOpenDeleteModal={handleOpenDeleteModal} setOpenEditModal={handleOpenEditModal} />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 py-12">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <p className="text-gray-500 text-lg font-medium">هیچ سفارشی یافت نشد</p>
            </div>
          )}
        </div>
      </div>
      <InfoDialog
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        title="حدف محصول"
        buttonAction={() => {
          if (!productId) return
          deleteOrder(productId)
          setOpenDeleteModal(false)
        }}
        buttonText="حذف"
        activeCloseButton={true}
        closeButtonText={'لغو'}
        bodyContent={
          <div className='px-10'>
            آیا از حدف سقارش اطمینان دارید؟
          </div>
        }
      />
    </div>
  )
}
