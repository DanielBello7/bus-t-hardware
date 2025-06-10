import { api } from '@/lib/api';
import { Res } from '@/types';

export async function stream_gps(): Promise<Res<string>> {
    const response = await api.get('/api/gps/stream/');
    return response.data;
}
