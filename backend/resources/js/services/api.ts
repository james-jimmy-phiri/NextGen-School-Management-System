import axios from 'axios';

/**
 * Placeholder API client for future Laravel JSON endpoints.
 * Replace baseURL or add interceptors (Sanctum, tenant headers) as needed.
 */
export const apiClient = axios.create({
    baseURL: '/api/v1',
    headers: {
        Accept: 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    timeout: 20_000,
});

export const api = {
    /** Example: GET /dashboard/analytics when backend exists */
    getDashboardAnalytics: async () => {
        try {
            const { data } = await apiClient.get('/dashboard/analytics');
            return data;
        } catch {
            return null;
        }
    },
};
