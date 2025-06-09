import { toast } from 'sonner';

export const toaster = {
    alert: (msg: string) => {
        toast(msg, {
            position: 'top-center',
            style: {
                backgroundColor: '#2ecc71',
                color: 'white',
                fontWeight: 'bold',
                borderColor: '#2ecc71',
                fontSize: '0.9rem',
            },
        });
    },
    error: (msg: string) => {
        toast(msg, {
            position: 'top-center',
            style: {
                backgroundColor: '#F87171',
                color: 'white',
                fontWeight: 'bold',
                borderColor: '#F87171',
                fontSize: '0.9rem',
            },
        });
    },
};
