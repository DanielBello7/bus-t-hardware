import { getApi } from '@/lib/api';
import { LOG } from '@/types/log';

export async function get_logs(): Promise<LOG> {
    const api = getApi();
    const response = await api.get('/api/logs/');
    return response.data;
}
