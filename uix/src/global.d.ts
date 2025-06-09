export {};

declare global {
    interface Window {
        myApi: {
            desktop: boolean;
            title: (params: string) => void;
            close: () => void;
            start: () => void;
        };
    }
}
