import { getApi } from '@/lib/api';
import { Res } from '@/types';

type Params = {
    data: string;
};
export async function write_using_rfc522(
    params: Params,
    signal: AbortSignal
): Promise<Res<string>> {
    const api = getApi();
    const response = await api.post('/api/rfc522/write/', params, {
        signal,
    });
    return response.data;
}
