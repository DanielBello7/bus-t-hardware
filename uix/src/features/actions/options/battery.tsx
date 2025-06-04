import { Button } from '@/components';
import { OptionBox } from '../options-box';
import { useState } from 'react';
import { toaster, useSettings } from '@/store';
import { ensure_error } from '@/lib/ensure-error';
import axios from 'axios';
import {
  BatteryLow,
  Battery,
  Loader,
  BatteryMedium,
  BatteryFull,
} from 'lucide-react';

export function BatteryLevel() {
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const settings = useSettings((state) => state);

  const get_percent = () => {
    if (percentage <= 10) {
      return <Battery className="size-8" />;
    }
    if (percentage > 10 && percentage <= 50) {
      return <BatteryLow className="size-8" />;
    }
    if (percentage > 50 && percentage <= 70) {
      return <BatteryMedium className="size-8" />;
    }
    if (percentage > 70 && percentage <= 100) {
      return <BatteryFull className="size-8" />;
    }
  };

  const get_battery = async () => {
    if (!settings.data.connected) {
      return toaster.error('Not connected. Connect to api in settings');
    }

    setIsLoading(true);

    try {
      const response = await axios.get(
        `${settings.data.url}/api/battery/level/`
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
    <OptionBox sub="Battery Level" title="Battery" type="lightbulb">
      <div className="w-full">
        <p>Battery Level</p>
        <div className="border p-5 rounded-sm bg-white my-3">
          <p className="martian-light text-[1.1rem]">{percentage}%</p>
        </div>
        <div className="w-full mt-3 flex items-center">
          <Button
            onClick={get_battery}
            disabled={isLoading && true}
            size={'icon'}
            variant={'outline'}
            className="cursor-pointer p-6 shadow-none rounded-full border-4 border-black"
          >
            {isLoading ? (
              <Loader className="size-8 animate-spin" />
            ) : (
              get_percent()
            )}
          </Button>
          <span className="ms-3 font-black">GET LEVEL</span>
        </div>
      </div>
    </OptionBox>
  );
}
