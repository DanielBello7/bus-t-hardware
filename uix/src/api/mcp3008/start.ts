import { Res } from '@/types';
import { api } from '@/lib/api';

export async function start_mcp3008(): Promise<Res<string>> {
    const response = await api.get(`/api/mcp3008/start/`);
    return response.data;
}
