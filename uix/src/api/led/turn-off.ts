import { api } from '@/lib/api';
import { Res } from '@/types';

export async function turn_off_led(): Promise<Res<boolean>> {
    const response = await api.get('/api/led/off/');
    return response.data;
}
