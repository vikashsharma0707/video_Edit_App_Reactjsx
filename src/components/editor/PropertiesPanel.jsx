import { Move, SlidersHorizontal, Zap, Sparkles, Layers, FlipHorizontal, FlipVertical, RotateCw } from 'lucide-react';
import editorStore from '@/store/editorStore';
import uiStore from '@/store/uiStore';
import Slider from '@/components/common/Slider';
import Button from '@/components/common/Button';
import AdjustPanel from '@/components/panels/AdjustPanel';
import SpeedPanel from '@/components/panels/SpeedPanel';
import AnimationPanel from '@/components/panels/AnimationPanel';

const TABS = [
  { id: 'transform', label: 'Transform', icon: Move },
  { id: 'adjust', label: 'Adjust', icon: SlidersHorizontal },
  { id: 'speed', label: 'Speed', icon: Zap },
  { id: 'animation', label: 'Animation', icon: Sparkles },
];

function PropertiesPanel() {
  const { project, selectedClipId, updateClip, bringForward, sendBackward, bringToFront, sendToBack } = editorStore();
  const { activePropertiesTab, setActivePropertiesTab } = uiStore();
  const clip = project?.clips.find((c) => c.id === selectedClipId);

  if (!clip) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header">
          <h3 className="text-sm font-semibold text-workspace-100">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-xs text-workspace-400 p-4 text-center">
          Select a clip to edit its properties
        </div>
      </div>
    );
  }

  const transform = clip.transform || {};
  const setTransform = (key, value) => {
    updateClip(clip.id, { transform: { ...transform, [key]: value } });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Properties</h3>
        <span className="text-xs text-workspace-400 truncate max-w-[120px]">{clip.name}</span>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-workspace-700 px-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePropertiesTab(tab.id)}
            className={`flex items-center gap-1 px-2 py-2 text-xs font-medium transition-colors ${
              activePropertiesTab === tab.id
                ? 'text-accent-400 border-b-2 border-accent-500'
                : 'text-workspace-300 hover:text-workspace-100'
            }`}
          >
            <tab.icon size={12} />
            <span className="hidden lg:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3">
        {activePropertiesTab === 'transform' && (
          <div className="space-y-3">
            <Slider label="Position X" value={transform.x || 0} min={-500} max={500} step={1} unit="px" onChange={(v) => setTransform('x', v)} />
            <Slider label="Position Y" value={transform.y || 0} min={-500} max={500} step={1} unit="px" onChange={(v) => setTransform('y', v)} />
            <Slider label="Scale" value={transform.scale || 1} min={0.1} max={5} step={0.05} unit="x" onChange={(v) => setTransform('scale', v)} />
            <Slider label="Rotation" value={transform.rotation || 0} min={-180} max={180} step={1} unit="°" onChange={(v) => setTransform('rotation', v)} />
            <Slider label="Opacity" value={transform.opacity ?? 1} min={0} max={1} step={0.05} onChange={(v) => setTransform('opacity', v)} />

            <div className="flex gap-2 pt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setTransform('flipH', !transform.flipH)}
                className={transform.flipH ? 'ring-1 ring-accent-500' : ''}
              >
                <FlipHorizontal size={12} />
                Flip H
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setTransform('flipV', !transform.flipV)}
                className={transform.flipV ? 'ring-1 ring-accent-500' : ''}
              >
                <FlipVertical size={12} />
                Flip V
              </Button>
            </div>

            {/* Layer ordering */}
            <div className="pt-3 border-t border-workspace-700">
              <div className="flex items-center gap-1 mb-2">
                <Layers size={12} className="text-workspace-400" />
                <span className="text-xs font-semibold text-workspace-200">Layer Order</span>
              </div>
              <div className="grid grid-cols-2 gap-1">
                <Button variant="ghost" size="sm" onClick={() => bringToFront(clip.id)}>Front</Button>
                <Button variant="ghost" size="sm" onClick={() => bringForward(clip.id)}>Forward</Button>
                <Button variant="ghost" size="sm" onClick={() => sendBackward(clip.id)}>Backward</Button>
                <Button variant="ghost" size="sm" onClick={() => sendToBack(clip.id)}>Back</Button>
              </div>
            </div>
          </div>
        )}

        {activePropertiesTab === 'adjust' && <AdjustPanel />}
        {activePropertiesTab === 'speed' && <SpeedPanel />}
        {activePropertiesTab === 'animation' && <AnimationPanel />}
      </div>
    </div>
  );
}

export default PropertiesPanel;
