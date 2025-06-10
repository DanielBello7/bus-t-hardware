import { api } from '@/lib/api';

export async function connect_gsm(): Promise<any> {
    const response = await api.get('/api/gsm/connect/');
    return response.data;
}
