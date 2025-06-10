import { getApi } from '@/lib/api';
import { MCP3008_BATTERY_RESPONSE, Res } from '@/types';

type RES = Promise<Res<MCP3008_BATTERY_RESPONSE>>;

export async function mcp3008_percentage(): RES {
    const api = getApi();
    const response = await api.get(`/api/mcp3008/level/`);
    return response.data;
}
