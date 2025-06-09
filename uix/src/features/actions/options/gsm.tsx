import { useSettings } from '@/store';
import { OptionBox } from '../options-box';

export function GSM() {
    const settings = useSettings((state) => state);
    return (
        <OptionBox sub="SIM800L" title="GSM" type="lightbulb" key={'gsm'}>
            <div className="w-full">
                <p className="px-2">Connect using the SIM800L module</p>
            </div>
        </OptionBox>
    );
}
