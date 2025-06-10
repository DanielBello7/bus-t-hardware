import { api } from '@/lib/api';

export async function pn532m_stats() {
    const response = await api.get('/api/pn532/stats/');
    return response.data;
}
