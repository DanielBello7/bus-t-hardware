import { api } from '@/lib/api';

export async function pause_rfc522() {
    const response = await api.get('/api/rfc522/pause/');
    return response.data;
}
