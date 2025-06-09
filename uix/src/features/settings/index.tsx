import { Button } from '@/components/ui/button';
import { FormEvent, useCallback, useState } from 'react';
import { Input } from '@/components/ui/input';
import { ensure_error } from '@/lib/ensure-error';
import { Ellipsis, Save } from 'lucide-react';
import { Sheet, SheetTrigger } from '@/components/ui/sheet';
import { useSheet } from './use-sheet';
import { useSettings } from '@/store';
import { toaster } from '@/store';
import { AppSheet } from './sheet';
import z from 'zod';
import axios from 'axios';

type API_RES = {
  response: string;
};

const schema = z.object({
  url: z.string().url().nonempty(),
});

const initial = {
  url: '',
};

export function Settings() {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [error, setError] = useState<Error>();
  const [formdata, setformdata] = useState<typeof initial>(initial);

  const sheet = useSheet((state) => state);
  const settings = useSettings((state) => state);

  const get_data = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setIsError(false);
      setIsLoading(true);

      try {
        schema.parse(formdata);
        const response = await axios.get(`${formdata.url}/ping`);
        const res = response.data as unknown as API_RES;
        if (res.response === 'ping') {
          toaster.alert('Connected');
          settings.set_data({ url: formdata.url, connected: true });
        } else throw new Error(`error connecting`);
      } catch (e) {
        const err = ensure_error(e);
        setIsError(true);
        setError(err);
        toaster.error(`Error occured: ${err.message}`);
        settings.set_data({ connected: false });
      } finally {
        setIsLoading(false);
      }
    },
    [settings.data.url, formdata]
  );

  return (
    <Sheet onOpenChange={sheet.toggle_sheet} open={sheet.data.open}>
      <div className="w-full h-full p-3 flex flex-col">
        <div className="w-[400px] flex flex-col space-y-3">
          <p className="martian-light text-md">SERVER URL</p>
          <p className="martian-thin">
            Enter the address for the server to start the application
          </p>
          <form onSubmit={get_data}>
            <Input
              type="text"
              onChange={(e) => {
                const text = e.currentTarget.value;
                setformdata({ url: text });
              }}
              value={formdata.url}
              placeholder="http://localhost:5500"
              name="url"
              required={true}
              className="mb-3 martian-light"
            />
            <Button variant={'default'} className="w-full cursor-pointer">
              Submit
            </Button>
          </form>
          <div className="w-full items-center grid grid-cols-2 gap-3">
            <Button
              variant={'secondary'}
              size={'icon'}
              className="cursor-pointer w-full border"
              onClick={() => {
                if (!formdata.url.trim()) return;
                settings.insert_links([formdata.url]);
                toaster.alert('URL Saved');
              }}
            >
              <Save />
              <span>Save</span>
            </Button>
            <SheetTrigger>
              <Button
                variant={'secondary'}
                size={'icon'}
                className="cursor-pointer w-full border"
              >
                <Ellipsis />
                <span>More</span>
              </Button>
            </SheetTrigger>
          </div>
          <div className="w-full">
            <Button
              className="w-full cursor-pointer"
              variant={'destructive'}
              onClick={() => {
                window.myApi.close();
              }}
            >
              Close App
            </Button>
          </div>
          {/* <div className="w-full">
            <Button
              className="w-full cursor-pointer"
              variant={'link'}
              onClick={() => {
                window.myApi.start();
              }}
            >
              Run Server
            </Button>
          </div> */}
        </div>
      </div>
      <AppSheet setformdata={setformdata} />
    </Sheet>
  );
}
