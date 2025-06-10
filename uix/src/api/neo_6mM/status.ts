import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function get_gps_status(): Promise<Res<'idle' | 'active'>> {
    const api = getApi();
    const response = await api.get('/api/gps/status/');
    return response.data;
}
