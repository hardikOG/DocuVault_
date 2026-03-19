'use client';

import React, { HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
    hover?: boolean;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
};

function Card({ className, hover = false, padding = 'md', children, ...props }: CardProps) {
    const baseClassName = cn(
        'bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800',
        'shadow-sm transition-shadow duration-200',
        hover && 'hover:shadow-lg cursor-pointer',
        paddingStyles[padding],
        className
    );

    if (hover) {
        return (
            <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
                className={baseClassName}
                {...props}
            >
                {children}
            </motion.div>
        );
    }

    return (
        <div className={baseClassName} {...props}>
            {children}
        </div>
    );
}

// Card Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

function CardHeader({ className, ...props }: CardHeaderProps) {
    return (
        <div className={cn('flex flex-col space-y-1.5', className)} {...props} />
    );
}

// Card Title
interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

function CardTitle({ className, ...props }: CardTitleProps) {
    return (
        <h3
            className={cn(
                'text-lg font-semibold text-gray-900 dark:text-white',
                className
            )}
            {...props}
        />
    );
}

// Card Description
interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> { }

function CardDescription({ className, ...props }: CardDescriptionProps) {
    return (
        <p
            className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
            {...props}
        />
    );
}

// Card Content
interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

function CardContent({ className, ...props }: CardContentProps) {
    return <div className={cn('', className)} {...props} />;
}

// Card Footer
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> { }

function CardFooter({ className, ...props }: CardFooterProps) {
    return (
        <div className={cn('flex items-center pt-4', className)} {...props} />
    );
}

export {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
};
export type { CardProps };
