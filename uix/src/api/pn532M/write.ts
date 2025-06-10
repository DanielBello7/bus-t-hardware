import { api } from '@/lib/api';

export async function write_using_pn532(params: { text: string }) {
    const response = await api.post('/api/pn532/write/', params);
    return response.data;
}
