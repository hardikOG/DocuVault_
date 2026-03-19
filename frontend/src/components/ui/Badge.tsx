'use client';

import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { DocumentStatus } from '@/lib/types';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info';

interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
    variant?: BadgeVariant;
    status?: DocumentStatus;
    shimmer?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const statusToVariant: Record<DocumentStatus, BadgeVariant> = {
    active: 'success',
    expiring: 'warning',
    expired: 'danger',
};

const statusLabels: Record<DocumentStatus, string> = {
    active: 'Active',
    expiring: 'Expiring Soon',
    expired: 'Expired',
};

function Badge({ className, variant, status, shimmer = false, children, ...props }: BadgeProps) {
    // If status is provided, derive variant and label
    const resolvedVariant = status ? statusToVariant[status] : variant || 'default';
    const displayLabel = status ? statusLabels[status] : children;

    // Add shimmer effect for expiring status
    const shouldShimmer = shimmer || status === 'expiring';

    return (
        <motion.span
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium relative overflow-hidden',
                variantStyles[resolvedVariant],
                className
            )}
            {...props}
        >
            {shouldShimmer && (
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{
                        x: ['-100%', '100%'],
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 2,
                        ease: 'linear',
                    }}
                />
            )}
            <span className="relative z-10">{displayLabel}</span>
        </motion.span>
    );
}

export { Badge };
export type { BadgeProps };
