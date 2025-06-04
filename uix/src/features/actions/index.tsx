import { BatteryLevel, Blink, GPS, NFC, Toggle } from './options';
import classnames from 'classnames';

export function Actions() {
  const classes = classnames({
    'w-full h-full grid gap-3 p-3': true,
    'grid-cols-1 grid-rows-1': true,
    'sm:grid-cols-1 grid-rows-1': true,
    'md:grid-cols-2 md:grid-rows-3': true,
    'lg:grid-cols-3 lg:grid-rows-3': true,
    'xl:grid-cols-4 lg:grid-rows-4': true,
  });

  return (
    <div className={classes}>
      <Blink />
      <Toggle />
      <NFC />
      <GPS />
      <BatteryLevel />
    </div>
  );
}
