/** FOR THE ANALOG TO DIGITAL CONVERTER ADS1115 */
import { Button } from '@/components';
import { OptionBox } from '../options-box';
import { useState } from 'react';
import { toaster, useSettings } from '@/store';
import { ensure_error } from '@/lib/ensure-error';
import { Loader } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { get_percent } from '@/components/percent';
import { ads1115_percentage } from '@/api/ads1115';

export function ADS1115() {
    const [isLoading, setIsLoading] = useState(false);
    const [percentage, setPercentage] = useState(0);
    const settings = useSettings((state) => state);

    const get_battery = async () => {
        if (!settings.data.connected) {
            return toaster.error('Connection Error: Not Connected to API');
        }
        if (isLoading) return;

        setIsLoading(true);

        try {
            const response = (await ads1115_percentage()).response;
            setPercentage(response.percentage);
            toaster.alert('Success');
        } catch (e) {
            const err = ensure_error(e);
            toaster.error(`Error occured: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <OptionBox
            sub="ADS1115"
            title="Battery"
            key={'battery'}
            type="lightbulb"
        >
            <div className="w-full">
                <p className="px-2">
                    Get the battery level using the ADS1115
                </p>

                <div className="w-full flex items-center space-x-3 mt-3 border-t border-b p-2">
                    <Button
                        onClick={get_battery}
                        disabled={isLoading && true}
                        size={'icon'}
                        variant={'outline'}
                        className="cursor-pointer p-2 shadow-none rounded-full border-2 border-black"
                    >
                        {isLoading ? (
                            <Loader className="size-6 animate-spin" />
                        ) : (
                            get_percent(percentage)
                        )}
                    </Button>
                    <Label className="text-md">GET LEVEL</Label>
                </div>

                <div className="p-2 rounded-b bg-white">
                    <p className="text-[0.6rem] mb-1 martian-exlight">
                        CHARGE
                    </p>
                    <p className="text-lg martian-elight font-bold">
                        {percentage}%
                    </p>
                </div>
            </div>
        </OptionBox>
    );
}
