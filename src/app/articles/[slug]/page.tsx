// app/articles/[slug]/page.tsx

import TableOfContents from '@/components/Admin/Article/CreateArticle/TableOfContents/TableOfContents';
import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { Article } from '@/types/api.types';
import ArticleCard from '@/components/ArticleCard/ArticleCard';
import { sanitizeHtml } from '@/lib/utils';
import { mockArticles } from '@/muckDatas/articles';

function findArticleBySlug(slug: string) {
  const found = mockArticles.find(article => article.slug === slug);
  return found || null;
}

function findRelatedArticles(currentArticle: any, limit: number = 3): any[] {
  if (!currentArticle.hashtags || currentArticle.hashtags.length === 0) {
    return [];
  }

  const related = mockArticles.filter(article => 
    article.slug !== currentArticle.slug &&
    article.hashtags.some(tag => currentArticle.hashtags.includes(tag))
  );

  related.sort((a, b) => {
    const aCommonTags = a.hashtags.filter(tag => currentArticle.hashtags.includes(tag)).length;
    const bCommonTags = b.hashtags.filter(tag => currentArticle.hashtags.includes(tag)).length;
    return bCommonTags - aCommonTags;
  });

  return related.slice(0, limit);
}

export default async function BlogPostPage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  // منتظر می‌مانیم تا params resolve شود
  const { slug } = await params;
  const article = findArticleBySlug(slug);
  
  if (!article?.content) {
    notFound();
  }
  
  const sanitizedContent = article.content;
  const relatedArticles = findRelatedArticles(article);
  
  const addHeadingsId = (html: string): string => {
    let counter = 0;
    const timestamp = Date.now();
    
    return html.replace(
      /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi,
      (match, tag, attributes, content) => {
        if (attributes.includes('id=')) return match;
        const id = `heading-${counter++}-${timestamp}`;
        return `<${tag} ${attributes} id="${id}">${content}</${tag}>`;
      }
    );
  };

  const htmlWithIds = addHeadingsId(sanitizedContent);
  const parts = htmlWithIds.split(/(TableOfContent)/g);
  
  const renderedContent = parts.map((part, index) => {
    if (part === 'TableOfContent') {
      return <TableOfContents htmlContent={htmlWithIds} key={index} />;
    }
    return (
      <div 
        key={index} 
        dangerouslySetInnerHTML={{ __html: part }}
        className="prose prose-lg max-w-none"
      />
    );
  });

  return (
    <div className='w-full min-h-screen pt-20 pb-5 px-30 max-lg:px-10 max-sm:px-3 bg-white font-[sarvenaz]'>
      <div className='relative w-full h-full flex max-lg:flex-col-reverse justify-center items-start flex-row-reverse gap-1.5'>
        
        <aside className='w-110 max-lg:w-full max-md:w-full lg:min-h-140 flex gap-3 justify-start items-start flex-col sticky max-md:relative top-0 right-0 p-3 max-lg:pb-5 rounded-sm shadow-md'>
          <span className='text-xl'>مقاله های مرتبط</span>
          <div className='w-full flex flex-col justify-center items-center max-lg:flex-row max-md:flex-col gap-2'>
            {relatedArticles.length > 0 ? (
              relatedArticles.map((relatedArticle: Article, index: number) => (
                <ArticleCard key={relatedArticle.slug || index} data={relatedArticle}/>
              ))
            ) : (
              <p className="text-gray-500 text-sm">مقاله مرتبطی یافت نشد</p>
            )}
          </div>
        </aside>
        
        <main className='w-full min-h-140 h-full rounded-sm shadow-md px-5 max-md:px-3'>
          <article className={styles.articleContent}>
            {renderedContent}
          </article>
        </main>
        
      </div>
    </div>
  );
}

// برای generateMetadata نیز باید از Promise استفاده کنیم
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params;
  const article = findArticleBySlug(slug);
  return {
    title: article?.title || 'مقاله یافت نشد',
    description: article?.description?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
  };
}


// // app/articles/[slug]/page.tsx

// import TableOfContents from '@/components/Admin/Article/CreateArticle/TableOfContents/TableOfContents';
// import { notFound } from 'next/navigation';
// import styles from './page.module.css';
// import { Article } from '@/types/api.types';
// import ArticleCard from '@/components/ArticleCard/ArticleCard';
// import { sanitizeHtml } from '@/lib/utils';

// export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  
//   const response = await getArticle(params.slug);
//   const article: Article = response?.data?.article;
  
//   if (!article?.content) {
//     notFound();
//   }
  
//   // اینجا از تابع جدید استفاده کن
//   const sanitizedContent = await sanitizeHtml(article.content);
  
//   const addHeadingsId = (html: string): string => {
//     let counter = 0;
//     const timestamp = Date.now();
    
//     return html.replace(
//       /<(h[1-6])([^>]*)>(.*?)<\/\1>/gi,
//       (match, tag, attributes, content) => {
//         if (attributes.includes('id=')) return match;
//         const id = `heading-${counter++}-${timestamp}`;
//         return `<${tag} ${attributes} id="${id}">${content}</${tag}>`;
//       }
//     );
//   };

//   const htmlWithIds = addHeadingsId(sanitizedContent);
//   const parts = htmlWithIds.split(/(TableOfContent)/g);
  
//   const renderedContent = parts.map((part, index) => {
//     if (part === 'TableOfContent') {
//       return <TableOfContents htmlContent={htmlWithIds} key={index} />;
//     }
//     return (
//       <div 
//         key={index} 
//         dangerouslySetInnerHTML={{ __html: part }}
//         className="prose prose-lg max-w-none"
//       />
//     );
//   });

//   return (
//     <div className='w-full min-h-screen pt-20 pb-5 px-30 max-lg:px-10 max-sm:px-3 bg-white font-[sarvenaz]'>
//       <div className='relative w-full h-full flex max-lg:flex-col-reverse justify-center items-start flex-row-reverse gap-1.5'>
        
//         <aside className='w-110 max-lg:w-full max-md:w-full lg:min-h-140 flex gap-3 justify-start items-start flex-col sticky max-md:relative top-0 right-0 p-3 max-lg:pb-5 rounded-sm shadow-md'>
//           <span className='text-xl'>مقاله های مرتبط</span>
//           <div className='w-full flex flex-col justify-center items-center max-lg:flex-row max-md:flex-col gap-2'>
//             {response?.data?.related?.length > 0 ? (
//               response.data.related.map((relatedArticle: Article, index: number) => (
//                 <ArticleCard key={index} data={relatedArticle}/>
//               ))
//             ) : (
//               <p className="text-gray-500 text-sm">مقاله مرتبطی یافت نشد</p>
//             )}
//           </div>
//         </aside>
        
//         <main className='w-full min-h-140 h-full rounded-sm shadow-md px-5 max-md:px-3'>
//           <article className={styles.articleContent}>
//             {renderedContent}
//           </article>
//         </main>
        
//       </div>
//     </div>
//   );
// }

// async function getArticle(slug: string) {
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/articles/${slug}`, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
    
//     if (!res.ok) {
//       if (res.status === 404) return null;
//       throw new Error(`HTTP error! status: ${res.status}`);
//     }

//     return await res.json();
//   } catch (error) {
//     console.error('Error fetching article:', error);
//     return null;
//   }
// }

// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   const response = await getArticle(params.slug);
//   const article = response?.data?.article;
//   return {
//     title: article?.title || 'مقاله یافت نشد',
//     description: article?.description?.replace(/<[^>]*>/g, '').substring(0, 150) || '',
//   };
// }