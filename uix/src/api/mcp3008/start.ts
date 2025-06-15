import { Res } from '@/types';
import { getApi } from '@/lib/api';

export async function start_mcp3008(): Promise<
    Res<'listening started' | 'already running'>
> {
    const api = getApi();
    const response = await api.get(`/api/mcp3008/start/`);
    return response.data;
}
