import {
    Battery,
    BatteryLow,
    BatteryMedium,
    BatteryFull,
} from 'lucide-react';

export const get_percent = (percentage: number) => {
    if (percentage <= 10) {
        return <Battery className="size-4" />;
    } else if (percentage > 10 && percentage <= 50) {
        return <BatteryLow className="size-4" />;
    } else if (percentage > 50 && percentage <= 70) {
        return <BatteryMedium className="size-4" />;
    } else if (percentage > 70 && percentage <= 100) {
        return <BatteryFull className="size-4" />;
    }
};
