import { api } from '@/lib/api';
import { Res } from '@/types';

export async function pause_ads1115(): Promise<Res<string>> {
    const response = await api.get(`/api/ads1115/pause/`);
    return response.data;
}
