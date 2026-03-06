// URL management helper - builds full URLs from base URL and paths
export const BASE_URL = process.env.BASE_URL || '';

// Build full URL from base URL and path
export function buildUrl(path: string): string {
    return `${BASE_URL}${path}`;
}

// Common application URLs
export const URLS = {
    LOGIN: buildUrl('/auth/login'),
    DASHBOARD: buildUrl('/dashboard/index'),
    ADMIN_USERS: buildUrl('/admin/viewSystemUsers'),
    ADD_USER: buildUrl('/admin/saveSystemUser'),
    FORGOT_PASSWORD: buildUrl('/auth/requestPasswordResetCode'),
};
