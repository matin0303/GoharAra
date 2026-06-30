import { httpClient } from '../axiosInstance';
import {
  ApiResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UserOrder,
  AdminOrder,
  AdminOrderDetail,
  AdminOrderFilters,
  OrderItemRequest,
} from '@/types/api.types';

class OrderService {
  private readonly basePath = '/orders';

  async createOrder(data: CreateOrderRequest): Promise<ApiResponse<CreateOrderResponse>> {
    try {
      this.validateOrderItems(data.items);
      
      const response = await httpClient.post<ApiResponse<CreateOrderResponse>>(
        this.basePath,
        data
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در ثبت سفارش');
    }
  }

  async getUserOrders(): Promise<ApiResponse<UserOrder[]>> {
    try {
      const response = await httpClient.get<ApiResponse<UserOrder[]>>(
        `${this.basePath}/my-orders`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در دریافت سفارشات');
    }
  }


  async getAllOrders(filters?: AdminOrderFilters): Promise<ApiResponse<AdminOrder[]>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (filters?.seen !== undefined) queryParams.append('seen', filters.seen.toString());
      if (filters?.start_date) queryParams.append('start_date', filters.start_date);
      if (filters?.end_date) queryParams.append('end_date', filters.end_date);
      
      const url = queryParams.toString()
        ? `${this.basePath}/admin/all?${queryParams.toString()}`
        : `${this.basePath}/admin/all`;
      
      const response = await httpClient.get<ApiResponse<AdminOrder[]>>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در دریافت لیست سفارشات');
    }
  }


  async getOrderDetail(id: number): Promise<ApiResponse<AdminOrderDetail>> {
    try {
      const response = await httpClient.get<ApiResponse<AdminOrderDetail>>(
        `${this.basePath}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('سفارش مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در دریافت جزئیات سفارش');
    }
  }

  async markOrderAsSeen(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.put<ApiResponse<null>>(
        `${this.basePath}/${id}/seen`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('سفارش مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در بروزرسانی وضعیت سفارش');
    }
  }

  async deleteOrder(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.delete<ApiResponse<null>>(
        `${this.basePath}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('سفارش مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در حذف سفارش');
    }
  }

  private validateOrderItems(items: OrderItemRequest[]): void {
    if (!items || items.length === 0) {
      throw new Error('حداقل یک محصول باید انتخاب شود');
    }
    
    for (const item of items) {
      if (!item.id || item.id <= 0) {
        throw new Error('شناسه محصول نامعتبر است');
      }
      
      if (!item.weight || item.weight <= 0) {
        throw new Error('وزن محصول باید بیشتر از 500 گرم باشد');
      }
    }
  }
}

export const orderService = new OrderService();