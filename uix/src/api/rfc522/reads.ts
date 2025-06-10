import { api } from '@/lib/api';
import { Res } from '@/types';
import { RFC522 } from '@/types/nfc/rfc522';

export async function read_using_rfc522(): Promise<Res<RFC522>> {
    const response = await api.get('/api/rfc522/reads/');
    return response.data;
}
