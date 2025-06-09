/** FOR THE ANALOG TO DIGITAL CONVERTER MCP3008 */
import { Button } from '@/components';
import { OptionBox } from '../options-box';
import { useState } from 'react';
import { toaster, useSettings } from '@/store';
import { ensure_error } from '@/lib/ensure-error';
import axios from 'axios';
import { Loader } from 'lucide-react';
import { Label } from '@radix-ui/react-label';
import { get_percent } from '@/components/percent';

export function MCP3008() {
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
            const response = await axios.get(
                `${settings.data.url}/api/mcp3008/level`
            );
            setPercentage(response.data.percentage);
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
            sub="MCP3008"
            title="ADC"
            key={'battery'}
            type="lightbulb"
        >
            <div className="w-full">
                <p className="px-2">
                    Get the battery level using the MCP3008 ADC
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
