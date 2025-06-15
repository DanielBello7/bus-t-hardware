import { Res } from '@/types';
import { getApi } from '@/lib/api';

export async function start_ads1115(): Promise<
    Res<'listening started' | 'already running'>
> {
    const api = getApi();
    const response = await api.get(`/api/ads1115/start/`);
    return response.data;
}
