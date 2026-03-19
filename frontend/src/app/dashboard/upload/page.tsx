'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    Upload as UploadIcon,
    FileText,
    X,
    Calendar,
    Check,
    AlertCircle
} from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { uploadDocument } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function UploadPage() {
    const router = useRouter();
    const [file, setFile] = useState<File | null>(null);
    const [expiresAt, setExpiresAt] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile) {
            setFile(droppedFile);
            setError(null);
        }
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
        }
    }, []);

    const handleRemoveFile = useCallback(() => {
        setFile(null);
        setUploadProgress(0);
        setError(null);
    }, []);

    const handleUpload = async () => {
        if (!file) return;

        try {
            setIsUploading(true);
            setError(null);
            setUploadProgress(0);

            const expiryDate = expiresAt ? new Date(expiresAt) : undefined;

            await uploadDocument(file, expiryDate, (progress) => {
                setUploadProgress(progress);
            });

            setIsSuccess(true);

            // Redirect after success
            setTimeout(() => {
                router.push('/dashboard/documents');
            }, 1500);
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                'Failed to upload document';
            setError(errorMessage);
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Upload Document
                </h1>
                <p className="mt-1 text-gray-600 dark:text-gray-400">
                    Upload a new document to your secure vault.
                </p>
            </div>

            <Card className="space-y-6">
                {/* Drop Zone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={cn(
                        'drop-zone p-8 text-center transition-all duration-200',
                        isDragging && 'active'
                    )}
                >
                    {file ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                    <FileText className="h-6 w-6 text-emerald-500" />
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-[300px]">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {formatFileSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={handleRemoveFile}
                                className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </motion.div>
                    ) : (
                        <>
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                                <UploadIcon className="h-8 w-8 text-gray-400" />
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
                                Drag and drop your file here
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                or click to browse
                            </p>
                            <input
                                type="file"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                            />
                            <label htmlFor="file-upload" className="inline-block">
                                <span className="inline-flex items-center justify-center px-4 py-2 text-base rounded-lg gap-2 font-medium transition-all duration-200 focus:outline-none cursor-pointer border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950">
                                    Browse Files
                                </span>
                            </label>
                        </>
                    )}
                </div>

                {/* Progress Bar */}
                {isUploading && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Uploading...
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {uploadProgress}%
                            </span>
                        </div>
                        <div className="progress-bar">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </motion.div>
                )}

                {/* Success Message */}
                {isSuccess && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                    >
                        <Check className="h-5 w-5" />
                        <span className="font-medium">Document uploaded successfully!</span>
                    </motion.div>
                )}

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                    >
                        <AlertCircle className="h-5 w-5" />
                        <span>{error}</span>
                    </motion.div>
                )}

                {/* Expiry Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiration Date (Optional)
                    </label>
                    <Input
                        type="date"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        leftIcon={<Calendar className="h-4 w-4" />}
                        min={new Date().toISOString().split('T')[0]}
                        disabled={isUploading || isSuccess}
                    />
                    <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                        Set a date to receive reminders before the document expires.
                    </p>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                    <Button
                        variant="secondary"
                        onClick={() => router.back()}
                        disabled={isUploading || isSuccess}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || isUploading || isSuccess}
                        isLoading={isUploading}
                        isSuccess={isSuccess}
                        leftIcon={<UploadIcon className="h-4 w-4" />}
                        fullWidth
                    >
                        Upload Document
                    </Button>
                </div>
            </Card>
        </div>
    );
}
