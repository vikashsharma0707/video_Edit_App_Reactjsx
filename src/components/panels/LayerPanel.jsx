import { ChevronUp, ChevronDown, ChevronsUpDown, Eye, EyeOff, Lock, Unlock } from 'lucide-react';
import editorStore from '@/store/editorStore';

function LayerPanel() {
  const { project, selectedClipId, selectClip, bringForward, sendBackward, bringToFront, sendToBack, updateClip } = editorStore();

  if (!project) return null;

  const clips = [...project.clips].reverse();

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Layers</h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-1">
        {clips.length === 0 ? (
          <p className="text-xs text-workspace-400 text-center py-4">No layers</p>
        ) : (
          clips.map((clip) => (
            <div
              key={clip.id}
              onClick={() => selectClip(clip.id)}
              className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition-colors ${
                selectedClipId === clip.id ? 'bg-accent-500/20 ring-1 ring-accent-500/30' : 'hover:bg-workspace-800'
              }`}
            >
              <span
                className="w-2 h-8 rounded shrink-0"
                style={{ backgroundColor: clip.color || '#3b82f6' }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-workspace-200 truncate">
                  {clip.type === 'text' ? clip.text : clip.name}
                </p>
                <p className="text-xxs text-workspace-400 capitalize">{clip.type}</p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button
                  onClick={(e) => { e.stopPropagation(); updateClip(clip.id, { hidden: !clip.hidden }); }}
                  className="w-5 h-5 rounded hover:bg-workspace-700 flex items-center justify-center"
                >
                  {clip.hidden ? <EyeOff size={10} className="text-workspace-500" /> : <Eye size={10} className="text-workspace-400" />}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); updateClip(clip.id, { locked: !clip.locked }); }}
                  className="w-5 h-5 rounded hover:bg-workspace-700 flex items-center justify-center"
                >
                  {clip.locked ? <Lock size={10} className="text-amber-400" /> : <Unlock size={10} className="text-workspace-400" />}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedClipId && (
        <div className="p-2 border-t border-workspace-700 flex gap-1">
          <button onClick={() => bringToFront(selectedClipId)} className="icon-btn" title="Bring to Front">
            <ChevronsUpDown size={14} className="rotate-180" />
          </button>
          <button onClick={() => bringForward(selectedClipId)} className="icon-btn" title="Bring Forward">
            <ChevronUp size={14} />
          </button>
          <button onClick={() => sendBackward(selectedClipId)} className="icon-btn" title="Send Backward">
            <ChevronDown size={14} />
          </button>
          <button onClick={() => sendToBack(selectedClipId)} className="icon-btn" title="Send to Back">
            <ChevronsUpDown size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

export default LayerPanel;
