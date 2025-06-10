import { api } from '@/lib/api';

export async function rfc522_stats() {
    const response = await api.get('/api/rfc522/stats/');
    return response.data;
}
