import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/api/endpoints/auth';
import { setTokenOnCookies, removeTokenOnCookies } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.register,
    onSuccess: (data) => {
      setTokenOnCookies(data.data );
      queryClient.setQueryData(['user'], data.data.user);
      window.location.href = '/';
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      setTokenOnCookies(data.data);
      queryClient.setQueryData(['user'], data.data.user);
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.profile(),
    staleTime: 5 * 60 * 1000,
  });
};


export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: () => {
      removeTokenOnCookies();
      queryClient.clear();
    },
  });
};