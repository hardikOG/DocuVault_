import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { DocumentStatus } from './types';

/**
 * Merge class names with Tailwind conflict resolution
 */
export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

/**
 * Compute document status based on expiration date
 * - expired: expiry date has passed
 * - expiring: expires within 7 days
 * - active: no expiry or more than 7 days away
 */
export function computeStatus(expiresAt: string | null): DocumentStatus {
    if (!expiresAt) return 'active';

    const expiry = new Date(expiresAt);
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    if (expiry < now) return 'expired';
    if (expiry < sevenDaysFromNow) return 'expiring';
    return 'active';
}

/**
 * Format date for display
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Format relative time (e.g., "3 days ago")
 */
export function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Format time until expiration
 */
export function formatTimeUntilExpiry(expiresAt: string | null): string {
    if (!expiresAt) return 'No expiration';

    const expiry = new Date(expiresAt);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs < 0) return 'Expired';

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Expires today';
    if (diffDays === 1) return 'Expires tomorrow';
    if (diffDays < 7) return `Expires in ${diffDays} days`;
    if (diffDays < 30) return `Expires in ${Math.floor(diffDays / 7)} weeks`;
    if (diffDays < 365) return `Expires in ${Math.floor(diffDays / 30)} months`;
    return `Expires in ${Math.floor(diffDays / 365)} years`;
}

/**
 * Get file type icon name based on MIME type
 */
export function getFileTypeIcon(fileType: string): string {
    const type = fileType.toLowerCase();

    if (type.includes('pdf')) return 'FileText';
    if (type.includes('image')) return 'Image';
    if (type.includes('word') || type.includes('doc')) return 'FileText';
    if (type.includes('excel') || type.includes('spreadsheet')) return 'FileSpreadsheet';
    if (type.includes('presentation') || type.includes('powerpoint')) return 'Presentation';
    if (type.includes('zip') || type.includes('archive')) return 'Archive';
    if (type.includes('video')) return 'Video';
    if (type.includes('audio')) return 'Music';

    return 'File';
}

/**
 * Get human-readable file type
 */
export function getFileTypeLabel(fileType: string): string {
    const type = fileType.toLowerCase();

    if (type.includes('pdf')) return 'PDF';
    if (type.includes('png')) return 'PNG';
    if (type.includes('jpeg') || type.includes('jpg')) return 'JPEG';
    if (type.includes('gif')) return 'GIF';
    if (type.includes('word')) return 'Word';
    if (type.includes('excel')) return 'Excel';
    if (type.includes('powerpoint')) return 'PowerPoint';
    if (type.includes('zip')) return 'ZIP';

    // Extract extension if nothing matched
    const parts = type.split('/');
    return parts[parts.length - 1].toUpperCase();
}

/**
 * Format file size in human readable format
 */
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
