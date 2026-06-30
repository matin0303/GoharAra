'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { makeStore } from '@/lib/redux/store';
import { useState , useRef } from 'react';

export function Providers({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <QueryClientProvider client={queryClient}>
        <Provider store={storeRef.current}>
        {children}
    </Provider>
      </QueryClientProvider>
  );
}