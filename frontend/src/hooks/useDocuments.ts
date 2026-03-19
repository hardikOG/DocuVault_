'use client';

import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { getDocuments, deleteDocument } from '@/lib/api';
import { computeStatus } from '@/lib/utils';
import type { Document, DocumentStatus, DocumentWithStatus } from '@/lib/types';

interface UseDocumentsReturn {
    documents: DocumentWithStatus[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    mutate: () => void;
    deleteDoc: (id: string) => Promise<void>;
    stats: {
        total: number;
        active: number;
        expiring: number;
        expired: number;
    };
}

export function useDocuments(): UseDocumentsReturn {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const { data, error, isLoading, mutate } = useSWR<Document[]>(
        isClient ? '/documents' : null,
        () => getDocuments(),
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            errorRetryCount: 3,
            errorRetryInterval: 1000,
            dedupingInterval: 2000,
        }
    );

    // Transform documents with computed status
    const documents: DocumentWithStatus[] = (data || []).map((doc) => ({
        ...doc,
        status: computeStatus(doc.expiresAt),
    }));

    // Calculate stats
    const stats = documents.reduce(
        (acc, doc) => {
            acc.total++;
            acc[doc.status]++;
            return acc;
        },
        { total: 0, active: 0, expiring: 0, expired: 0 }
    );

    // Optimistic delete
    const deleteDoc = useCallback(
        async (id: string) => {
            // Optimistic update - remove from cache immediately
            mutate(
                (currentData) => currentData?.filter((doc) => doc.id !== id),
                false
            );

            try {
                await deleteDocument(id);
                // Revalidate to ensure sync with server
                mutate();
            } catch (err) {
                // Revert on error
                mutate();
                throw err;
            }
        },
        [mutate]
    );

    return {
        documents,
        isLoading,
        isError: !!error,
        error: error || null,
        mutate,
        deleteDoc,
        stats,
    };
}
