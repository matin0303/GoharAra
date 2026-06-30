'use client'

import { useEffect, useState } from 'react'
interface ProductGalleryProps {
  images: string[]
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0])
  const [otherImages, setOtherImages] = useState(images.slice(1))

  const handleImageClick = (clickedImage: string, index: any) => {
    const newOtherImages = [...otherImages]
    newOtherImages[index] = mainImage
    setMainImage(clickedImage)
    setOtherImages(newOtherImages)
  }

  useEffect(() => {
    setMainImage(images[0])
    setOtherImages(images.slice(1))
  }, [images])

  return (
    <div className='flex'>
      <div className='w-full overflow-hidden rounded-xl shadow-xl/50'>
        <img src={mainImage} alt="محصول" className='w-full aspect-square object-center object-cover' />
      </div>
      {images.length > 1 &&
        <div className=' flex flex-col justify-between items-center mr-4'>
          {otherImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt="محصول"
              className='max-w-20 h-20 rounded-md aspect-square shadow-xl/50 cursor-pointer'
              onClick={() => handleImageClick(image, index)}
            />
          ))}
        </div>
      }
    </div>
  )
}