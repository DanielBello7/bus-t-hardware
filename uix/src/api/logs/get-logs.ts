import { getApi } from '@/lib/api';
import { Res } from '@/types';
import { LOG } from '@/types/log';

export async function get_logs(): Promise<Res<LOG[]>> {
    const api = getApi();
    const response = await api.get('/api/logs/');
    return response.data;
}
