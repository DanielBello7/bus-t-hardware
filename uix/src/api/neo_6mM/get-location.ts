import { api } from '@/lib/api';
import { Res } from '@/types';
import { NEO_6MM } from '@/types/neo_6mM';

export async function get_location(): Promise<Res<NEO_6MM>> {
    const response = await api.get('/api/gps/location/');
    return response.data;
}
