import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/api/endpoints/order';
import { AdminOrderFilters } from '@/types/api.types';
import toast from 'react-hot-toast';

// ============ Query Keys ============
export const orderKeys = {
  all: ['orders'] as const,
  userOrders: () => [...orderKeys.all, 'user'] as const,
  adminOrders: () => [...orderKeys.all, 'admin'] as const,
  adminOrdersList: (filters?: AdminOrderFilters) => [...orderKeys.adminOrders(), filters] as const,
  adminOrderDetail: (id: number) => [...orderKeys.adminOrders(), 'detail', id] as const,

};

// ============ Create Order ============
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: orderService.createOrder.bind(orderService),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.userOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrders() });
      toast.success('سفارش شما با موفقیت ثبت شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============ Get User Orders ============
export const useUserOrders = () => {
  return useQuery({
    queryKey: orderKeys.userOrders(),
    queryFn: () => orderService.getUserOrders(),
    staleTime: 2 * 60 * 1000,
  });
};

// ============ Get All Orders (Admin Only) ============
export const useAdminOrders = (filters?: AdminOrderFilters) => {
  return useQuery({
    queryKey: orderKeys.adminOrdersList(filters),
    queryFn: () => orderService.getAllOrders(filters),
    staleTime: 1 * 60 * 1000, 
    enabled: true,
  });
};

// ============ Get Order Detail (Admin Only) ============
export const useAdminOrderDetail = (id: number) => {
  return useQuery({
    queryKey: orderKeys.adminOrderDetail(id),
    queryFn: () => orderService.getOrderDetail(id),
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useGetAdminOrderDetail = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => orderService.getOrderDetail(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrderDetail(variables) });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}
// ============ Mark Order as Seen (Admin Only) ============
export const useMarkOrderAsSeen = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => orderService.markOrderAsSeen(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrders() });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrderDetail(id) });
      toast.success('سفارش به عنوان دیده شده علامت‌گذاری شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => orderService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.adminOrdersList() });
      toast.success('سقارش با موفقیت حذف شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

