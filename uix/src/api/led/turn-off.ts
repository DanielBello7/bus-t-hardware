import { api } from '@/lib/api';

export async function turn_off_led() {
    const response = await api.get('/api/led/off/');
    return response.data;
}
