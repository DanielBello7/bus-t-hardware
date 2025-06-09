import { useSettings } from '@/store';
import { SidebarTrigger } from './ui';
import { Circle } from 'lucide-react';
import classnames from 'classnames';

export function Header() {
    const settings = useSettings((state) => state);
    return (
        <div className="border-b p-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <SidebarTrigger className="size-10" />
                    <p className="text-xl">BUS-T BUS-UNIT</p>
                </div>
                <div
                    className={classnames({
                        'flex items-center gap-1 border rounded-full':
                            true,
                        'bg-red-500': !settings.data.connected,
                        'bg-green-500': settings.data.connected,
                    })}
                >
                    <Circle
                        size={34}
                        className={classnames({
                            'text-red-500': !settings.data.connected,
                            'text-green-500': settings.data.connected,
                        })}
                    />
                </div>
            </div>
        </div>
    );
}
