import { Button } from '@/components';
import { useSheet } from '../use-sheet';
import { useSettings } from '@/store';
import { CircleX } from 'lucide-react';
import { Dispatch } from 'react';

type Props = {
    i: string;
    setformdata: Dispatch<
        React.SetStateAction<{
            url: string;
        }>
    >;
};

export function Item(props: Props) {
    const sheet = useSheet((state) => state);
    const settings = useSettings((state) => state);
    return (
        <div className="w-full flex items-center justify-between border rounded-sm bg-gray-100 mb-4 hover:bg-gray-200 cursor-pointer">
            <p
                className="text-sm martian-light w-full p-3.5 flex flex-col"
                onClick={() => {
                    props.setformdata({ url: props.i });
                    sheet.hide_sheet();
                }}
            >
                <span className="text-[0.5rem] martian-thin">
                    SERVER ADDRESS
                </span>
                <span>{props.i}</span>
            </p>
            <Button
                onClick={() => settings.remove_links([props.i])}
                size={'icon'}
                className="shadow-none me-3"
                variant={'outline'}
            >
                <CircleX />
            </Button>
        </div>
    );
}
