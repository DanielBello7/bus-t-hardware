import { Label, Button } from '@/components';
import { OptionBox } from '../options-box';
import { Lightbulb, LightbulbOff, Loader } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toaster, useSettings } from '@/store';
import { ensure_error } from '@/lib/ensure-error';
import classnames from 'classnames';
import { led_status, turn_off_led, turn_on_led } from '@/api/led';

export function Toggle() {
    const [status, setStatus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);

    const settings = useSettings((state) => state);

    const get_status = useCallback(async () => {
        if (settings.data.connected === false) {
            return setIsFetching(false);
        }

        setIsFetching(true);

        try {
            const response = (await led_status()).response;
            setStatus(response);
        } catch (e) {
            const err = ensure_error(e);
            toaster.error(
                `Error occured when trying to get light status: ${err.message}`
            );
        } finally {
            setIsFetching(false);
        }
    }, [isFetching, settings.data.connected]);

    const toggle_light = async (params: boolean) => {
        if (settings.data.connected == false) {
            return toaster.error('Connection Error: Not Connected to API');
        }
        if (isLoading) return;

        setIsLoading(true);
        try {
            let response;
            if (params === true) response = (await turn_on_led()).response;
            else response = (await turn_off_led()).response;
            setStatus(response);
        } catch {
            toaster.error(
                `Error occured when trying to turn ${
                    params ? 'on' : 'off'
                } lights`
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        get_status();
    }, [get_status]);

    return (
        <OptionBox
            type="lightbulb"
            title="LED"
            sub="Lights"
            key={'toggle'}
        >
            <div className="w-full">
                <p className="px-2">Toggle the lights on header pin 17</p>
                <div className="w-full flex items-center space-x-3 mt-3 border-t border-b p-2">
                    <Button
                        className={classnames(
                            'cursor-pointer shadow-none p-2 rounded-full border-2 border-black',
                            {
                                'bg-amber-100': status,
                                'bg-stone-100': !status,
                            }
                        )}
                        size={'icon'}
                        variant={'outline'}
                        onClick={() => toggle_light(!status)}
                        disabled={isLoading || isFetching}
                    >
                        {isLoading || isFetching ? (
                            <Loader className="size-4 animate-spin" />
                        ) : status ? (
                            <Lightbulb className="size-4" />
                        ) : (
                            <LightbulbOff className="size-4" />
                        )}
                    </Button>
                    <Label className="text-md">
                        {status ? 'LIGHTS ON' : 'LIGHTS OFF'}
                    </Label>
                </div>
            </div>
        </OptionBox>
    );
}
