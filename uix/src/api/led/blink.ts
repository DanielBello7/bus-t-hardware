import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function blink_led(): Promise<Res<'blinking'>> {
    const api = getApi();
    const response = await api.get('/api/led/blink/');
    return response.data;
}
