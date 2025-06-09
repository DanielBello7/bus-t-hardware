/** FOR THE NFC RFC522 HARDWARE */
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

    const rAbort = useRef<AbortController | null>(null);

    const wAbort = useRef<AbortController | null>(null);

    const settings = useSettings((state) => state);

    /** cancel the read request */
    const cancel_r = () => {
        if (rAbort.current) {
            rAbort.current.abort();
            toaster.error('Cancel Error: Canceled Read Request');
            setIsReading(false);
        }
    };

    /** cancel the write request */
    const cancel_w = (e: FormEvent) => {
        e.preventDefault();

        if (wAbort.current) {
            wAbort.current.abort();
            toaster.error('Cancel Error: Canceled Write Request');
            setIsWriting(false);
        }
    };

    /** read data from card */
    const r_data = async () => {
        if (settings.data.connected == false) {
            return toaster.error('Connection Error: Not Connected to API');
        }

        if (isReading || isWriting) return;

        setIsReading(true);
        rAbort.current = new AbortController();

        try {
            const response = (
                await axios.get(`${settings.data.url}/api/rfc522/read`, {
                    signal: rAbort.current.signal,
                })
            ).data;
            toaster.alert(JSON.stringify(response.response));
        } catch (e) {
            const err = ensure_error(e);
            toaster.error(`Error occured when reading: ${err.message}`);
        } finally {
            setIsReading(false);
            rAbort.current = null;
        }
    };

    /** write data into the card */
    const w_data = async (e: FormEvent) => {
        e.preventDefault();

        if (!settings.data.connected) {
            return toaster.error('Connection Error: Not Connected to API');
        }
        if (!data.trim()) {
            return toaster.error('Cannot write empty data into tag');
        }

        if (isReading || isWriting) return;
        setIsWriting(true);

        wAbort.current = new AbortController();
        try {
            const response = await axios.post(
                `${settings.data.url}/api/rfc522/write`,
                { text: data },
                { signal: wAbort.current.signal }
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
                <p className="px-2">
                    Read/Write data using the RFC522 RFID hat
                </p>

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
                            isReading ? cancel_r() : r_data();
                        }}
                    >
                        {isReading && <Loader className="animate-spin" />}
                        {isReading ? 'Cancel' : 'Read'}
                    </Button>
                </div>

                <form
                    onSubmit={isWriting ? cancel_w : w_data}
                    id="form-1"
                    className="rounded-b flex flex-col pb-0 bg-white"
                >
                    <p className="text-[0.6rem] mb-1 martian-exlight px-2 pt-2">
                        WRITE DATA
                    </p>
                    <Input
                        placeholder="Type Something..."
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
