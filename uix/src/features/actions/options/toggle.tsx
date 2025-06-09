import { Label, Button } from '@/components';
import { OptionBox } from '../options-box';
import { Lightbulb, LightbulbOff, Loader } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toaster, useSettings } from '@/store';
import { ensure_error } from '@/lib/ensure-error';
import classnames from 'classnames';
import axios from 'axios';

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
      if (isLoading) return;

      try {
        setIsLoading(true);
        const response = (
          await axios.get(
            `${settings.data.url}/api/led/${state ? 'on' : 'off'}/`
          )
        ).data;
        if (response.error) {
          throw new Error(response.error);
        } else {
          setStatus(response.status);
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
    [settings.data.connected, settings.data.url, isLoading]
  );

  useEffect(() => {
    get_status();
  }, [get_status]);

  return (
    <OptionBox type="lightbulb" title="LED" sub="Lights" key={'toggle'}>
      <div className="w-full">
        <p className="px-2">Toggle the lights on the Raspberry-Pi</p>
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
