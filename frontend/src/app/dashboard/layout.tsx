'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { isAuthenticated } from '@/lib/auth';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [isReady, setIsReady] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push('/login');
        } else {
            setIsReady(true);
        }
    }, [router]);

    const closeSidebar = useCallback(() => {
        setIsSidebarOpen(false);
    }, []);

    if (!isReady) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0f1e]">
            <Navbar showUserMenu />

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="fixed left-4 top-20 z-50 md:hidden p-2 rounded-lg bg-white dark:bg-gray-900 shadow-md border border-gray-200 dark:border-gray-800"
            >
                <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeSidebar}
                        className="fixed inset-0 z-30 bg-black/50 md:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="pt-16 md:pl-56">
                <div className="px-6 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
                    {children}
                </div>
            </main>
        </div>
    );
}
