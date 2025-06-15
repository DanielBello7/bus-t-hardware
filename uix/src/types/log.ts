export type LOG = {
    docs: {
        created_at: string;
        value: Record<string, any> & {
            action: string;
            performed_at: string;
            status: boolean;
        };
    }[];
    total: number;
    limit: number;
    page: number;
    pages: number; // total number of pages
};
