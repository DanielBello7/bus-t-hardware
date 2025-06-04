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
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${settings.data.url}/api/led/blink/`
      );
      if (response.data.response.error) {
        throw new Error();
      }
    } catch (e) {
      const err = ensure_error(e);
      toaster.error(
        `Error occured when trying to blink lights: ${err.message}`
      );
    } finally {
      setIsLoading(false);
    }
  }, [settings.data.connected, settings.data.url]);

  return (
    <OptionBox
      key={'blink'}
      title="Blink"
      type="asscending"
      sub="Lights Blink"
    >
      <div className="w-full">
        <p>Blink the lights on the Raspberry-Pi</p>
        <br />
        <div className="w-full flex items-center space-x-3">
          <Button
            disabled={isLoading}
            onClick={blink_lights}
            size={'icon'}
            variant={'outline'}
            className="cursor-pointer p-6 shadow-none rounded-full border-4 border-black"
          >
            {isLoading ? (
              <Loader className="size-3 animate-spin" />
            ) : (
              <Power className="size-8" />
            )}
          </Button>
          <Label className="text-xl font-black">BLINK LIGHTS</Label>
        </div>
      </div>
    </OptionBox>
  );
}
