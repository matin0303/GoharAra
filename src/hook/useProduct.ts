import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/api/endpoints/product';
import { GetProductsParams, CreateProductRequest, UpdateProductRequest } from '@/types/api.types';
import toast from 'react-hot-toast';

// ============ Query Keys ============
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: GetProductsParams) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number) => [...productKeys.details(), id] as const,
};

// ============ Get All Products ============
export const useProducts = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: productKeys.list(params || {}),
    queryFn: () => productService.getAllProducts(params),
    staleTime: 5 * 60 * 1000, 
  });
};

// ============ Get Group of Products ============
export const useProductByIds = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (ids: number[]) => productService.getProductByIds(ids),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
// ============ Get Single Product ============
export const useProduct = (id: number) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getProductById(id),
    enabled: !!id, 
    staleTime: 5 * 60 * 1000,
  });
};


// ============ Create Product ============
export const useGetProductForEdit = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => productService.getProductById(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables) });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

// ============ Create Product ============
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateProductRequest) => productService.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('محصول با موفقیت ایجاد شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============ Update Product ============
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductRequest }) =>
      productService.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('محصول با موفقیت ویرایش شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============ Delete Product ============
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => productService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
      toast.success('محصول با موفقیت حذف شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};