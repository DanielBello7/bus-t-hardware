/** GETTING GPS COORDINATES USING THE NEO-6M */
import { ensure_error } from '@/lib/ensure-error';
import { Button } from '@/components';
import { toaster } from '@/store';
import { Label } from '@radix-ui/react-label';
import { useSettings } from '@/store';
import { useState } from 'react';
import { OptionBox } from '../options-box';
import { Loader, Locate } from 'lucide-react';
import { get_location as get_current_location } from '@/api/neo_6mM';

export function GPS() {
    const [isLoading, setIsLoading] = useState(false);
    const [coords, setCoords] = useState('0.0000,0.0000');
    const settings = useSettings((state) => state);

    const get_location = async () => {
        if (!settings.data.connected) {
            return toaster.error('Connection Error: Not Connected to API');
        }
        if (isLoading) return;

        setIsLoading(true);
        try {
            const response = (await get_current_location()).response;
            setCoords(`${response.latitude}, ${response.longitude}`);
            toaster.alert('Success!');
        } catch (e) {
            const err = ensure_error(e);
            toaster.error(`Error occured: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <OptionBox
            type="location"
            title="GPS"
            sub="NEO-6M"
            key={'LOCATION'}
        >
            <div className="w-full">
                <p className="px-2">Get the location using NEO-6M</p>

                <div className="w-full flex items-center space-x-3 mt-3 border-t border-b p-2">
                    <Button
                        onClick={get_location}
                        disabled={isLoading && true}
                        size={'icon'}
                        variant={'outline'}
                        className="cursor-pointer p-2 shadow-none rounded-full border-2 border-black"
                    >
                        {isLoading ? (
                            <Loader className="size-4 animate-spin" />
                        ) : (
                            <Locate className="size-4" />
                        )}
                    </Button>
                    <Label className="text-md">LOCATE</Label>
                </div>

                <div className="w-full bg-white p-2 border rounded-b">
                    <p className="text-[0.6rem] mb-1 martian-exlight">
                        LOCATION
                    </p>
                    <p className="text-lg martian-elight font-bold truncate">
                        {coords}
                    </p>
                </div>
            </div>
        </OptionBox>
    );
}
