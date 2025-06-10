import { api } from '@/lib/api';

export async function turn_on_led() {
    const response = await api.get('/api/led/on/');
    return response.data;
}
