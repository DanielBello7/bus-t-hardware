import { FormEvent, useRef, useState } from 'react';
import { OptionBox } from '../options-box';
import { useSettings } from '@/store';
import { toaster } from '@/store';
import { ensure_error } from '@/lib/ensure-error';
import { Button, Input } from '@/components';
import { Loader } from 'lucide-react';
import axios from 'axios';
import classnames from 'classnames';

export function NFC() {
  const [isReading, setIsReading] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  const [data, setdata] = useState('');

  const abortRef = useRef<AbortController | null>(null);

  const settings = useSettings((state) => state);

  /** cancel the read request */
  const cancel_read = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      toaster.error('Read canceled');
      setIsReading(false);
    }
  };

  /** read data from card */
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
      const response = (
        await axios.get(`${settings.data.url}/api/nfc/read`, {
          signal: abortRef.current.signal,
        })
      ).data;
      toaster.alert(JSON.stringify(response.response));
    } catch (e) {
      const err = ensure_error(e);
      toaster.error(`Error occured when reading: ${err.message}`);
    } finally {
      setIsReading(false);
      abortRef.current = null;
    }
  };

  /** write data into the card */
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
        `${settings.data.url}/api/nfc/write`,
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
    <OptionBox
      type="rectangle-ellipsis"
      title="NFC"
      sub="RFC522"
      key={'NFC'}
    >
      <div className="w-full flex flex-col">
        <p className="px-2">Read/Write data using the NFC protocol</p>

        <div className="w-full flex items-center space-x-3 mt-3 border-t border-b p-2">
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

        <form
          onSubmit={w_data}
          id="form-1"
          className="border rounded-b flex flex-col pb-0 bg-white"
        >
          <p className="text-[0.6rem] mb-1 martian-exlight px-2 pt-2">
            CHARGE
          </p>
          <Input
            placeholder="Write Data..."
            title="write-data"
            name="write-data"
            className="w-full shadow-none martian-thin bg-white border-0"
            value={data}
            disabled={(isReading || isWriting) && true}
            onChange={(e) => {
              const text = e.currentTarget.value;
              setdata(text);
            }}
          />
        </form>
      </div>
    </OptionBox>
  );
}
