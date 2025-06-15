import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function stream_gps(): Promise<Res<'streaming started'>> {
    const api = getApi();
    const response = await api.get('/api/gps/stream/');
    return response.data;
}
