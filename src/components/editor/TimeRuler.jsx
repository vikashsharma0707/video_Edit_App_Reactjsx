import { TRACK_HEIGHT, TRACK_HEADER_WIDTH, timeToPixels } from '@/utils/timeline';
import { formatTime } from '@/utils/time';

function TimeRuler({ duration, pixelsPerSecond }) {
  // Calculate appropriate interval based on zoom
  const minLabelWidth = 60;
  let interval = 1;
  const pps = pixelsPerSecond;
  if (pps < 5) interval = 60;
  else if (pps < 10) interval = 30;
  else if (pps < 20) interval = 10;
  else if (pps < 50) interval = 5;
  else if (pps < 100) interval = 2;
  else if (pps < 200) interval = 1;
  else interval = 0.5;

  const ticks = [];
  for (let t = 0; t <= duration; t += interval) {
    ticks.push(t);
  }

  // Sub-ticks
  const subInterval = interval / 5;
  const subTicks = [];
  for (let t = 0; t <= duration; t += subInterval) {
    if (!ticks.includes(t)) subTicks.push(t);
  }

  return (
    <div className="relative h-full bg-workspace-850">
      {subTicks.map((t) => (
        <div
          key={`sub-${t}`}
          className="absolute top-3 h-1 w-px bg-workspace-700"
          style={{ left: timeToPixels(t, pps) }}
        />
      ))}
      {ticks.map((t) => (
        <div
          key={t}
          className="absolute top-0 h-full"
          style={{ left: timeToPixels(t, pps) }}
        >
          <div className="h-3 w-px bg-workspace-500" />
          <span className="text-xxs text-workspace-400 font-mono absolute top-3 left-1 whitespace-nowrap">
            {formatTime(t)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default TimeRuler;
