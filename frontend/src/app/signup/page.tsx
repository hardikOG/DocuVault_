'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield } from 'lucide-react';
import { AuthForm } from '@/components/AuthForm';
import { isAuthenticated } from '@/lib/auth';

export default function SignupPage() {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            router.push('/dashboard');
        } else {
            setIsReady(true);
        }
    }, [router]);

    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center">
                        <a href="/" className="flex items-center gap-2">
                            <Shield className="h-8 w-8 text-emerald-500" />
                            <span className="text-xl font-bold text-gray-900 dark:text-white">
                                DocuVault
                            </span>
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center px-4 py-24">
                <AuthForm mode="signup" />
            </main>
        </div>
    );
}
