import { api } from '@/lib/api';

export async function read_using_pn532m() {
    const response = await api.get('/api/pn532/reads/');
    return response.data;
}
