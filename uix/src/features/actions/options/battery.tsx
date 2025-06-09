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
import { Label } from '@radix-ui/react-label';

export function BatteryLevel() {
  const [isLoading, setIsLoading] = useState(false);
  const [percentage, setPercentage] = useState(0);
  const settings = useSettings((state) => state);

  const get_percent = () => {
    if (percentage <= 10) {
      return <Battery className="size-4" />;
    }
    if (percentage > 10 && percentage <= 50) {
      return <BatteryLow className="size-4" />;
    }
    if (percentage > 50 && percentage <= 70) {
      return <BatteryMedium className="size-4" />;
    }
    if (percentage > 70 && percentage <= 100) {
      return <BatteryFull className="size-4" />;
    }
  };

  const get_battery = async () => {
    if (!settings.data.connected) {
      return toaster.error('Not connected. Connect to api in settings');
    }
    if (isLoading) return;

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
    <OptionBox
      sub="Battery"
      title="Percentage"
      key={'battery'}
      type="lightbulb"
    >
      <div className="w-full">
        <p className="px-2">Get the battery level of the device</p>

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
              get_percent()
            )}
          </Button>
          <Label className="text-md">GET LEVEL</Label>
        </div>

        <div className="p-2 rounded-b bg-white">
          <p className="text-[0.6rem] mb-1 martian-exlight">CHARGE</p>
          <p className="text-lg martian-elight font-bold">{percentage}%</p>
        </div>
      </div>
    </OptionBox>
  );
}
