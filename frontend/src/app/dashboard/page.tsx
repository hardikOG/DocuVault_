'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    FileText,
    Clock,
    AlertTriangle,
    Plus,
    ArrowRight
} from 'lucide-react';
import { useDocuments } from '@/hooks/useDocuments';
import { SummaryCard } from '@/components/SummaryCard';
import { DocumentCard } from '@/components/DocumentCard';
import { Button, Card } from '@/components/ui';

export default function DashboardPage() {
    const { documents, isLoading, stats, deleteDoc } = useDocuments();

    // Get recent documents (last 5)
    const recentDocuments = documents.slice(0, 5);

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Welcome back! Here&apos;s an overview of your documents.
                    </p>
                </div>
                <Link href="/dashboard/upload">
                    <Button leftIcon={<Plus className="h-4 w-4" />}>
                        Upload Document
                    </Button>
                </Link>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <SummaryCard
                    title="Total Documents"
                    value={isLoading ? '...' : stats.total}
                    icon={FileText}
                    variant="default"
                />
                <SummaryCard
                    title="Active"
                    value={isLoading ? '...' : stats.active}
                    icon={FileText}
                    variant="success"
                    description="Documents in good standing"
                />
                <SummaryCard
                    title="Expiring Soon"
                    value={isLoading ? '...' : stats.expiring}
                    icon={Clock}
                    variant="warning"
                    description="Within next 7 days"
                />
                <SummaryCard
                    title="Expired"
                    value={isLoading ? '...' : stats.expired}
                    icon={AlertTriangle}
                    variant="danger"
                    description="Require attention"
                />
            </div>

            {/* Recent Documents */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Recent Documents
                    </h2>
                    <Link href="/dashboard/documents" className="text-emerald-500 hover:text-emerald-600 text-sm font-medium flex items-center gap-1">
                        View all
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                {isLoading ? (
                    // Skeleton Loading
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
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
                ) : recentDocuments.length === 0 ? (
                    // Empty State
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Card className="text-center py-12">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <FileText className="h-8 w-8 text-emerald-500" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                Upload your first document ✨
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                                Start securing your important documents and never miss an expiry date again.
                            </p>
                            <Link href="/dashboard/upload">
                                <Button leftIcon={<Plus className="h-4 w-4" />}>
                                    Upload Document
                                </Button>
                            </Link>
                        </Card>
                    </motion.div>
                ) : (
                    // Document List
                    <div className="space-y-4 stagger-enter">
                        {recentDocuments.map((doc) => (
                            <div key={doc.id} className="animate-slide-up">
                                <DocumentCard
                                    document={doc}
                                    onDelete={deleteDoc}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
