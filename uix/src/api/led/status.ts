import { api } from '@/lib/api';

export async function led_status() {
    const response = await api.get('/api/led/status/');
    return response.data;
}
