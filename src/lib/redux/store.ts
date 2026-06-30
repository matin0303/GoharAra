// store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { reducers } from './slices';
import { setAuth } from './slices/authSlice';
import { getCookie } from '@/lib/utils';
import { TokenPayload } from '@/types/types';
import { decodeJwt } from 'jose';

export const makeStore = () => {
  const store = configureStore({
    reducer: reducers,
    devTools: process.env.NODE_ENV !== 'production',
  });

  // Initialize auth state from cookies on store creation
  if (typeof window !== 'undefined') {
    const token = getCookie('tk');
    let role = undefined ;
    if (token){
      const decoded = decodeJwt(token) as TokenPayload
      role = decoded?.role
    }
    if (token && role) {
      store.dispatch(setAuth({ token, role }));
    }
  }

  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];