import { api } from '@/lib/api';

export async function write_using_rfc522(params: { text: string }) {
    const response = await api.post('/api/rfc522/write/', params);
    return response.data;
}
