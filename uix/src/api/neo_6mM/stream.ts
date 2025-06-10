import { api } from '@/lib/api';

export async function stream_gps() {
    const response = await api.get('/api/gps/stream/');
    return response.data;
}
