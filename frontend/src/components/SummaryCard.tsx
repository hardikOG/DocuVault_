'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui';
import { cn } from '@/lib/utils';

type SummaryVariant = 'default' | 'success' | 'warning' | 'danger';

interface SummaryCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    variant?: SummaryVariant;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const variantStyles: Record<SummaryVariant, { bg: string; icon: string; gradient: string }> = {
    default: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        icon: 'text-gray-600 dark:text-gray-400',
        gradient: 'from-gray-500/10 to-gray-500/5',
    },
    success: {
        bg: 'bg-emerald-100 dark:bg-emerald-900/30',
        icon: 'text-emerald-600 dark:text-emerald-400',
        gradient: 'from-emerald-500/10 to-emerald-500/5',
    },
    warning: {
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        icon: 'text-amber-600 dark:text-amber-400',
        gradient: 'from-amber-500/10 to-amber-500/5',
    },
    danger: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        icon: 'text-red-600 dark:text-red-400',
        gradient: 'from-red-500/10 to-red-500/5',
    },
};

export function SummaryCard({
    title,
    value,
    icon: Icon,
    variant = 'default',
    description,
}: SummaryCardProps) {
    const styles = variantStyles[variant];

    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            transition={{ duration: 0.2 }}
        >
            <Card className={cn('relative overflow-hidden')}>
                {/* Background Gradient */}
                <div
                    className={cn(
                        'absolute inset-0 bg-gradient-to-br opacity-50',
                        styles.gradient
                    )}
                />

                <div className="relative flex items-center gap-4">
                    {/* Icon */}
                    <div className={cn('p-3 rounded-xl', styles.bg)}>
                        <Icon className={cn('h-6 w-6', styles.icon)} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {title}
                        </p>
                        <motion.p
                            key={value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-gray-900 dark:text-white mt-0.5"
                        >
                            {value}
                        </motion.p>
                        {description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}
