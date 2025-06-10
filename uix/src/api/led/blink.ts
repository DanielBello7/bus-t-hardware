import { api } from '@/lib/api';

export async function blink_led() {
    const response = await api.get('/api/led/blink/');
    return response.data;
}
