import { api } from '@/lib/api';
import { Res } from '@/types';
import { NEO_6MM } from '@/types/neo_6mM';

export async function get_last_saved(): Promise<Res<NEO_6MM>> {
    const response = await api.get('/api/gps/last_saved/');
    return response.data;
}
