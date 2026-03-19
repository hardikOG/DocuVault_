'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button, Input, Card, CardContent } from '@/components/ui';
import { login, signup } from '@/lib/api';
import { setToken } from '@/lib/auth';

const authSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormData = z.infer<typeof authSchema>;

interface AuthFormProps {
    mode: 'login' | 'signup';
}

export function AuthForm({ mode }: AuthFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AuthFormData>({
        resolver: zodResolver(authSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (data: AuthFormData) => {
        try {
            setIsLoading(true);
            setError(null);

            const authFn = mode === 'login' ? login : signup;
            const response = await authFn(data);

            setToken(response.token);
            setIsSuccess(true);

            // Show success state briefly then redirect
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (err: unknown) {
            const errorMessage =
                (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
                (mode === 'login' ? 'Invalid credentials' : 'Failed to create account');
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card padding="lg" className="w-full max-w-md mx-auto">
                <CardContent>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            {mode === 'login'
                                ? 'Sign in to access your documents'
                                : 'Start securing your documents today'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, x: 0 }}
                                animate={{
                                    opacity: 1,
                                    scale: 1,
                                    x: [0, -10, 10, -10, 10, 0]
                                }}
                                transition={{
                                    duration: 0.4,
                                    x: { duration: 0.5 }
                                }}
                                className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm"
                            >
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </motion.div>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            placeholder="you@example.com"
                            leftIcon={<Mail className="h-4 w-4" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            leftIcon={<Lock className="h-4 w-4" />}
                            showPasswordToggle
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            isSuccess={isSuccess}
                        >
                            {mode === 'login' ? 'Sign In' : 'Create Account'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {mode === 'login' ? (
                                <>
                                    Don&apos;t have an account?{' '}
                                    <a href="/signup" className="text-emerald-500 hover:text-emerald-600 font-medium">
                                        Sign up
                                    </a>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <a href="/login" className="text-emerald-500 hover:text-emerald-600 font-medium">
                                        Sign in
                                    </a>
                                </>
                            )}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
