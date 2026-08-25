import { RotateCcw } from 'lucide-react';
import editorStore from '@/store/editorStore';
import Slider from '@/components/common/Slider';
import Button from '@/components/common/Button';

const FILTERS = [
  { key: 'brightness', label: 'Brightness', min: 0, max: 2, step: 0.05, default: 1, unit: '' },
  { key: 'contrast', label: 'Contrast', min: 0, max: 2, step: 0.05, default: 1, unit: '' },
  { key: 'saturation', label: 'Saturation', min: 0, max: 2, step: 0.05, default: 1, unit: '' },
  { key: 'hue', label: 'Hue', min: 0, max: 360, step: 5, default: 0, unit: '°' },
  { key: 'blur', label: 'Blur', min: 0, max: 20, step: 0.5, default: 0, unit: 'px' },
  { key: 'grayscale', label: 'Grayscale', min: 0, max: 1, step: 0.05, default: 0, unit: '' },
  { key: 'sepia', label: 'Sepia', min: 0, max: 1, step: 0.05, default: 0, unit: '' },
];

function FiltersPanel() {
  const { project, selectedClipId, updateClip } = editorStore();
  const clip = project?.clips.find((c) => c.id === selectedClipId);

  if (!clip) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header">
          <h3 className="text-sm font-semibold text-workspace-100">Filters</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-xs text-workspace-400 p-4 text-center">
          Select a clip to apply filters
        </div>
      </div>
    );
  }

  const filters = clip.filters || {};
  const setFilter = (key, value) => {
    updateClip(clip.id, { filters: { ...filters, [key]: value } });
  };

  const reset = () => {
    const defaults = {};
    FILTERS.forEach((f) => (defaults[f.key] = f.default));
    updateClip(clip.id, { filters: defaults });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Filters</h3>
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw size={12} />
          Reset
        </Button>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto scrollbar-thin flex-1">
        <p className="text-xs text-workspace-400 mb-2">Applied to: {clip.name}</p>
        {FILTERS.map((filter) => (
          <Slider
            key={filter.key}
            label={filter.label}
            value={filters[filter.key] ?? filter.default}
            min={filter.min}
            max={filter.max}
            step={filter.step}
            unit={filter.unit}
            onChange={(v) => setFilter(filter.key, v)}
          />
        ))}
      </div>
    </div>
  );
}

export default FiltersPanel;
