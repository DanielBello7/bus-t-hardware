import { Res } from '@/types';
import { api } from '@/lib/api';

export async function start_ads1115(): Promise<Res<string>> {
    const response = await api.get(`/api/ads1115/start`);
    return response.data;
}
