/** NFC PN532 READER */
import { Button, Input } from '@/components';
import { OptionBox } from '../options-box';
import { FormEvent, useRef, useState } from 'react';
import { Loader } from 'lucide-react';
import classnames from 'classnames';
import { toaster, useSettings } from '@/store';
import { ensure_error } from '@/lib/ensure-error';
import axios from 'axios';

export function PN532() {
    const [isReading, setIsReading] = useState(false);
    const [isWriting, setIsWriting] = useState(false);

    const [data, setdata] = useState('');

    /** read abort */
    const rAbort = useRef<AbortController | null>(null);

    /** write abort */
    const wAbort = useRef<AbortController | null>(null);

    const settings = useSettings((state) => state);

    const cancel_r = () => {
        if (rAbort.current) {
            rAbort.current.abort();
            setIsReading(false);
            toaster.error('Cancel Error: Reading Canceled');
        }
    };

    const cancel_w = (e: FormEvent) => {
        e.preventDefault();

        if (wAbort.current) {
            wAbort.current.abort();
            setIsWriting(false);
            toaster.error('Cancel Error: Writing Canceled');
        }
    };

    const r_data = async () => {
        if (settings.data.connected == false) {
            return toaster.error('Connection Error: Not Connected to API');
        }
        if (isReading || isWriting) return;
        setIsReading(true);

        rAbort.current = new AbortController();

        try {
            const response = (
                await axios.get(`${settings.data.url}/api/pn532/read`, {
                    signal: rAbort.current.signal,
                })
            ).data;
            toaster.alert(response.response);
        } catch (e) {
            const err = ensure_error(e);
            toaster.error(`Error Occured: ${err.message}`);
        } finally {
            setIsReading(false);
        }
    };

    const w_data = async (e: FormEvent) => {
        e.preventDefault();

        if (settings.data.connected === false) {
            return toaster.error('Connection Error: Not Connected to API');
        }
        if (!data.trim()) {
            return toaster.error('Input Error: Type in something');
        }
        if (isReading || isWriting) return;
        setIsWriting(true);

        wAbort.current = new AbortController();
        try {
            const response = (
                await axios.post(
                    `${settings.data.url}/api/pn532/write`,
                    {
                        data,
                    },
                    { signal: wAbort.current.signal }
                )
            ).data;
            toaster.alert('Success Writing Data!');
        } catch (e) {
            const err = ensure_error(e);
            toaster.error(`Error Occured: ${err.message}`);
        } finally {
            setIsWriting(false);
        }
    };

    return (
        <OptionBox sub="PN532" title="NFC" type="asscending" key={'NFC'}>
            <div className="w-full flex flex-col">
                <p className="px-2">
                    Read/Write data using the PN532 NFC hardware
                </p>

                <div className="w-full flex items-center space-x-3 mt-3 border-t border-b p-2">
                    <Button
                        className="cursor-pointer"
                        disabled={(isReading || isWriting) && true}
                        type="submit"
                        form="form-2"
                        variant={isWriting ? 'destructive' : 'default'}
                    >
                        {isWriting && <Loader className="animate-spin" />}
                        {isWriting ? 'Cancel' : 'Write'}
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
                    id="form-2"
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
