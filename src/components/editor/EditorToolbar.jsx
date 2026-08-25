import {
  Film, Music, Type, Sticker, Sparkles, SlidersHorizontal,
  Wand2, ArrowLeftRight, Zap, Bot,
} from 'lucide-react';
import uiStore from '@/store/uiStore';
import Tooltip from '@/components/common/Tooltip';

const PANELS = [
  { id: 'media', icon: Film, label: 'Media' },
  { id: 'audio', icon: Music, label: 'Audio' },
  { id: 'text', icon: Type, label: 'Text' },
  { id: 'stickers', icon: Sticker, label: 'Stickers' },
  { id: 'effects', icon: Sparkles, label: 'Effects' },
  { id: 'filters', icon: SlidersHorizontal, label: 'Filters' },
  { id: 'transitions', icon: ArrowLeftRight, label: 'Transitions' },
  { id: 'animation', icon: Zap, label: 'Animation' },
  { id: 'ai', icon: Bot, label: 'AI' },
];

function EditorToolbar() {
  const { activePanel, setActivePanel } = uiStore();

  return (
    <nav className="w-14 bg-workspace-900 border-r border-workspace-700 flex flex-col items-center py-2 gap-1 shrink-0">
      {PANELS.map((panel) => (
        <Tooltip key={panel.id} content={panel.label} side="right">
          <button
            onClick={() => setActivePanel(panel.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-150 ${
              activePanel === panel.id
                ? 'bg-accent-500/20 text-accent-400 ring-1 ring-accent-500/30'
                : 'text-workspace-400 hover:bg-workspace-800 hover:text-workspace-200'
            }`}
            aria-label={panel.label}
          >
            <panel.icon size={20} />
          </button>
        </Tooltip>
      ))}
    </nav>
  );
}

export default EditorToolbar;
