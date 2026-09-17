import { cn } from '../../lib/cn';

export default function AnimatedFruit({
  Fruit,
  className,
  delay = '0s',
  duration = '4s',
  rotate = 0,
}) {
  return (
    <div
      className={cn('pointer-events-none', className)}
      style={{ animation: `float ${duration} ease-in-out ${delay} infinite` }}
    >
      <Fruit
        className="h-full w-full drop-shadow-xl"
        style={{ transform: `rotate(${rotate}deg)` }}
      />
    </div>
  );
}
