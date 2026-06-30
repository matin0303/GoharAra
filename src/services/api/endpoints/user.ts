import { httpClient } from '../axiosInstance';
import {
  ApiResponse,
  User,
  UsersListResponse,
  GetUsersParams,
  UpdateUserRoleRequest,
  UserStats,
  VALID_ROLES,
} from '@/types/api.types';

import { isValidRole } from '@/lib/utils';

class UserService {
  private readonly basePath = '/users';

  async getAllUsers(params?: GetUsersParams): Promise<ApiResponse<UsersListResponse>> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.role) queryParams.append('role', params.role);
      if (params?.search) queryParams.append('search', params.search);
      
      const url = queryParams.toString()
        ? `${this.basePath}?${queryParams.toString()}`
        : this.basePath;
      
      const response = await httpClient.get<ApiResponse<UsersListResponse>>(url);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در دریافت لیست کاربران');
    }
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    try {
      const response = await httpClient.get<ApiResponse<User>>(
        `${this.basePath}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('کاربر مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر');
    }
  }

  async updateUserRole(id: number, data: UpdateUserRoleRequest): Promise<ApiResponse<null>> {
    try {
      if (!isValidRole(data.role)) {
        throw new Error(`نقش نامعتبر است. نقش‌های مجاز: ${VALID_ROLES.join(', ')}`);
      }
      
      const response = await httpClient.put<ApiResponse<null>>(
        `${this.basePath}/${id}/role`,
        data
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('شما نمی‌توانید نقش خود را تغییر دهید');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'نقش نامعتبر است');
      }
      if (error.response?.status === 404) {
        throw new Error('کاربر مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در تغییر نقش کاربر');
    }
  }


  async deleteUser(id: number): Promise<ApiResponse<null>> {
    try {
      const response = await httpClient.delete<ApiResponse<null>>(
        `${this.basePath}/${id}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        throw new Error('شما نمی‌توانید حساب خود را حذف کنید');
      }
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.message || 'امکان حذف این کاربر وجود ندارد');
      }
      if (error.response?.status === 404) {
        throw new Error('کاربر مورد نظر یافت نشد');
      }
      throw new Error(error.response?.data?.message || 'خطا در حذف کاربر');
    }
  }

  async getUserStats(): Promise<ApiResponse<UserStats>> {
    try {
      const response = await httpClient.get<ApiResponse<UserStats>>(
        `${this.basePath}/stats`
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'خطا در دریافت آمار کاربران');
    }
  }
}

export const userService = new UserService();