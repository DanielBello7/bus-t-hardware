import {
    Card,
    CardHeader,
    CardDescription,
    CardTitle,
    CardFooter,
    Badge,
} from '@/components';
import {
    TrendingUpIcon,
    Lightbulb,
    Navigation,
    Power,
    RectangleEllipsis,
    Map,
} from 'lucide-react';
import React from 'react';

type Props = {
    children?: React.ReactElement | React.ReactElement[];
    title: string;
    sub: string;
    type:
        | 'rectangle-ellipsis'
        | 'lightbulb'
        | 'power'
        | 'navigation'
        | 'location'
        | 'asscending';
};
export function OptionBox(props: Props) {
    const {
        children = [],
        sub = 'sub',
        title = 'title',
        type = 'lightbulb',
    } = props;
    return (
        <Card className="shadow-none rounded-sm bg-slate-50 p-0 gap-3 border-black">
            <CardHeader className="relative p-2 border-b">
                <CardDescription className="text-sm">
                    {sub}
                </CardDescription>
                <CardTitle className="text-lg font-semibold">
                    {title}
                </CardTitle>
                <div className="absolute right-4 top-4">
                    <div className="flex gap-1 text-xs bg-gray-400 text-white size-7 items-center justify-center rounded-full border-4 border-black">
                        {type === 'asscending' && (
                            <TrendingUpIcon className="size-3" />
                        )}
                        {type === 'lightbulb' && (
                            <Lightbulb className="size-3" />
                        )}
                        {type === 'navigation' && (
                            <Navigation className="size-3" />
                        )}
                        {type === 'power' && <Power className="size-3" />}
                        {type === 'location' && <Map className="size-3" />}
                        {type === 'rectangle-ellipsis' && (
                            <RectangleEllipsis className="size-3" />
                        )}
                    </div>
                </div>
            </CardHeader>

            <div className="flex flex-col items-start text-sm p-0">
                {children}
            </div>
        </Card>
    );
}
