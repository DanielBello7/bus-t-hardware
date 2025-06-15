import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function turn_on_led(): Promise<Res<'on' | 'off'>> {
    const api = getApi();
    const response = await api.get('/api/led/on/');
    return response.data;
}
