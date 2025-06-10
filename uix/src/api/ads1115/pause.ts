import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function pause_ads1115(): Promise<Res<string>> {
    const api = getApi();
    const response = await api.get(`/api/ads1115/pause/`);
    return response.data;
}
