// hooks/usePagination.ts
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface UsePaginationOptions {
  initialPage?: number;
  scrollToTop?: boolean;
  scrollBehavior?: ScrollBehavior;
}

export function usePagination({
  initialPage = 1,
  scrollToTop = true,
  scrollBehavior = 'smooth',
}: UsePaginationOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [currentPage, setCurrentPage] = useState(() => {
    const pageFromUrl = searchParams.get('page');
    return pageFromUrl ? parseInt(pageFromUrl) : initialPage;
  });

  // Sync with URL
  useEffect(() => {
    const pageFromUrl = searchParams.get('page');
    if (pageFromUrl) {
      setCurrentPage(parseInt(pageFromUrl));
    } else {
      setCurrentPage(initialPage);
    }
  }, [searchParams, initialPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    
    // Update URL
    const currentParams = new URLSearchParams(searchParams.toString());
    if (page > 1) {
      currentParams.set('page', page.toString());
    } else {
      currentParams.delete('page');
    }
    
    const newUrl = `${window.location.pathname}${currentParams.toString() ? `?${currentParams.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
    
    // Scroll to top
    if (scrollToTop) {
      window.scrollTo({ 
        top: 0, 
        behavior: scrollBehavior 
      });
    }
  }, [router, searchParams, scrollToTop, scrollBehavior]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    currentPage,
    setCurrentPage,
    handlePageChange,
    resetPage,
  };
}