import React from 'react'
import { JSX } from 'react'

export default function Button({ children }: { children: string }): JSX.Element {
    const createProduct = async (productData: any) => {
        const response = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        })
        
        return await response.json();
    };

    return (
        <>
            <button onClick={() => {
                createProduct({
                    title: 'Product 1',
                    category: 'Electronics',
                    caption: 'A great product',
                    price: 100,
                    salesCount: 0,
                    image: 'https://via.placeholder.com/150'
                })
            }} className='w-full h-10 hover:bg-gray-200 transition-all duration-300 cursor-pointer flex justify-center items-center shadow-md shadow-gray-400 bg-gray-100 text-black font-[paeez] p-6 max-sm:p-0  mx-5 mt-7 max-sm:mt-0 text-4xl rounded-4xl'>
                <span className='shrink-0'>
                    {children}
                </span>
            </button>
        </>
    )
}
