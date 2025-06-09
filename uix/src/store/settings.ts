import { create } from 'zustand';

type Settings = {
    connected: boolean;
    url: string;
    links: string[];
};

type Store = {
    data: Settings;
    set_data: (params: Partial<Settings>) => void;
    insert_links: (params: string[]) => void;
    remove_links: (params: string[]) => void;
};

export const useSettings = create<Store>((set, get) => ({
    data: {
        connected: false,
        links: [
            'http://localhost:3000',
            'http://localhost:5500',
            'http://10.0.0.87:5500',
            'http://127.0.0.1:5500',
            'http://10.0.0.188:5500',
        ],
        url: '',
    },
    set_data(params) {
        const current = get().data;
        set({ data: { ...current, ...params } });
    },
    insert_links(params) {
        const current = get().data;

        set({
            data: {
                ...current,
                links: [...new Set([...current.links, ...params])],
            },
        });
    },
    remove_links(params) {
        const current = get().data;
        set({
            data: {
                ...current,
                links: current.links.filter((i) => !params.includes(i)),
            },
        });
    },
}));
