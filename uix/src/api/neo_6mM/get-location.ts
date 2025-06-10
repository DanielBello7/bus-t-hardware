import { api } from '@/lib/api';

export async function get_location() {
    const response = await api.get('/api/gps/location/');
    return response.data;
}
