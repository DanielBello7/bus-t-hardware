import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function pause_pn532m(): Promise<Res<string>> {
    const api = getApi();
    const response = await api.get('/api/pn532/pause/');
    return response.data;
}
