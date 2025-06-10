import { api } from '@/lib/api';
import { Res } from '@/types';

type Params = {
    text: string;
};
export async function write_using_pn532(
    params: Params
): Promise<Res<string>> {
    const response = await api.post('/api/pn532/write/', params);
    return response.data;
}
