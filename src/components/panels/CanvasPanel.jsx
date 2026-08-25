import editorStore from '@/store/editorStore';

const ASPECT_RATIOS = ['16:9', '9:16', '1:1', '4:5', '4:3', '21:9'];
const BG_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#ffffff' },
  { name: 'Gray', value: '#1a1a1a' },
  { name: 'Green', value: '#10b981' },
  { name: 'Blue', value: '#3b82f6' },
];

function CanvasPanel() {
  const { project, updateProject } = editorStore();

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-xs font-semibold text-workspace-200 mb-2">Aspect Ratio</h4>
        <div className="grid grid-cols-3 gap-1">
          {ASPECT_RATIOS.map((ratio) => (
            <button
              key={ratio}
              onClick={() => updateProject((p) => ({ ...p, aspectRatio: ratio }))}
              className={`px-2 py-1.5 rounded text-xs transition-colors ${
                project?.aspectRatio === ratio
                  ? 'bg-accent-500/20 text-accent-400 ring-1 ring-accent-500/30'
                  : 'bg-workspace-800 text-workspace-300 hover:bg-workspace-700'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-workspace-200 mb-2">Background</h4>
        <div className="flex gap-2">
          {BG_COLORS.map((bg) => (
            <button
              key={bg.name}
              onClick={() => updateProject((p) => ({ ...p, settings: { ...p.settings, canvasColor: bg.value } }))}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${
                project?.settings?.canvasColor === bg.value
                  ? 'border-accent-500 scale-110'
                  : 'border-workspace-600'
              }`}
              style={{ backgroundColor: bg.value }}
              title={bg.name}
            />
          ))}
          <input
            type="color"
            value={project?.settings?.canvasColor || '#000000'}
            onChange={(e) => updateProject((p) => ({ ...p, settings: { ...p.settings, canvasColor: e.target.value } }))}
            className="w-8 h-8 rounded-lg border border-workspace-600 cursor-pointer bg-workspace-800"
          />
        </div>
      </div>
    </div>
  );
}

export default CanvasPanel;
