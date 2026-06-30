import { ProductForm } from '@/components/Admin/Products/AddProduct'
import React from 'react'

export default function page() {
  return (
    <div className="relative min-h-screen py-20 flex justify-center items-center">
      <div className="relative z-10 w-full max-w-4xl mx-auto flex justify-center items-center px-4">
        <ProductForm />
      </div>
    </div>
  )
}
