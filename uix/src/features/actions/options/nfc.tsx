import { FormEvent, useRef, useState } from 'react';
import { OptionBox } from '../options-box';
import { useSettings } from '@/store';
import { toaster } from '@/store';
import { ensure_error } from '@/lib/ensure-error';
import { Button, Input, Label } from '@/components';
import { Loader } from 'lucide-react';
import axios from 'axios';
import classnames from 'classnames';

export function NFC() {
  const [isReading, setIsReading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  const [data, setdata] = useState('');

  const abortRef = useRef<AbortController | null>(null);

  const settings = useSettings((state) => state);

  const cancel_read = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      toaster.error('Read canceled');
      setIsReading(false);
    }
  };

  const r_data = async () => {
    if (!settings.data.connected) {
      return toaster.error(
        'Not connected. Connect to api through settings'
      );
    }

    if (isReading || isWriting) return;

    setIsReading(true);
    abortRef.current = new AbortController();

    try {
      const response = await axios.get(
        `${settings.data.url}/api/nfc/read/`,
        {
          signal: abortRef.current.signal,
        }
      );
      toaster.alert(JSON.stringify(response.data.msg));
    } catch (e) {
      const err = ensure_error(e);
      toaster.error(`Error occured when reading: ${err.message}`);
    } finally {
      setIsReading(false);
      abortRef.current = null;
    }
  };

  const w_data = async (e: FormEvent) => {
    e.preventDefault();

    if (!settings.data.connected) {
      return toaster.error(
        'Not connected. Connect to api through settings'
      );
    }

    if (isReading || isWriting) return;

    if (!data.trim()) {
      return toaster.error('Cannot write empty data into tag');
    }

    setIsWriting(true);
    try {
      const response = await axios.post(
        `${settings.data.url}/api/nfc/write/`,
        {
          text: data,
        }
      );
      toaster.alert(response.data.msg);
    } catch (e) {
      const err = ensure_error(e);
      toaster.error(`Error occured when writing: ${err.message}`);
    } finally {
      setIsWriting(false);
    }
  };

  return (
    <OptionBox type="rectangle-ellipsis" title="Scanner" sub="NFC rc500">
      <div className="w-full">
        <p>Read/Write NFC</p>
        <form onSubmit={w_data} className="mt-3" id="form-1">
          <Label className="martian-thin mb-3">Write Data</Label>
          <Input
            placeholder="Type something..."
            title="write-data"
            name="write-data"
            className="w-full shadow-none martian-thin bg-white"
            value={data}
            disabled={(isReading || isWriting) && true}
            onChange={(e) => {
              const text = e.currentTarget.value;
              setdata(text);
            }}
          />
        </form>

        <div className="grid grid-cols-2 items-center justify-between gap-4 mt-3">
          <Button
            className="cursor-pointer"
            disabled={(isReading || isWriting) && true}
            type="submit"
            form="form-1"
          >
            {isWriting && <Loader className="animate-spin" />}
            Write
          </Button>
          <Button
            className={classnames({
              'cursor-pointer': true,
              'bg-blue-700': !isReading,
            })}
            disabled={isWriting && true}
            variant={isReading ? 'destructive' : 'default'}
            onClick={() => {
              isReading ? cancel_read() : r_data();
            }}
          >
            {isReading && <Loader className="animate-spin" />}
            {isReading ? 'Cancel' : 'Read'}
          </Button>
        </div>
      </div>
    </OptionBox>
  );
}
