'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Plus,
    Search,
    SlidersHorizontal,
    FileText
} from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentCard } from '@/components/DocumentCard';
import { Button, Input, Card, Badge } from '@/components/ui';
import { cn } from '@/lib/utils';
import type { DocumentStatus, DocumentWithStatus } from '@/lib/types';

type FilterStatus = 'all' | DocumentStatus;

export default function DocumentsPage() {
    const { documents, isLoading, deleteDoc } = useDocuments();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

    // Filter documents
    const filteredDocuments = documents.filter((doc: DocumentWithStatus) => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || doc.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const statusFilters: { value: FilterStatus; label: string; count: number }[] = [
        { value: 'all', label: 'All', count: documents.length },
        { value: 'active', label: 'Active', count: documents.filter((d: DocumentWithStatus) => d.status === 'active').length },
        { value: 'expiring', label: 'Expiring', count: documents.filter((d: DocumentWithStatus) => d.status === 'expiring').length },
        { value: 'expired', label: 'Expired', count: documents.filter((d: DocumentWithStatus) => d.status === 'expired').length },
    ];

    return (
        <div className="max-w-6xl space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        Documents
                    </h1>
                    <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                        Manage all your documents in one place.
                    </p>
                </div>
                <Link href="/dashboard/upload">
                    <Button leftIcon={<Plus className="h-4 w-4" />}>
                        Upload Document
                    </Button>
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                    <Input
                        type="text"
                        placeholder="Search documents..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search className="h-4 w-4" />}
                    />
                </div>

                {/* Status Filters - Simplified */}
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">Filter:</span>
                    {statusFilters.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => setFilterStatus(filter.value)}
                            className={cn(
                                'px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap',
                                filterStatus === filter.value
                                    ? 'bg-emerald-500 text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                            )}
                        >
                            {filter.label} ({filter.count})
                        </button>
                    ))}
                </div>
            </div>

            {/* Documents List */}
            {isLoading ? (
                // Skeleton Loading
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <Card key={i} className="h-24">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 skeleton rounded-lg" />
                                <div className="flex-1 space-y-2">
                                    <div className="w-48 h-4 skeleton" />
                                    <div className="w-32 h-3 skeleton" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : filteredDocuments.length === 0 ? (
                // Empty State
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {searchQuery || filterStatus !== 'all'
                                ? 'No documents found'
                                : 'No documents yet'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                            {searchQuery || filterStatus !== 'all'
                                ? 'Try adjusting your search or filters.'
                                : 'Upload your first document to get started.'}
                        </p>
                        {!searchQuery && filterStatus === 'all' && (
                            <Link href="/dashboard/upload">
                                <Button leftIcon={<Plus className="h-4 w-4" />}>
                                    Upload Document
                                </Button>
                            </Link>
                        )}
                    </Card>
                </motion.div>
            ) : (
                // Document List
                <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                        {filteredDocuments.map((doc, index) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                    transition: { delay: index * 0.05 }
                                }}
                                exit={{ opacity: 0, x: -100 }}
                            >
                                <DocumentCard
                                    document={doc}
                                    onDelete={deleteDoc}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Results Count */}
            {!isLoading && filteredDocuments.length > 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    Showing {filteredDocuments.length} of {documents.length} documents
                </p>
            )}
        </div>
    );
}
