// components/Pagination/Pagination.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Pagination from '@mui/material/Pagination';
import PaginationItem from '@mui/material/PaginationItem';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
// import { prefixer } from 'stylis';
// import rtlPlugin from 'stylis-plugin-rtl';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Types
export interface PaginationData {
  total: number;
  page: number;
  totalPages: number;
}

interface PaginationComponentProps {
  pagination: PaginationData;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  showFirstLast?: boolean;
  showInfo?: boolean;
  infoText?: string;
}

// RTL Cache Configuration
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [],
});

// Custom Theme
const rtlTheme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#ea580c',
    },
  },
  components: {
    MuiPagination: {
      styleOverrides: {
        root: {
          direction: 'ltr',
        },
      },
    },
    MuiPaginationItem: {
      styleOverrides: {
        root: {
          fontFamily: 'kalameh, sans-serif',
          fontSize: '0.875rem',
          fontWeight: 500,
          minWidth: '40px',
          height: '40px',
          borderRadius: '12px',
          margin: '0 4px',
          transition: 'all 0.2s ease',
          '&.Mui-selected': {
            backgroundColor: '#ea580c',
            color: '#ffffff',
            boxShadow: '0 4px 12px rgba(234, 88, 12, 0.3)',
            '&:hover': {
              backgroundColor: '#ea580c',
            },
          },
          '&:hover': {
            backgroundColor: '#fed7aa',
          },
        },
      },
    }
  },
});

export default function PaginationComponent({
  pagination,
  currentPage,
  onPageChange,
  className = '',
  size = 'large',
  showFirstLast = true,
  showInfo = false,
  infoText = 'مورد',
}: PaginationComponentProps) {
  
  if (!pagination || pagination.totalPages <= 1) {
    return null;
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    onPageChange(value);
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={rtlTheme}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`flex flex-col items-center gap-4 ${className}`}
        >
          {showInfo && (
            <div className="text-sm text-gray-500 font-kalameh">
              <span>نمایش صفحه </span>
              <span className="font-bold text-orange-600">{currentPage}</span>
              <span> از </span>
              <span className="font-bold text-orange-600">{pagination.totalPages}</span>
              <span> | مجموع: </span>
              <span className="font-bold text-gray-700">{pagination.total}</span>
              <span> {infoText}</span>
            </div>
          )}

          {/* Pagination */}
          <Stack spacing={2} dir="ltr">
            <Pagination
              count={pagination.totalPages}
              page={currentPage}
              onChange={handleChange}
              color="primary"
              size='medium'
              siblingCount={0}
              boundaryCount={1}
              // showFirstButton={showFirstLast}
              // showLastButton={showFirstLast}
              renderItem={(item) => (
                <PaginationItem
                  slots={{
                    previous: () => <ChevronRight size={18} />,
                    next: () => <ChevronLeft size={18} />,
                  }}
                  {...item}
                />
              )}
            />
          </Stack>
        </motion.div>
      </ThemeProvider>
    </CacheProvider>
  );
}