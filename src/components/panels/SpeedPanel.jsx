import editorStore from '@/store/editorStore';
import Slider from '@/components/common/Slider';

const SPEED_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2, 4];

function SpeedPanel() {
  const { project, selectedClipId, updateClip } = editorStore();
  const clip = project?.clips.find((c) => c.id === selectedClipId);

  if (!clip) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-workspace-400 p-4 text-center">
        Select a clip to adjust speed
      </div>
    );
  }

  const speed = clip.speed || 1;

  return (
    <div className="space-y-3">
      <span className="text-xs text-workspace-400">Speed — {clip.name}</span>
      <div className="grid grid-cols-4 gap-1">
        {SPEED_PRESETS.map((s) => (
          <button
            key={s}
            onClick={() => updateClip(clip.id, { speed: s })}
            className={`px-2 py-1.5 rounded text-xs transition-colors ${
              speed === s
                ? 'bg-accent-500/20 text-accent-400 ring-1 ring-accent-500/30'
                : 'bg-workspace-800 text-workspace-300 hover:bg-workspace-700'
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
      <Slider
        label="Custom Speed"
        value={speed}
        min={0.25}
        max={4}
        step={0.25}
        unit="x"
        onChange={(v) => updateClip(clip.id, { speed: v })}
      />
      <div className="pt-2 border-t border-workspace-700 space-y-2">
        <p className="text-xs text-workspace-400">Duration: {clip.duration.toFixed(1)}s</p>
        <button
          onClick={() => updateClip(clip.id, { speed: 1 })}
          className="w-full btn btn-secondary text-xs"
        >
          Reset to 1x
        </button>
      </div>
    </div>
  );
}

export default SpeedPanel;
