import { useMutation } from '@tanstack/react-query';
import { uploadService } from '@/services/api/endpoints/upload';
import { UploadFolder } from '@/types/api.types';
import toast from 'react-hot-toast';

// ============ Upload Single File ============
export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ 
      file, 
      folder, 
      onProgress 
    }: { 
      file: File; 
      folder: UploadFolder;
      onProgress?: (percent: number) => void;
    }) => uploadService.uploadFile(file, folder, onProgress),
    
    onSuccess: (data) => {
      toast.success('فایل با موفقیت آپلود شد');
    },
    
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============ Upload Multiple Files ============
export const useUploadMultipleFiles = () => {
  return useMutation({
    mutationFn: ({ 
      files, 
      folder, 
      onProgress 
    }: { 
      files: File[]; 
      folder: UploadFolder;
      onProgress?: (fileIndex: number, percent: number) => void;
    }) => uploadService.uploadMultipleFiles(files, folder, onProgress),
    
    onSuccess: () => {
      toast.success('همه فایل‌ها با موفقیت آپلود شدند');
    },
    
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

export const useDeleteFile = () => {
  return useMutation({
    mutationFn: ( url:string ) => uploadService.deleteFile(url),
    
    onSuccess: (data) => {
      toast.success('فایل با موفقیت حذف شد');
    },
    
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
};

// ============ Utility Hook for File Validation ============
export const useFileValidation = () => {
  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!uploadService.isFileTypeAllowed(file)) {
      return {
        isValid: false,
        error: 'نوع فایل مجاز نیست. فقط عکس و ویدیو قابل قبول است',
      };
    }
    
    if (file.size > 50 * 1024 * 1024) {
      return {
        isValid: false,
        error: 'حجم فایل نباید بیشتر از ۵۰ مگابایت باشد',
      };
    }
    
    return { isValid: true };
  };
  
  return { validateFile };
};