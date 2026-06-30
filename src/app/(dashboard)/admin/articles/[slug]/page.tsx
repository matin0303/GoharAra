'use client'
import ArticleForm from '@/components/Articles/ArticleForm';
import { useArticleBySlug } from '@/hook/useArticle';
import { Article } from '@/types/api.types';
import React, { useEffect, useState } from 'react'

export default function page({ params }: { params: any }) {
    const { slug } = params;
    const [initialData, setInitialData] = useState<Article | null>(null)
    const { data } = useArticleBySlug(slug);

    useEffect(() => {
        if (!data) return
        setInitialData(data?.data.article)
    }, [data])
    return (
        <div className='w-full flex justify-center items-center py-20'>
            {data && initialData &&
                <div className='relative z-20'>
                    <ArticleForm
                        isEditing={true}
                        initialData={initialData}
                    />
                </div>
            }
        </div>
    )
}
