// TypeScript interfaces matching DocuVault backend API

export interface User {
    id: string;
    email: string;
}

export interface Document {
    id: string;
    name: string;
    fileType: string;
    uploadedAt: string;
    expiresAt: string | null;
    lastReminderAt?: string | null;
    nextReminderAt?: string | null;
    userId?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface AuthCredentials {
    email: string;
    password: string;
}

export type DocumentStatus = 'active' | 'expiring' | 'expired';

export interface DocumentWithStatus extends Document {
    status: DocumentStatus;
}

export interface UploadProgress {
    loaded: number;
    total: number;
    percentage: number;
}

export interface ApiError {
    message: string;
    status?: number;
}

export interface DocumentsResponse {
    data: Document[];
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
    };
}

export interface DownloadResponse {
    url: string;
}
