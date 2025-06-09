import { create } from 'zustand';

type Sheet = {
    open: boolean;
};

type Store = {
    data: Sheet;
    set_data: (params: Partial<Sheet>) => void;
    toggle_sheet: (params: boolean) => void;
    show_sheet: () => void;
    hide_sheet: () => void;
};

export const useSheet = create<Store>((set, get) => ({
    data: {
        open: false,
    },
    set_data(params) {
        const current = get().data;
        set({ data: { ...current, ...params } });
    },
    toggle_sheet(params) {
        const current = get().data;
        set({ data: { ...current, open: params } });
    },
    hide_sheet() {
        const current = get().data;
        set({ data: { ...current, open: false } });
    },
    show_sheet() {
        const current = get().data;
        set({ data: { ...current, open: true } });
    },
}));
