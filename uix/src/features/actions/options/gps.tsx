import { ensure_error } from '@/lib/ensure-error';
import { Button } from '@/components';
import { toaster } from '@/store';
import { useState } from 'react';
import { OptionBox } from '../options-box';
import { useSettings } from '@/store';
import { Loader, Locate } from 'lucide-react';
import axios from 'axios';

export function GPS() {
  const [isLoading, setIsLoading] = useState(false);
  const [coords, setCoords] = useState('0.0000,0.0000');
  const settings = useSettings((state) => state);

  const get_location = async () => {
    if (!settings.data.connected) {
      return toaster.error(
        'Not connected. Make connections to api in settings'
      );
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        `${settings.data.url}/api/gps/location/`
      );
      setCoords(response.data.coords);
      toaster.alert('Success!');
    } catch (e) {
      const err = ensure_error(e);
      toaster.error(`Error occured: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OptionBox type="location" title="Location" sub="GPS Location">
      <div className="w-full">
        <p>Get gps location</p>
        <div className="w-full border bg-white p-3 mt-3 rounded-sm">
          <p className="text-[0.7rem] mb-1 martian-exlight">LOCATION</p>
          <p className="text-sm martian-light">{coords}</p>
        </div>
        <div className="w-full mt-3 flex items-center">
          <Button
            onClick={get_location}
            disabled={isLoading && true}
            size={'icon'}
            variant={'outline'}
            className="cursor-pointer p-6 shadow-none rounded-full border-4 border-black"
          >
            {isLoading ? (
              <Loader className="size-8 animate-spin" />
            ) : (
              <Locate className="size-8" />
            )}
          </Button>
          <span className="ms-3 font-black">LOCATE</span>
        </div>
      </div>
    </OptionBox>
  );
}
