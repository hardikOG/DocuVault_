// Auth utilities - token management with safe localStorage access

const TOKEN_KEY = 'docuvault_token';

/**
 * Safely get token from localStorage (handles SSR)
 */
export function getToken(): string | null {
    if (typeof window === 'undefined') return null;

    try {
        return localStorage.getItem(TOKEN_KEY);
    } catch {
        return null;
    }
}

/**
 * Save token to localStorage
 */
export function setToken(token: string): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
        console.error('Failed to save token:', error);
    }
}

/**
 * Remove token from localStorage
 */
export function clearToken(): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
        console.error('Failed to clear token:', error);
    }
}

/**
 * Clear token and redirect to login
 */
export function clearTokenAndRedirect(): void {
    clearToken();
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
}

/**
 * Check if user is authenticated (has valid token)
 */
export function isAuthenticated(): boolean {
    const token = getToken();
    if (!token) return false;

    // Basic JWT expiration check (decode without verification)
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
    } catch {
        return false;
    }
}

/**
 * Get user info from token
 */
export function getUserFromToken(): { id: string; email: string } | null {
    const token = getToken();
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return { id: payload.id, email: payload.email };
    } catch {
        return null;
    }
}
