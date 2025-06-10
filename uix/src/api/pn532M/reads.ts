import { api } from '@/lib/api';
import { Res } from '@/types';

export async function read_using_pn532m(): Promise<Res<string>> {
    const response = await api.get('/api/pn532/reads/');
    return response.data;
}
