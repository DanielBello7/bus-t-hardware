import { api } from '@/lib/api';

export async function pause_pn532m() {
    const response = await api.get('/api/pn532/pause/');
    return response.data;
}
