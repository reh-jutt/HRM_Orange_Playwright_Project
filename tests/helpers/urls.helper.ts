// URL management helper - builds full URLs from base URL and paths
export const BASE_URL = (process.env.BASE_URL || '').trim();

function normalizeBaseUrl(url: string): string {
    // Ensure absolute URL for Playwright (e.g. https://example.com)
    if (!url) return '';
    return url.replace(/\/+$/, '');
}

// Build full URL from base URL and path
export function buildUrl(path: string): string {
    const base = normalizeBaseUrl(BASE_URL);
    if (!base) return path; // fall back to relative path; caller may use Playwright baseURL

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}`;
}

// Common application URLs
export const URLS = {
    LOGIN: buildUrl('/auth/login'),
    DASHBOARD: buildUrl('/dashboard/index'),
    ADMIN_USERS: buildUrl('/admin/viewSystemUsers'),
    ADD_USER: buildUrl('/admin/saveSystemUser'),
    FORGOT_PASSWORD: buildUrl('/auth/requestPasswordResetCode'),
};