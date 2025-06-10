import { getApi } from '@/lib/api';

export async function config_gsm(params: Record<string, any>) {
    const api = getApi();
    const response = await api.patch(`/api/gsm/config`, params);
    return response.data;
}
