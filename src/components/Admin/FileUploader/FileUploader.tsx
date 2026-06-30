'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDeleteFile, useUploadFile } from '@/hook/useUpload';
import { UploadFolder, UPLOAD_CONFIG } from '@/types/api.types';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon, Video, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type FileUploaderProps = {
    folder: UploadFolder;
    onUploadSuccess?: (url: string, file: File) => void;
    onDeleteImage?: (url: string) => void;
    onUploadError?: (error: string) => void;
    maxFiles?: number;
    multiple?: boolean;
    className?: string;
    images?: string[]
};

export const FileUploader = ({
    folder,
    onUploadSuccess,
    onUploadError,
    onDeleteImage,
    maxFiles = 1,
    multiple = false,
    className = '',
    images
}: FileUploaderProps) => {
    const [uploadedUrls, setUploadedUrls] = useState<string[]>(images ? images : []);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [currentFile, setCurrentFile] = useState<File | null>(null);

    const { mutate: upload, isPending: penddingUpload } = useUploadFile();
    const { mutate: deleteFile, isPending: penddingDlete } = useDeleteFile();

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        if (uploadedUrls.length >= maxFiles) {
            toast.error(`حداکثر ${maxFiles} تصویر میتوانید آپلود کنید`)
            return
        }
        if (rejectedFiles.length > 0) {
            const rejection = rejectedFiles[0];
            const errorMessage = rejection.errors[0]?.message || 'فایل نامعتبر است';
            setError(errorMessage);
            onUploadError?.(errorMessage);
            return;
        }

        setError(null);

        acceptedFiles.forEach((file) => {
            setCurrentFile(file);
            setUploadProgress(0);

            upload(
                {
                    file,
                    folder,
                    onProgress: (percent) => {
                        setUploadProgress(percent);
                    },
                },
                {
                    onSuccess: (response) => {
                        const url = response.data.url;
                        setUploadedUrls((prev) => [...prev, url]);
                        onUploadSuccess?.(url, file);
                        setCurrentFile(null);
                        setUploadProgress(0);
                    },
                    onError: (err) => {
                        setError(err.message);
                        onUploadError?.(err.message);
                        setCurrentFile(null);
                        setUploadProgress(0);
                    },
                }
            );
        });
    }, [folder, upload, onUploadSuccess, onUploadError]);


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: UPLOAD_CONFIG.ALLOWED_TYPES.reduce((acc, type) => ({ ...acc, [type]: [] }), {} as Record<string, string[]>),
        maxSize: UPLOAD_CONFIG.MAX_SIZE,
        maxFiles,
        multiple,

    });

    const removeImage = (index: number, url: string) => {
        deleteFile(url, {
            onSuccess: () => {
                onDeleteImage?.(url),
                    setUploadedUrls((prev) => prev.filter((_, i) => i !== index));

            }
        });
    };

    const getFilePreview = (file: File | null) => {
        if (!file) return null;

        if (file.type.startsWith('image/')) {
            return URL.createObjectURL(file);
        }

        if (file.type.startsWith('video/')) {
            return 'video';
        }

        return null;
    };

    const previewUrl = currentFile ? getFilePreview(currentFile) : null;
    const isVideo = currentFile?.type.startsWith('video/');

    return (
        <div className={`w-full ${className}`}>
            {/* Dropzone Area */}
            <div
                {...getRootProps()}
                className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                    }
          ${penddingUpload ? 'opacity-60 cursor-wait' : ''}
        `}
            >
                <input {...getInputProps()} disabled={penddingUpload} />

                {penddingUpload && currentFile ? (
                    <div className="space-y-4">
                        {/* Preview */}
                        {previewUrl && previewUrl !== 'video' && (
                            <div className="relative w-32 h-32 mx-auto">
                                <Image
                                    src={previewUrl}
                                    alt="Preview"
                                    fill
                                    className="object-cover rounded-lg"
                                />
                            </div>
                        )}

                        {isVideo && (
                            <div className="w-32 h-32 mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
                                <Video size={48} className="text-gray-500" />
                            </div>
                        )}

                        {/* File Name */}
                        <p className="text-sm text-gray-600">{currentFile.name}</p>

                        {/* Progress Bar */}
                        <div className="w-full max-w-md mx-auto">
                            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                                <div
                                    className="bg-blue-600 h-2 transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                در حال آپلود... {uploadProgress}%
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex justify-center">
                            <Upload size={48} className="text-gray-400" />
                        </div>
                        {isDragActive ? (
                            <p className="text-blue-500 font-medium">فایل رو رها کن...</p>
                        ) : (
                            <>
                                <p className="text-gray-600">
                                    برای آپلود کلیک کن یا فایل رو بکش اینجا
                                </p>
                                <p className="text-xs text-gray-400">
                                    {UPLOAD_CONFIG.ALLOWED_TYPES.map(t => t.split('/')[1]).join(', ')} - حداکثر {UPLOAD_CONFIG.MAX_SIZE_MB}MB
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="mt-3 flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                    <AlertCircle size={18} />
                    <p className="text-sm">{error}</p>
                </div>
            )}

            {/* Uploaded Files Gallery */}
            {uploadedUrls.length > 0 && (
                <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                        فایل‌های آپلود شده ({uploadedUrls.length})
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                        {uploadedUrls.map((url, index) => (
                            <div key={index} className="relative group ">
                                <div className="relative rounded-lg overflow-hidden aspect-square bg-gray-100">
                                    <img
                                        src={url}
                                        alt={`Uploaded ${index + 1}`}
                                        className=" w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeImage(index, url)}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                                <div className="absolute bottom-1 right-1 bg-green-500 text-white rounded-full p-0.5">
                                    <CheckCircle size={12} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};