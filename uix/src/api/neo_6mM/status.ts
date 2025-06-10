import { api } from '@/lib/api';

export async function get_gps_status() {
    const response = await api.get('/api/gps/status/');
    return response.data;
}
