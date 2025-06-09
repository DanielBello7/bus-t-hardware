import { Button } from '@/components';
import { OptionBox } from '../options-box';
import { Loader, Power } from 'lucide-react';
import { toaster } from '@/store';
import { Label } from '@/components';
import { useSettings } from '@/store';
import { ensure_error } from '@/lib/ensure-error';
import { useCallback, useState } from 'react';
import axios from 'axios';

export function Blink() {
  const settings = useSettings((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  const blink_lights = useCallback(async () => {
    if (!settings.data.connected) {
      return toaster.error(
        'Not connected to api. Make connection in settings'
      );
    }
    if (isLoading) return;

    try {
      setIsLoading(true);
      const response = (
        await axios.get(`${settings.data.url}/api/led/blink/`)
      ).data;
      if (response.error) throw new Error();
    } catch (e) {
      const err = ensure_error(e);
      toaster.error(
        `Error occured when trying to blink lights: ${err.message}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [settings.data.connected, settings.data.url, isLoading]);

  return (
    <OptionBox key={'blink'} title="LED" type="asscending" sub="Lights">
      <div className="w-full">
        <p className="px-2">Blink the lights on the Raspberry-Pi</p>
        <div className="w-full flex items-center space-x-3 mt-3 border-t border-b p-2">
          <Button
            disabled={isLoading}
            onClick={blink_lights}
            size={'icon'}
            variant={'outline'}
            className="cursor-pointer p-2 shadow-none rounded-full border-2 border-black"
          >
            {isLoading ? (
              <Loader className="size-4 animate-spin" />
            ) : (
              <Power className="size-4" />
            )}
          </Button>
          <Label className="text-md">BLINK LIGHTS</Label>
        </div>
      </div>
    </OptionBox>
  );
}
