import { api } from '@/lib/api';

export async function cancel_stream() {
    const response = await api.get('/api/gps/cancel_stream/');
    return response.data;
}
