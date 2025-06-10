import { api } from '@/lib/api';

export async function ping(): Promise<any> {
    const response = await api.get(`/ping`);
    return response.data;
}
