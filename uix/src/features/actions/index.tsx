import { useSidebar } from '@/components';
import {
    ADS1115,
    Blink,
    GPS,
    GSM,
    MCP3008,
    NFC,
    PN532,
    Toggle,
} from './options';
import classnames from 'classnames';

export function Actions() {
    const sidebar = useSidebar();

    const classes = classnames({
        'w-full h-full grid gap-3 p-3': true,
        'grid-cols-1 grid-rows-1': true,
        'sm:grid-cols-1 grid-rows-1': true,
        'md:grid-cols-3 md:grid-rows-3': sidebar.open == false && true,
        'md:grid-cols-2 md:grid-rows-2': sidebar.open == true && true,
        'lg:grid-cols-4 lg:grid-rows-4': sidebar.open == false && true,
        'lg:grid-cols-3 lg:grid-rows-3': sidebar.open == true && true,
        'xl:grid-cols-5 xl:grid-rows-5': true,
    });

    return (
        <div className={classes}>
            <Blink />
            <Toggle />
            <GPS />
            <ADS1115 />
            <NFC />
            <PN532 />
            <MCP3008 />
            <GSM />
        </div>
    );
}
