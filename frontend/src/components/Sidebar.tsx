'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    LayoutDashboard,
    FolderOpen,
    Upload,
    Settings,
    HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLink {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const mainLinks: SidebarLink[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: '/dashboard/documents', label: 'Documents', icon: <FolderOpen className="h-5 w-5" /> },
    { href: '/dashboard/upload', label: 'Upload', icon: <Upload className="h-5 w-5" /> },
];

const bottomLinks: SidebarLink[] = [
    { href: '/dashboard/settings', label: 'Settings', icon: <Settings className="h-5 w-5" /> },
    { href: '/dashboard/help', label: 'Help', icon: <HelpCircle className="h-5 w-5" /> },
];

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/dashboard') {
            return pathname === '/dashboard';
        }
        return pathname.startsWith(href);
    };

    const renderLink = (link: SidebarLink) => (
        <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={cn(
                'relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive(link.href)
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
        >
            {isActive(link.href) && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-emerald-500 rounded-r-full"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
            )}
            {link.icon}
            <span>{link.label}</span>
        </Link>
    );

    return (
        <aside
            className={cn(
                'fixed left-0 top-16 h-[calc(100vh-4rem)] w-56 bg-white dark:bg-[#0f1629] border-r border-gray-200 dark:border-white/10 z-40',
                'transform transition-transform duration-300 ease-in-out',
                'md:translate-x-0',
                isOpen ? 'translate-x-0' : '-translate-x-full'
            )}
        >
            <div className="flex flex-col h-full py-8">
                {/* Main Navigation */}
                <nav className="flex-1 px-3 space-y-1.5">
                    <p className="px-3 mb-3 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        Main
                    </p>
                    {mainLinks.map(renderLink)}
                </nav>

                {/* Bottom Navigation */}
                <nav className="px-3 space-y-1.5 border-t border-gray-200 dark:border-white/10 pt-6">
                    {bottomLinks.map(renderLink)}
                </nav>
            </div>
        </aside>
    );
}
