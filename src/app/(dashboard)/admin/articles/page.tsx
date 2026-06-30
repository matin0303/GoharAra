'use client'
import ArticlesTable from '@/components/Admin/Article/AticlesTable'
import InfoDialog from '@/components/Shared/InfoDialog'
import { useAdminArticles, useDeleteArticle, useGetArticleBySlug } from '@/hook/useArticle'
import { Article } from '@/types/api.types'
import Link from 'next/link'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { FourSquare } from 'react-loading-indicators'

export default function page() {
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
  const [articleId, setArticleId] = useState<number | null>(null)
  const { data, isLoading } = useAdminArticles()
  const { mutate: deleteArticle } = useDeleteArticle()

  function handleOpenEditModal(slug: string) {
    
  }

  function handleOpenDeleteModal(id: number) {
    setArticleId(id)
    setOpenDeleteModal(true)
  }
  return (
    <div>
      <div className='relative z-20 w-full py-20 min-h-screen md:px-10'>
        <div>
          <h1 className='text-2xl text-orange-600 font-sarvenaz'>لیست مقاله ها</h1>
        </div>
        <div dir='ltr' className='w-full flex justify-center items-center'>
            {isLoading ? (
            <FourSquare color='#ea580c' size='large' text='در حال بارگذاری محصولات...' />
          ) : data && data.data.length > 0 ? (
            <ArticlesTable rows={data?.data} setOpenDeleteModal={handleOpenDeleteModal} setOpenEditModal={handleOpenEditModal} />
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
              <p className="text-gray-500 text-lg font-medium">هیچ مقاله ای یافت نشد</p>
              <Link href='articles/addArticle' className="text-orange-600 text-sm">برای افزودن مقاله جدید کلیک کنید</Link>
            </div>
          )}
        </div>
      </div>
      
      <InfoDialog
        openModal={openDeleteModal}
        setOpenModal={setOpenDeleteModal}
        title="حدف مقاله"
        buttonAction={() => {
          if (!articleId) return
          deleteArticle(articleId)
          setOpenDeleteModal(false)
        }}
        buttonText="حذف"
        activeCloseButton={true}
        closeButtonText={'لغو'}
        bodyContent={
          <div className='px-10'>
            آیا از حدف مقاله اطمینان دارید؟
          </div>
        }
      />
    </div>
  )
}
