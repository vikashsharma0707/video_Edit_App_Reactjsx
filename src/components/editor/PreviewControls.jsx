import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Maximize, Gauge,
} from 'lucide-react';
import editorStore from '@/store/editorStore';
import { formatTime } from '@/utils/time';
import IconButton from '@/components/common/IconButton';
import Tooltip from '@/components/common/Tooltip';

function PreviewControls() {
  const { isPlaying, togglePlay, currentTime, duration, setCurrentTime, playbackRate, setPlaybackRate } = editorStore();

  const speeds = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="h-10 flex items-center justify-between px-3 bg-workspace-850 border-t border-workspace-700 shrink-0">
      <div className="flex items-center gap-1">
        <Tooltip content="Go to start (Home)" side="top">
          <IconButton icon={SkipBack} label="Start" size={16} onClick={() => setCurrentTime(0)} />
        </Tooltip>
        <Tooltip content="Play / Pause (Space)" side="top">
          <button
            onClick={togglePlay}
            className="w-9 h-9 rounded-full bg-accent-500 hover:bg-accent-600 flex items-center justify-center text-white transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
        </Tooltip>
        <Tooltip content="Go to end (End)" side="top">
          <IconButton icon={SkipForward} label="End" size={16} onClick={() => setCurrentTime(duration)} />
        </Tooltip>
      </div>

      <div className="flex items-center gap-2 font-mono text-xs text-workspace-300">
        <span className="text-accent-400">{formatTime(currentTime, true)}</span>
        <span className="text-workspace-500">/</span>
        <span>{formatTime(duration, true)}</span>
      </div>

      <div className="flex items-center gap-1">
        <Tooltip content="Playback speed" side="top">
          <div className="flex items-center gap-1">
            <Gauge size={14} className="text-workspace-400" />
            <select
              value={playbackRate}
              onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
              className="bg-workspace-800 text-xs text-workspace-200 rounded px-1.5 py-1 border border-workspace-600 focus:outline-none focus:border-accent-500"
            >
              {speeds.map((s) => (
                <option key={s} value={s}>{s}x</option>
              ))}
            </select>
          </div>
        </Tooltip>
        <IconButton
          icon={Volume2}
          label="Volume"
          size={16}
          onClick={() => {
            const videos = document.querySelectorAll('video');
            videos.forEach((v) => (v.muted = !v.muted));
          }}
        />
        <IconButton
          icon={Maximize}
          label="Fullscreen"
          size={16}
          onClick={() => {
            const container = document.querySelector('.preview-container');
            if (container?.requestFullscreen) container.requestFullscreen();
          }}
        />
      </div>
    </div>
  );
}

export default PreviewControls;
