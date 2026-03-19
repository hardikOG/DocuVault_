import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, clearTokenAndRedirect } from './auth';
import type { AuthCredentials, AuthResponse, Document, DownloadResponse } from './types';

// API base URL - uses Next.js API proxy to avoid CORS issues
const API_BASE_URL = '/api/proxy';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add JWT token to all requests
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            clearTokenAndRedirect();
        }
        return Promise.reject(error);
    }
);

// ============ AUTH API ============

export async function signup(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/signup', credentials);
    return response.data;
}

export async function login(credentials: AuthCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    return response.data;
}

// ============ DOCUMENTS API ============

export async function getDocuments(signal?: AbortSignal): Promise<Document[]> {
    const response = await api.get<Document[]>('/documents', { signal });
    return response.data;
}

export async function uploadDocument(
    file: File,
    expiresAt?: Date,
    onProgress?: (progress: number) => void
): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);

    if (expiresAt) {
        formData.append('expiresAt', expiresAt.toISOString());
    }

    const response = await api.post<Document>('/documents', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
            if (onProgress && progressEvent.total) {
                const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                onProgress(percentage);
            }
        },
    });

    return response.data;
}

export async function deleteDocument(id: string): Promise<void> {
    await api.delete(`/documents/${id}`);
}

export async function getDownloadUrl(id: string): Promise<string> {
    const response = await api.get<DownloadResponse>(`/documents/${id}/download`);
    return response.data.url;
}

// ============ SWR FETCHER ============

export const swrFetcher = async (url: string) => {
    const response = await api.get(url);
    return response.data;
};

export default api;
