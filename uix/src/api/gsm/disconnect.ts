import { api } from '@/lib/api';

export async function disconnect(): Promise<any> {
    const response = await api.get('/api/gsm/disconnect/');
    return response.data;
}
