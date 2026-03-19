'use client';

import React, { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    isSuccess?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-emerald-500 text-white hover:bg-emerald-600 active:bg-emerald-700 shadow-md hover:shadow-lg',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 active:bg-gray-300 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700',
    danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-md hover:shadow-lg',
    ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-800',
    outline: 'border-2 border-emerald-500 text-emerald-500 hover:bg-emerald-50 active:bg-emerald-100 dark:hover:bg-emerald-950',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm rounded-md gap-1.5',
    md: 'px-4 py-2 text-base rounded-lg gap-2',
    lg: 'px-6 py-3 text-lg rounded-xl gap-2.5',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            isSuccess = false,
            leftIcon,
            rightIcon,
            fullWidth = false,
            disabled,
            children,
            ...props
        },
        ref
    ) => {
        const isDisabled = disabled || isLoading;

        return (
            <motion.button
                ref={ref}
                whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                transition={{ duration: 0.15 }}
                className={cn(
                    'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900',
                    variantStyles[variant],
                    sizeStyles[size],
                    fullWidth && 'w-full',
                    isDisabled && 'opacity-60 cursor-not-allowed',
                    className
                )}
                disabled={isDisabled}
                {...(props as HTMLMotionProps<'button'>)}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : isSuccess ? (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                        <Check className="h-4 w-4" />
                    </motion.span>
                ) : (
                    leftIcon
                )}
                {!isSuccess && <span>{children}</span>}
                {!isLoading && !isSuccess && rightIcon}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };
