import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function rfc522_stats(): Promise<Res<'idle' | 'busy'>> {
    const api = getApi();
    const response = await api.get('/api/rfc522/stats/');
    return response.data;
}
