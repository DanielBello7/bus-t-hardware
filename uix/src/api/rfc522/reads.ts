import { api } from '@/lib/api';

export async function read_using_rfc522() {
    const response = await api.get('/api/rfc522/reads/');
    return response.data;
}
