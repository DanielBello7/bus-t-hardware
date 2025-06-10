import { api } from '@/lib/api';

export async function config_gsm(params: Record<string, any>) {
    const response = await api.patch(`/api/gsm/config`, params);
    return response.data;
}
