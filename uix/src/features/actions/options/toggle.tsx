import { Label, Button } from '@/components';
import { OptionBox } from '../options-box';
import { Lightbulb, LightbulbOff, Loader } from 'lucide-react';
import classnames from 'classnames';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { toaster, useSettings } from '@/store';
import { ensure_error } from '@/lib/ensure-error';

export function Toggle() {
  const [status, setStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const settings = useSettings((state) => state);

  const get_status = useCallback(async () => {
    if (!settings.data.connected) {
      return setIsFetching(false);
    }
    try {
      setIsFetching(true);
      const response = await axios.get(
        `${settings.data.url}/api/led/status`
      );
      setStatus(response.data.response.status);
    } catch (e) {
      const err = ensure_error(e);
      toaster.error(
        `Error occured when trying to get light status: ${err.message}`
      );
    } finally {
      setIsFetching(false);
    }
  }, [settings.data.url, settings.data.connected]);

  const toggle_light = useCallback(
    async (state: boolean) => {
      if (!settings.data.connected) {
        return toaster.error(
          'Not connected. Make connections to api in settings'
        );
      }
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${settings.data.url}/api/led/${state ? 'on' : 'off'}/`
        );
        if (response.data.response.error) {
          throw new Error(response.data.response.error);
        } else {
          setStatus(response.data.response.status);
        }
      } catch {
        toaster.error(
          `Error occured when trying to turn ${
            state ? 'on' : 'off'
          } lights`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [settings.data.connected, settings.data.url]
  );

  useEffect(() => {
    get_status();
  }, [get_status]);

  return (
    <OptionBox type="lightbulb" title="Toggle" sub="Lights toggle">
      <div className="w-full">
        <p>Toggle the lights on the Raspberry-Pi</p>
        <br />
        <div className="flex items-center space-x-3">
          <Button
            className={classnames(
              'cursor-pointer shadow-none p-6 rounded-full border-4 border-black',
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
              <Loader className="size-3 animate-spin" />
            ) : status ? (
              <Lightbulb className="size-8" />
            ) : (
              <LightbulbOff className="size-8" />
            )}
          </Button>
          <Label className="text-xl font-black">
            {status ? 'LIGHTS ON' : 'LIGHTS OFF'}
          </Label>
        </div>
      </div>
    </OptionBox>
  );
}
