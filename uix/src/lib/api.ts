import axios from 'axios';
import { useSettings } from '@/store';

export const getApi = () => {
    const settings = useSettings.getState().data;
    return axios.create({ baseURL: settings.url });
};
