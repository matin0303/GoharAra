import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/api/endpoints/user';
import { GetUsersParams, UpdateUserRoleRequest } from '@/types/api.types';
import toast from 'react-hot-toast';

// ============ Query Keys ============
export const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params?: GetUsersParams) => [...userKeys.lists(), params] as const,
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
  stats: () => [...userKeys.all, 'stats'] as const,
};

// ============ Get All Users ============
export const useAllUsers = (params?: GetUsersParams) => {
  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => userService.getAllUsers(params),
    staleTime: 2 * 60 * 1000, 
  });
};

// ============ Get Single User ============
export const useUserById = (id: number) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

// ============ Update User Role ============
export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRoleRequest }) =>
      userService.updateUserRole(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      toast.success('نقش کاربر با موفقیت تغییر کرد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============ Delete User ============
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => userService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.stats() });
      toast.success('کاربر با موفقیت حذف شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============ Get User Stats ============
export const useUserStats = () => {
  return useQuery({
    queryKey: userKeys.stats(),
    queryFn: () => userService.getUserStats(),
    staleTime: 5 * 60 * 1000,
  });
};