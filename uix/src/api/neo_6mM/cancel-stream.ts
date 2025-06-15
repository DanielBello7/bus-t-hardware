import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function cancel_stream(): Promise<Res<'streaming stopped'>> {
    const api = getApi();
    const response = await api.get('/api/gps/cancel_stream/');
    return response.data;
}
