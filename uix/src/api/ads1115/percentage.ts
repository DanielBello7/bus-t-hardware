import { api } from '@/lib/api';
import { ADS1115_BATTERY_RESPONSE, Res } from '@/types';

type RES = Promise<Res<ADS1115_BATTERY_RESPONSE>>;

export async function ads1115_percentage(): RES {
    const response = await api.get(`/api/ads1115/level`);
    return response.data;
}
