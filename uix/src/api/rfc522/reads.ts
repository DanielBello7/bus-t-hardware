import { getApi } from '@/lib/api';
import { Res } from '@/types';
import { RFC522 } from '@/types/nfc/rfc522';

export async function read_using_rfc522(
    signal: AbortSignal
): Promise<Res<RFC522>> {
    const api = getApi();
    const response = await api.get('/api/rfc522/reads/', { signal });
    return response.data;
}
