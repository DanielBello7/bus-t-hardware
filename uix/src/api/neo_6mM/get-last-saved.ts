import { api } from '@/lib/api';

export async function get_last_saved() {
    const response = await api.get('/api/gps/last_saved/');
    return response.data;
}
