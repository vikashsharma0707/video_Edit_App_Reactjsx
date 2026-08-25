import { Type, Plus } from 'lucide-react';
import editorStore from '@/store/editorStore';
import { uid } from '@/utils/time';

const TEXT_PRESETS = [
  { label: 'Title', text: 'Your Title Here', style: { fontSize: 64, fontWeight: 700, color: '#ffffff' } },
  { label: 'Subtitle', text: 'Your Subtitle', style: { fontSize: 36, fontWeight: 500, color: '#e5e7eb' } },
  { label: 'Caption', text: 'Caption text', style: { fontSize: 28, fontWeight: 400, color: '#ffffff', stroke: true, strokeColor: '#000', strokeWidth: 2 } },
  { label: 'Lower Third', text: 'Name / Title', style: { fontSize: 32, fontWeight: 600, color: '#ffffff', align: 'left' } },
  { label: 'Meme', text: 'TOP TEXT', style: { fontSize: 42, fontWeight: 800, color: '#ffffff', stroke: true, strokeColor: '#000', strokeWidth: 4 } },
  { label: 'Social', text: '@username', style: { fontSize: 28, fontWeight: 600, color: '#ffffff', stroke: true, strokeColor: '#ec4899', strokeWidth: 3 } },
  { label: 'Gaming', text: 'GAME ON', style: { fontSize: 48, fontWeight: 800, color: '#10b981', stroke: true, strokeColor: '#000', strokeWidth: 3 } },
  { label: 'Cinematic', text: 'A Story', style: { fontSize: 40, fontWeight: 300, color: '#e5e7eb', italic: true } },
  { label: 'Minimal', text: 'Text', style: { fontSize: 32, fontWeight: 400, color: '#ffffff' } },
  { label: 'Neon', text: 'NEON', style: { fontSize: 48, fontWeight: 700, color: '#06b6d4', shadow: true, shadowBlur: 20, shadowColor: '#06b6d4' } },
];

function TextPanel() {
  const { project, addClip, currentTime } = editorStore();

  const addText = (preset) => {
    const textTrack = project?.tracks.find((t) => t.type === 'text');
    if (!textTrack) return;

    addClip({
      id: uid(),
      trackId: textTrack.id,
      type: 'text',
      name: preset.label,
      text: preset.text,
      textStyle: {
        fontFamily: 'Inter',
        fontSize: preset.style.fontSize || 48,
        fontWeight: preset.style.fontWeight || 700,
        color: preset.style.color || '#ffffff',
        align: preset.style.align || 'center',
        italic: preset.style.italic || false,
        underline: false,
        stroke: preset.style.stroke || false,
        strokeColor: preset.style.strokeColor || '#000000',
        strokeWidth: preset.style.strokeWidth || 2,
        shadow: preset.style.shadow || false,
        shadowBlur: preset.style.shadowBlur || 8,
        shadowColor: preset.style.shadowColor || '#000000',
        shadowOpacity: 0.5,
      },
      start: currentTime,
      duration: 5,
      sourceStart: 0,
      sourceEnd: 5,
      volume: 1,
      speed: 1,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, flipH: false, flipV: false },
      animation: { entrance: 'fade', exit: 'fade', loop: null },
      color: '#f59e0b',
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Text</h3>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto scrollbar-thin flex-1">
        <button
          onClick={() => addText({ label: 'Default', text: 'New Text', style: {} })}
          className="w-full btn btn-secondary justify-center"
        >
          <Plus size={14} />
          Add Text
        </button>

        <div>
          <h4 className="text-xs font-semibold text-workspace-200 mb-2">Text Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            {TEXT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => addText(preset)}
                className="panel p-3 hover:border-accent-500/50 transition-all text-center group"
              >
                <div
                  className="text-sm font-bold mb-1 group-hover:scale-105 transition-transform"
                  style={{
                    color: preset.style.color || '#fff',
                    fontSize: `${Math.min(preset.style.fontSize / 3, 18)}px`,
                    fontWeight: preset.style.fontWeight || 700,
                    fontStyle: preset.style.italic ? 'italic' : 'normal',
                    textShadow: preset.style.shadow ? `0 0 8px ${preset.style.shadowColor}` : 'none',
                    WebkitTextStroke: preset.style.stroke ? `1px ${preset.style.strokeColor}` : 'none',
                  }}
                >
                  {preset.text}
                </div>
                <span className="text-xxs text-workspace-400">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TextPanel;
