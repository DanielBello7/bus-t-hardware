import { getApi } from '@/lib/api';
import { Res } from '@/types';

export async function pause_mcp3008(): Promise<
    Res<'listening stopped' | 'not running'>
> {
    const api = getApi();
    const response = await api.get(`/api/mcp3008/pause/`);
    return response.data;
}
