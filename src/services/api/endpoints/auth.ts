import { httpClient } from '../axiosInstance';
import { ApiResponse, RegisterRequest, LoginRequest, AuthResponse, ProfileResponse } from '@/types/api.types';

class AuthService {
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await httpClient.post<ApiResponse<AuthResponse>>(
        `/auth/register`,
        data
      );
      return response.data;
    } catch (error:any) {
      throw new Error(error.response.data.message);
    }
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    try {
      const response = await httpClient.post<ApiResponse<AuthResponse>>(
        `/auth/login`,
        data
      );
      return response.data;
    } catch (error:any) {
      throw new Error(error.response.data.message);
    }
  }

  async profile(): Promise<ApiResponse<ProfileResponse>> {
    try {
      const response = await httpClient.get<ApiResponse<ProfileResponse>>(
        `/auth/profile`,
      );
      return response.data;
    } catch (error:any) {
      throw new Error(error.response.data.message);
    }
  }
}

export const authService = new AuthService();