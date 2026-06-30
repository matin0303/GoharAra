import { httpClient } from '../axiosInstance';
import {
  ApiResponse,
  Product,
  ProductsListResponse,
  GetProductsParams,
  CreateProductRequest,
  UpdateProductRequest,
  ProductMutationResponse,
} from '@/types/api.types';

class ProductService {
  private readonly basePath = '/products';

 
  async getAllProducts(params?: GetProductsParams): Promise<ApiResponse<Product[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.search) queryParams.append('search', params.search);
      if (params?.page) queryParams.append('page', params.page.toString());
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      
      const url = queryParams.toString() 
        ? `${this.basePath}?${queryParams.toString()}`
        : this.basePath;
      
      const response = await httpClient.get<ApiResponse<Product[]>>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در دریافت لیست محصولات');
    }
  }


  async getProductById(id: number): Promise<ApiResponse<Product>> {
    try {
      const response = await httpClient.get<ApiResponse<Product>>(
        `${this.basePath}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('محصول مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در دریافت محصول');
    }
  }

  async getProductByIds(ids: number[]): Promise<ApiResponse<Product[]>> {
    try {
      const response = await httpClient.post<ApiResponse<Product[]>>(
        `${this.basePath}/batch`,
        {ids:ids}
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در یافتن محصول');
    }
  }

  async createProduct(data: CreateProductRequest): Promise<ApiResponse<ProductMutationResponse>> {
    try {
      this.validateProductData(data);
      
      const response = await httpClient.post<ApiResponse<ProductMutationResponse>>(
        this.basePath,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در ایجاد محصول');
    }
  }


  async updateProduct(id: number, data: UpdateProductRequest): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.put<ApiResponse<null>>(
        `${this.basePath}/${id}`,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('محصول مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در ویرایش محصول');
    }
  }


  async deleteProduct(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.delete<ApiResponse<null>>(
        `${this.basePath}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('محصول مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در حذف محصول');
    }
  }


  private validateProductData(data: CreateProductRequest): void {
    if (!data.title || data.title.length < 3 || data.title.length > 255) {
      throw new Error('عنوان محصول باید بین 3 تا 255 کاراکتر باشد');
    }
    
    if (!data.price || data.price <= 0) {
      throw new Error('قیمت محصول باید عددی مثبت باشد');
    }
    
    if (!data.images || data.images.length === 0) {
      throw new Error('حداقل یک تصویر برای محصول الزامی است');
    }
    
    if (data.images.length > 4) {
      throw new Error('حداکثر 4 تصویر برای محصول مجاز است');
    }
    
    const urlRegex = /^(https?:\/\/|http:\/\/|\/)/;
    for (const image of data.images) {
      if (!urlRegex.test(image)) {
        throw new Error('آدرس تصویر نامعتبر است');
      }
    }
  }
}

export const productService = new ProductService();