import { api } from '@/lib/api';
import { Res } from '@/types';

export async function ping(): Promise<Res<string>> {
    const response = await api.get(`/ping`);
    return response.data;
}
