import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function pause_rfc522(): Promise<Res<string>> {
    const api = getApi();
    const response = await api.get('/api/rfc522/pause/');
    return response.data;
}
