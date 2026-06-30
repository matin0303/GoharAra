'use client'
import { toJalaliDateTime } from '@/lib/utils'
import { Article } from '@/types/api.types'
import { EyeIcon, Share2, TimerIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

interface ArticleParams {
  data: Article
}

export default function ArticleCard({ data }: ArticleParams) {
  const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // جلوگیری از ناوبری لینک
    e.stopPropagation(); // جلوگیری از propagation به Link

    const url = `${window.location.origin}/articles/${data.slug}`;
    const title = data.title;
    const text = data.description;

    // بررسی پشتیبانی از Web Share API
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          fallbackCopy(url);
        }
      }
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('لینک با موفقیت کپی شد!'); // می‌توانید از toast یا notification بهتر استفاده کنید
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('کپی لینک ناموفق بود');
    }
  };

  return (
    <Link href={`/articles/${data.slug}`} className='group transition-all w-full h-full rounded-sm shadow-lg cursor-pointer hover:shadow-orange-200 border-1 border-gray-200'>
      <div className='overflow-hidden min-h-35'>
        <img src={data.image} alt="" className='group-hover:scale-110 duration-300 aspect-video object-cover object-center rounded-t-sm' />
      </div>
      <div className='p-3'>
        <span className='font-sarvenaz text-xl '>{data.title}</span>
        <p className='w-full !font-kalameh line-clamp-custom cursor-pointer !text-md text-gray-800'>
          {data.description}
        </p>

        <div className='w-full flex justify-between items-center mt-3'>
          {/* <div className='flex justify-center items-center gap-1'>
            <TimerIcon size={17} /> 
            <span className='font-kalameh text-xs'>{toJalaliDateTime(data.updated_at)}</span>
          </div> */}

          <div className='flex justify-end items-center gap-1'>
            <button className='p-1 rounded-md flex flex-row-reverse font-kalameh text-xs justify-center items-center gap-1'>
              <EyeIcon size={17} /> {data.view_count}
            </button>
            <button 
              onClick={handleShare}
              className='p-1 hover:bg-gray-200 rounded-md cursor-pointer'
              aria-label="اشتراک‌گذاری"
            >
              <Share2 size={17} />
            </button>
          </div>
        </div>
      </div>
    </Link>
  )
}