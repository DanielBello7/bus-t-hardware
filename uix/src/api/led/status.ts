import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function led_status(): Promise<Res<'on' | 'off'>> {
    const api = getApi();
    const response = await api.get('/api/led/status/');
    return response.data;
}
