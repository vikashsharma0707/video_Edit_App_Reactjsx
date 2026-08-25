import { RotateCcw } from 'lucide-react';
import editorStore from '@/store/editorStore';
import Slider from '@/components/common/Slider';
import Button from '@/components/common/Button';

const ADJUSTMENTS = [
  { key: 'exposure', label: 'Exposure', min: -100, max: 100, step: 1, default: 0 },
  { key: 'brightness', label: 'Brightness', min: 0, max: 200, step: 1, default: 100, unit: '%' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 200, step: 1, default: 100, unit: '%' },
  { key: 'saturation', label: 'Saturation', min: 0, max: 200, step: 1, default: 100, unit: '%' },
  { key: 'highlights', label: 'Highlights', min: -100, max: 100, step: 1, default: 0 },
  { key: 'shadows', label: 'Shadows', min: -100, max: 100, step: 1, default: 0 },
  { key: 'temperature', label: 'Temperature', min: -100, max: 100, step: 1, default: 0 },
  { key: 'tint', label: 'Tint', min: -100, max: 100, step: 1, default: 0 },
  { key: 'sharpness', label: 'Sharpness', min: 0, max: 100, step: 1, default: 0 },
  { key: 'fade', label: 'Fade', min: 0, max: 100, step: 1, default: 0 },
  { key: 'vignette', label: 'Vignette', min: 0, max: 100, step: 1, default: 0 },
];

function AdjustPanel() {
  const { project, selectedClipId, updateClip } = editorStore();
  const clip = project?.clips.find((c) => c.id === selectedClipId);

  if (!clip) {
    return (
      <div className="flex-1 flex items-center justify-center text-xs text-workspace-400 p-4 text-center">
        Select a clip to adjust
      </div>
    );
  }

  const adjustments = clip.adjustments || {};
  const setAdjustment = (key, value) => {
    updateClip(clip.id, { adjustments: { ...adjustments, [key]: value } });
  };

  const reset = () => {
    const defaults = {};
    ADJUSTMENTS.forEach((a) => (defaults[a.key] = a.default));
    updateClip(clip.id, { adjustments: defaults });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-workspace-400">Adjustments</span>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw size={12} />
          Reset
        </Button>
      </div>
      {ADJUSTMENTS.map((adj) => (
        <Slider
          key={adj.key}
          label={adj.label}
          value={adjustments[adj.key] ?? adj.default}
          min={adj.min}
          max={adj.max}
          step={adj.step}
          unit={adj.unit || ''}
          onChange={(v) => setAdjustment(adj.key, v)}
        />
      ))}
    </div>
  );
}

export default AdjustPanel;
