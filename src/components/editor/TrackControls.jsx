import { TRACK_HEADER_WIDTH, TRACK_HEIGHT, timeToPixels } from '@/utils/timeline';
import { Lock, Unlock, Eye, EyeOff, Volume2, VolumeX, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import editorStore from '@/store/editorStore';

function TrackControls({ track }) {
  const { updateTrack, deleteTrack } = editorStore();

  const typeColors = {
    video: 'text-blue-400',
    audio: 'text-purple-400',
    text: 'text-amber-400',
    sticker: 'text-pink-400',
    effect: 'text-cyan-400',
    image: 'text-emerald-400',
  };

  return (
    <div
      className="shrink-0 bg-workspace-850 border-r border-workspace-700 flex flex-col justify-center px-2 gap-1"
      style={{ width: TRACK_HEADER_WIDTH, height: TRACK_HEIGHT }}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium ${typeColors[track.type]} truncate flex-1`}>
          {track.name}
        </span>
      </div>
      <div className="flex items-center gap-0.5">
        <button
          onClick={() => updateTrack(track.id, { muted: !track.muted })}
          className="w-5 h-5 rounded flex items-center justify-center hover:bg-workspace-700 transition-colors"
          title={track.muted ? 'Unmute' : 'Mute'}
        >
          {track.muted ? <VolumeX size={12} className="text-red-400" /> : <Volume2 size={12} className="text-workspace-400" />}
        </button>
        <button
          onClick={() => updateTrack(track.id, { visible: !track.visible })}
          className="w-5 h-5 rounded flex items-center justify-center hover:bg-workspace-700 transition-colors"
          title={track.visible ? 'Hide' : 'Show'}
        >
          {track.visible ? <Eye size={12} className="text-workspace-400" /> : <EyeOff size={12} className="text-workspace-500" />}
        </button>
        <button
          onClick={() => updateTrack(track.id, { locked: !track.locked })}
          className="w-5 h-5 rounded flex items-center justify-center hover:bg-workspace-700 transition-colors"
          title={track.locked ? 'Unlock' : 'Lock'}
        >
          {track.locked ? <Lock size={12} className="text-amber-400" /> : <Unlock size={12} className="text-workspace-400" />}
        </button>
        <button
          onClick={() => deleteTrack(track.id)}
          className="w-5 h-5 rounded flex items-center justify-center hover:bg-red-500/20 transition-colors"
          title="Delete track"
        >
          <Trash2 size={12} className="text-workspace-400 hover:text-red-400" />
        </button>
      </div>
    </div>
  );
}

export default TrackControls;
