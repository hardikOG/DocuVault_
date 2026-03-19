'use client';

import React, { forwardRef, InputHTMLAttributes, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showPasswordToggle?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = 'text',
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            showPasswordToggle = false,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        const isPasswordType = type === 'password';
        const inputType = isPasswordType && showPassword ? 'text' : type;

        return (
            <div className="w-full">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {leftIcon && (
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {leftIcon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        type={inputType}
                        disabled={disabled}
                        className={cn(
                            'w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
                            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                            'transition-all duration-200 ease-in-out',
                            'focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent',
                            'disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-gray-50 dark:disabled:bg-gray-800',
                            error
                                ? 'border-red-500 focus:ring-red-500'
                                : 'border-gray-300 dark:border-gray-700',
                            leftIcon && 'pl-10',
                            (rightIcon || (isPasswordType && showPasswordToggle)) && 'pr-10',
                            className
                        )}
                        {...props}
                    />
                    {isPasswordType && showPasswordToggle && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    )}
                    {rightIcon && !showPasswordToggle && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {rightIcon}
                        </div>
                    )}
                </div>
                <AnimatePresence mode="wait">
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -4 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -4 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center gap-1.5 mt-1.5 text-sm text-red-500"
                        >
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>{error}</span>
                        </motion.div>
                    )}
                    {!error && helperText && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-1.5 text-sm text-gray-500 dark:text-gray-400"
                        >
                            {helperText}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
export type { InputProps };
