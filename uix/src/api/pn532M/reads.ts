import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function read_using_pn532m(
    signal: AbortSignal
): Promise<Res<string>> {
    const api = getApi();
    const response = await api.get('/api/pn532/reads/', { signal });
    return response.data;
}
