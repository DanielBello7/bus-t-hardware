import { api } from '@/lib/api';

export async function get_logs() {
    const response = await api.get('/api/logs/');
    return response.data;
}
