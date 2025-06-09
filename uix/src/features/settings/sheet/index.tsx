import { useSettings } from '@/store';
import { Item } from './item';
import {
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Dispatch } from 'react';

type Props = {
    setformdata: Dispatch<
        React.SetStateAction<{
            url: string;
        }>
    >;
};

export function AppSheet(props: Props) {
    const settings = useSettings((state) => state);
    const list = settings.data.links;

    return (
        <SheetContent className="overflow-hidden flex flex-col">
            <SheetHeader>
                <SheetTitle>Saved URL List</SheetTitle>
                <SheetDescription>
                    This contains a list of previously saved urls, you can
                    add to and remove from this list whenever.
                </SheetDescription>
            </SheetHeader>
            <div className="w-full flex flex-col grow overflow-y-scroll p-4 pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                    URL LIST - {list.length}
                </p>
                <br />
                {list.map((i, idx) => (
                    <Item
                        i={i}
                        key={idx}
                        setformdata={props.setformdata}
                    />
                ))}
            </div>
        </SheetContent>
    );
}
