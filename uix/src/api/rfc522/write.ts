import { api } from '@/lib/api';
import { Res } from '@/types';

type Params = {
    text: string;
};
export async function write_using_rfc522(
    params: Params,
    signal: AbortSignal
): Promise<Res<string>> {
    const response = await api.post('/api/rfc522/write/', params, {
        signal,
    });
    return response.data;
}
