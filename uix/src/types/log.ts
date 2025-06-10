export type LOG = {
    created_at: string;
    value: Record<string, any> & {
        action: string;
        performed_at: string;
        status: boolean;
    };
};
