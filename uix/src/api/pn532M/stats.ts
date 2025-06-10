import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function pn532m_stats(): Promise<Res<'idle' | 'busy'>> {
    const api = getApi();
    const response = await api.get('/api/pn532/stats/');
    return response.data;
}
