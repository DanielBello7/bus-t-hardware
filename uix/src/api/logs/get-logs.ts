import { api } from '@/lib/api';
import { Res } from '@/types';
import { LOG } from '@/types/log';

export async function get_logs(): Promise<Res<LOG>> {
    const response = await api.get('/api/logs/');
    return response.data;
}
