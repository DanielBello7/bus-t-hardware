import { getApi } from '@/lib/api';

export async function disconnect(): Promise<any> {
    const api = getApi();
    const response = await api.get('/api/gsm/disconnect/');
    return response.data;
}
