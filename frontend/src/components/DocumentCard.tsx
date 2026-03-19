'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Image,
    File,
    Download,
    Trash2,
    MoreVertical,
    Calendar,
    Clock
} from 'lucide-react';
import { Card, Badge, Button } from '@/components/ui';
import { computeStatus, formatDate, formatTimeUntilExpiry, getFileTypeLabel } from '@/lib/utils';
import { getDownloadUrl, deleteDocument } from '@/lib/api';
import type { Document } from '@/lib/types';

interface DocumentCardProps {
    document: Document;
    onDelete?: (id: string) => void;
}

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const status = computeStatus(document.expiresAt);
    const fileTypeLabel = getFileTypeLabel(document.fileType);

    const getFileIcon = () => {
        const type = document.fileType.toLowerCase();
        if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
        if (type.includes('image')) return <Image className="h-8 w-8 text-blue-500" />;
        return <File className="h-8 w-8 text-gray-500" />;
    };

    const handleDownload = async () => {
        try {
            setIsDownloading(true);
            const url = await getDownloadUrl(document.id);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsDeleting(true);
            await deleteDocument(document.id);
            onDelete?.(document.id);
        } catch (error) {
            console.error('Delete failed:', error);
            setIsDeleting(false);
        }
    };

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.2 }}
            >
                <Card hover className="relative group">
                    <div className="flex items-start gap-5">
                        {/* File Icon */}
                        <div className="flex-shrink-0 p-4 bg-gray-100 dark:bg-gray-800/50 rounded-xl">
                            {getFileIcon()}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 py-1">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate mb-2">
                                        {document.name}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-medium">
                                            {fileTypeLabel}
                                        </span>
                                        <Badge status={status} />
                                    </div>
                                </div>

                                {/* Actions Menu */}
                                <div className="relative flex-shrink-0">
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <MoreVertical className="h-5 w-5" />
                                    </button>

                                    <AnimatePresence>
                                        {isMenuOpen && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-10"
                                                    onClick={() => setIsMenuOpen(false)}
                                                />
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.1 }}
                                                    className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 py-1 z-20"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setIsMenuOpen(false);
                                                            handleDownload();
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        Download
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setIsMenuOpen(false);
                                                            setShowConfirm(true);
                                                        }}
                                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                        Delete
                                                    </button>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 mt-4 text-xs text-gray-500 dark:text-gray-400">
                                <span className="flex items-center gap-1.5">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {formatDate(document.uploadedAt)}
                                </span>
                                {document.expiresAt && (
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatTimeUntilExpiry(document.expiresAt)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions (visible on hover) */}
                    <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={handleDownload}
                            isLoading={isDownloading}
                            leftIcon={<Download className="h-4 w-4" />}
                        >
                            Download
                        </Button>
                    </div>
                </Card>
            </motion.div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setShowConfirm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 max-w-sm w-full"
                        >
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Delete Document
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                Are you sure you want to delete &quot;{document.name}&quot;? This action cannot be undone.
                            </p>
                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="secondary"
                                    onClick={() => setShowConfirm(false)}
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="danger"
                                    onClick={handleDelete}
                                    isLoading={isDeleting}
                                    leftIcon={<Trash2 className="h-4 w-4" />}
                                >
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
