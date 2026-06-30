import { httpClient } from '../axiosInstance';
import {
  ApiResponse,
  Article,
  ArticleSummary,
  ArticleWithRelated,
  CreateArticleRequest,
  UpdateArticleRequest,
  ArticleMutationResponse,
  SLUG_REGEX,
  AdminArticle,
  GetProductsParams,
} from '@/types/api.types';

class ArticleService {
  private readonly basePath = '/articles';

  async getPublishedArticles(params?: GetProductsParams): Promise<ApiResponse<Article[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const url = queryParams.toString() 
        ? `${this.basePath}/published?${queryParams.toString()}`
        : `${this.basePath}/published`;
      
      const response = await httpClient.get<ApiResponse<Article[]>>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در دریافت مقالات');
    }
  }


  async getArticleBySlug(slug: string): Promise<ApiResponse<ArticleWithRelated>> {
    try {
      const response = await httpClient.get<ApiResponse<ArticleWithRelated>>(
        `${this.basePath}/${slug}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('مقاله مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در دریافت مقاله');
    }
  }


  async getAllArticlesForAdmin(): Promise<ApiResponse<AdminArticle[]>> {
    try {
      const response = await httpClient.get<ApiResponse<AdminArticle[]>>(
        `${this.basePath}/admin/all`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در دریافت لیست مقالات');
    }
  }


  async createArticle(data: CreateArticleRequest): Promise<ApiResponse<ArticleMutationResponse>> {
    try {
      this.validateArticleData(data);
      
      const response = await httpClient.post<ApiResponse<ArticleMutationResponse>>(
        this.basePath,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('این slug قبلاً استفاده شده است');
      }
      throw new Error(error.response?.data?.message || 'خطا در ایجاد مقاله');
    }
  }

  
  async updateArticle(id: number, data: UpdateArticleRequest): Promise<ApiResponse<null>> {
    try {
      if (data.slug && !SLUG_REGEX.test(data.slug)) {
        throw new Error('slug باید فقط شامل حروف کوچک، اعداد و خط تیره باشد');
      }
      
      const response = await httpClient.put<ApiResponse<null>>(
        `${this.basePath}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('مقاله مورد نظر یافت نشد');
      }
      if (error.response?.status === 409) {
        throw new Error('این slug قبلاً استفاده شده است');
      }
      throw new Error(error.response?.data?.message || 'خطا در ویرایش مقاله');
    }
  }

 
  async deleteArticle(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.delete<ApiResponse<null>>(
        `${this.basePath}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('مقاله مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در حذف مقاله');
    }
  }


  private validateArticleData(data: CreateArticleRequest): void {
    if (!data.title || data.title.length < 3 || data.title.length > 255) {
      throw new Error('عنوان مقاله باید بین 3 تا 255 کاراکتر باشد');
    }
    
    if (!data.slug || !SLUG_REGEX.test(data.slug)) {
      throw new Error('slug باید فقط شامل حروف کوچک، اعداد و خط تیره باشد');
    }
    
    if (!data.content || data.content.trim().length === 0) {
      throw new Error('محتوا مقاله الزامی است');
    }
    
    if (data.hashtags && data.hashtags.length > 10) {
      throw new Error('حداکثر 10 هشتگ مجاز است');
    }
  }
}

export const articleService = new ArticleService();