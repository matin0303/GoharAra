import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleService } from '@/services/api/endpoints/article';
import { CreateArticleRequest, GetProductsParams, UpdateArticleRequest } from '@/types/api.types';
import toast from 'react-hot-toast';

// ============ Query Keys ============
export const articleKeys = {
  all: ['articles'] as const,
  published: () => [...articleKeys.all, 'published' ] as const,
  bySlug: (slug: string) => [...articleKeys.all, 'slug', slug] as const,
  admin: () => [...articleKeys.all, 'admin'] as const,
};

// ============ Get Published Articles ============
export const usePublishedArticles = (params?: GetProductsParams) => {
  return useQuery({
    queryKey: ['articles', 'published', params],
    queryFn: () => articleService.getPublishedArticles(params),
    staleTime: 10 * 60 * 1000, 
  });
};

// ============ Get Article by Slug ============
export const useArticleBySlug = (slug: string) => {
  return useQuery({
    queryKey: articleKeys.bySlug(slug),
    queryFn: () => articleService.getArticleBySlug(slug),
    enabled: !!slug,
    staleTime:1,
  });
};

export const useGetArticleBySlug = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (slug: string) => articleService.getArticleBySlug(slug),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.bySlug(variables),});
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};
// ============ Get All Articles for Admin ============
export const useAdminArticles = () => {
  return useQuery({
    queryKey: articleKeys.admin(),
    queryFn: () => articleService.getAllArticlesForAdmin(),
    staleTime: 2 * 60 * 1000,
  });
};

// ============ Create Article ============
export const useCreateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateArticleRequest) => articleService.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin() });
      queryClient.invalidateQueries({ queryKey: articleKeys.published() });
      toast.success('مقاله با موفقیت ایجاد شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============ Update Article ============
export const useUpdateArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateArticleRequest }) =>
      articleService.updateArticle(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin() });
      queryClient.invalidateQueries({ queryKey: articleKeys.published() });
      toast.success('مقاله با موفقیت ویرایش شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============ Delete Article ============
export const useDeleteArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => articleService.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: articleKeys.admin() });
      queryClient.invalidateQueries({ queryKey: articleKeys.published() });
      toast.success('مقاله با موفقیت حذف شد');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};