import { ArrowLeftRight } from 'lucide-react';

const TRANSITIONS = [
  { name: 'Fade', icon: '◐', type: 'fade' },
  { name: 'Dissolve', icon: '◯', type: 'dissolve' },
  { name: 'Slide Left', icon: '⬅️', type: 'slide_left' },
  { name: 'Slide Right', icon: '➡️', type: 'slide_right' },
  { name: 'Slide Up', icon: '⬆️', type: 'slide_up' },
  { name: 'Slide Down', icon: '⬇️', type: 'slide_down' },
  { name: 'Zoom', icon: '🔍', type: 'zoom' },
  { name: 'Wipe', icon: '🧹', type: 'wipe' },
  { name: 'Blur', icon: '🌫️', type: 'blur' },
  { name: 'Glitch', icon: '📺', type: 'glitch' },
];

function TransitionPanel() {
  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Transitions</h3>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto scrollbar-thin flex-1">
        <p className="text-xs text-workspace-400">
          Drag a transition between two clips on the timeline.
        </p>
        <div className="grid grid-cols-2 gap-2">
          {TRANSITIONS.map((t) => (
            <div
              key={t.name}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('application/json', JSON.stringify({
                  type: 'transition',
                  transitionType: t.type,
                  name: t.name,
                }));
              }}
              className="group panel p-2 hover:border-accent-500/50 transition-all cursor-grab"
            >
              <div className="aspect-video bg-workspace-800 rounded flex items-center justify-center text-2xl mb-1">
                {t.icon}
              </div>
              <span className="text-xs text-workspace-200">{t.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TransitionPanel;
