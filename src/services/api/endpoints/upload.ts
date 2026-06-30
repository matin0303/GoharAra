import { httpClient } from '../axiosInstance';
import {
  ApiResponse,
  UploadResponseData,
  UploadFolder,
  UPLOAD_CONFIG,
} from '@/types/api.types';

class UploadService {
  private readonly basePath = '/upload';

  async uploadFile( file: File, folder: UploadFolder, onProgress?: (percent: number) => void): Promise<ApiResponse<UploadResponseData>> {
    this.validateFile(file);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await httpClient.post<ApiResponse<UploadResponseData>>(
        `${this.basePath}?f=${folder}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percent);
            }
          },
        }
      );
      
      return response.data;
    } catch (error: any) {
      throw this.handleUploadError(error);
    }
  }

 
  async uploadMultipleFiles(
    files: File[],
    folder: UploadFolder,
    onProgress?: (fileIndex: number, percent: number) => void
  ): Promise<ApiResponse<UploadResponseData>[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadFile(file, folder, (percent) => {
        onProgress?.(index, percent);
      })
    );
    
    return Promise.all(uploadPromises);
  }

  async deleteFile(url: string): Promise<ApiResponse<UploadResponseData>> {
    try {
      const response = await httpClient.delete<ApiResponse<UploadResponseData>>(
        this.basePath,
        { data: { url } }
      );
      return response.data;
    } catch (error:any) {
      throw new Error(error.response.data.message);
    }
  }

  private validateFile(file: File): void {
    if (!file || file.size === 0) {
      throw new Error('لطفاً یک فایل انتخاب کنید');
    }
    
    if (!UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type as any)) {
      const allowedTypesStr = UPLOAD_CONFIG.ALLOWED_TYPES.join('، ');
      throw new Error(`نوع فایل مجاز نیست. انواع مجاز: ${allowedTypesStr}`);
    }
    
    if (file.size > UPLOAD_CONFIG.MAX_SIZE) {
      throw new Error(`حجم فایل بیش از حد مجاز است. حداکثر حجم: ${UPLOAD_CONFIG.MAX_SIZE_MB}MB`);
    }
  }


  private handleUploadError(error: any): Error {
    if (error.response?.data?.message) {
      const message = error.response.data.message;
      
      if (message.includes('Invalid file type')) {
        return new Error('نوع فایل نامعتبر است. فقط عکس و ویدیو مجاز هستند');
      }
      
      if (message.includes('File too large')) {
        return new Error(`حجم فایل بیشتر از ${UPLOAD_CONFIG.MAX_SIZE_MB} مگابایت است`);
      }
      
      return new Error(message);
    }
    
    if (error.message === 'Network Error') {
      return new Error('مشکل در اتصال به اینترنت. لطفاً دوباره تلاش کنید');
    }
    
    return new Error('خطا در آپلود فایل. لطفاً دوباره تلاش کنید');
  }


  isFileTypeAllowed(file: File): boolean {
    return UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type as any);
  }

  
  getFileIcon(fileType: string): string {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.startsWith('video/')) return '🎬';
    return '📄';
  }

 
  getFileColor(fileType: string): string {
    if (fileType.startsWith('image/')) return 'bg-blue-500';
    if (fileType.startsWith('video/')) return 'bg-purple-500';
    return 'bg-gray-500';
  }
}

export const uploadService = new UploadService();