'use client'
import { ProductForm } from '@/components/Admin/Products/AddProduct';
import ProductTable from '@/components/Admin/Products/ProductTable'
import InfoDialog from '@/components/Shared/InfoDialog';
import { useDeleteProduct, useGetProductForEdit, useProducts } from '@/hook/useProduct';
import { AddProduct } from '@/types/api.types';
import Link from 'next/link';
import React, {useState } from 'react'
import toast from 'react-hot-toast';
import { FourSquare } from 'react-loading-indicators';

export default function page() {
  const [initialData, setInitialData] = useState<AddProduct | null>(null)
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [productId, setProductId] = useState<number | null>(null)
  const [openEditeModal, setOpenEditeModal] = useState<boolean>(false)
  // const [searchQuery, setSearchQuery] = useState<string | undefined>(undefined)

  const { data, isLoading } = useProducts({ page: 1, limit: -1});
  const { mutate: productData} = useGetProductForEdit();
  const { mutate: deleteProduct} = useDeleteProduct();

  function handleOpenEditModal(id: number) {
    productData(id, {
      onSuccess(response) {
        const imagesArray = response.data.images
          .replace(/[\[\]"]/g, '')
          .split(',')
          .map(img => img.trim());

        setInitialData({ ...response.data, images: imagesArray })
        setOpenEditeModal(true)
      },
      onError(error) {
        toast.error(error.message)
      }
    })


  }

  function handleOpenDeleteModal(id: number) {
    setProductId(id)
    setOpenDeleteModal(true)
  }
  return (
    <div className='min-h-screen'>
      <div className='relative z-20 py-20 md:px-10'>
        <div className='px-5'>
          <h2 className='font-sarvenaz text-2xl text-orange-600'>لیست محصولات</h2>
        </div>
        <div dir='ltr' className='w-full flex justify-center items-center'>
          {isLoading ? (
            <FourSquare color='#ea580c' size='large' text='در حال بارگذاری محصولات...' />
          ) : data && data.data.length > 0 ? (
            <ProductTable
              rows={data.data}
              setOpenDeleteModal={handleOpenDeleteModal}
              setOpenEditModal={handleOpenEditModal}
            />
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
              <p className="text-gray-500 text-lg font-medium">هیچ محصولی یافت نشد</p>
              <Link href='products/addProduct' className="text-orange-600 text-sm">برای افزودن محصول جدید کلیک کنید</Link>
            </div>
          )}
        </div>

      </div>


      {(openEditeModal && initialData) && (
        <div className='fixed z-20 inset-0 bg-black/30'>
          <div className='relative w-full h-full overflow-y-auto'>
            <div
              className='min-h-full p-8 cursor-pointer'
              onClick={() => setOpenEditeModal(false)}
            >
              <div className='flex justify-center items-start min-h-full py-20'>
                <div
                  className='cursor-auto'
                  onClick={(e) => e.stopPropagation()}
                >
                  <ProductForm
                    isEditing={true}
                    initialData={initialData}
                    setOpenEditeModal={setOpenEditeModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <InfoDialog
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        title="حدف محصول"
        buttonAction={() => {
          if (!productId) return
          deleteProduct(productId)
          setOpenDeleteModal(false)
        }}
        buttonText="حذف"
        activeCloseButton={true}
        closeButtonText={'لغو'}
        bodyContent={
          <div className='px-10'>
            آیا از حدف محصول اطمینان دارید؟
          </div>
        }
      />
    </div>
  )
}
