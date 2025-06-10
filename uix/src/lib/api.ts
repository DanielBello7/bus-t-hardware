import axios from 'axios';
import { useSettings } from '@/store';

const settings = useSettings.getState().data;
export const api = axios.create({ baseURL: settings.url });
