import { getApi } from '@/lib/api';
import { Res } from '@/types';
import { RFC522 } from '@/types/nfc/rfc522';

type Params = {
    data: string;
};
export async function write_using_rfc522(
    params: Params,
    signal: AbortSignal
): Promise<Res<RFC522>> {
    const api = getApi();
    const response = await api.post('/api/mfrc522/write/', params, {
        signal,
    });
    return response.data;
}
