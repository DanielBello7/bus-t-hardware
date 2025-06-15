import { getApi } from '@/lib/api';
import { Res } from '@/types';

type Params = {
    data: string;
};
export async function write_using_pn532(
    params: Params,
    signal: AbortSignal
): Promise<Res<string>> {
    const api = getApi();
    const response = await api.post('/api/pn532/write/', params, {
        signal,
    });
    return response.data;
}
