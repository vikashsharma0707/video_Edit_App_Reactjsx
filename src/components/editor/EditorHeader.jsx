import { Film, Undo2, Redo2, Save, Download, ChevronLeft, Settings, Keyboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import editorStore from '@/store/editorStore';
import projectStore from '@/store/projectStore';
import uiStore from '@/store/uiStore';
import IconButton from '@/components/common/IconButton';
import Button from '@/components/common/Button';
import Tooltip from '@/components/common/Tooltip';

function EditorHeader() {
  const navigate = useNavigate();
  const { project, undo, redo, history, redoStack } = editorStore();
  const { saveStatus, saveProject } = projectStore();
  const { setExportModal, setShortcuts } = uiStore();

  const saveLabel = {
    idle: 'Save',
    saving: 'Saving...',
    saved: 'Saved',
    unsaved: 'Unsaved',
  };

  return (
    <header className="h-12 flex items-center justify-between px-3 bg-workspace-900 border-b border-workspace-700 shrink-0">
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/projects')}
          className="icon-btn"
          aria-label="Back to projects"
        >
          <ChevronLeft size={20} />
        </button>
        <div className="flex items-center gap-1.5 px-2">
          <div className="w-7 h-7 rounded-md bg-accent-500 flex items-center justify-center">
            <Film size={16} className="text-white" />
          </div>
          <span className="text-sm font-bold text-workspace-100 hidden sm:inline">ClipForge</span>
        </div>
        <div className="h-5 w-px bg-workspace-700 mx-1" />
        <span className="text-sm text-workspace-200 font-medium">{project?.name || 'Untitled'}</span>
        {saveStatus === 'saving' && (
          <span className="text-xs text-workspace-400 animate-pulse">Saving...</span>
        )}
        {saveStatus === 'saved' && (
          <span className="text-xs text-accent-400">Saved</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        <Tooltip content="Undo (Ctrl+Z)" side="bottom">
          <IconButton icon={Undo2} label="Undo" onClick={undo} disabled={history.length === 0} />
        </Tooltip>
        <Tooltip content="Redo (Ctrl+Shift+Z)" side="bottom">
          <IconButton icon={Redo2} label="Redo" onClick={redo} disabled={redoStack.length === 0} />
        </Tooltip>
        <div className="h-5 w-px bg-workspace-700 mx-1" />
        <Tooltip content="Save project" side="bottom">
          <Button variant="ghost" size="sm" onClick={() => saveProject(project)}>
            <Save size={14} />
            <span className="hidden sm:inline">{saveLabel[saveStatus]}</span>
          </Button>
        </Tooltip>
        <Tooltip content="Keyboard shortcuts" side="bottom">
          <IconButton icon={Keyboard} label="Shortcuts" onClick={() => setShortcuts(true)} />
        </Tooltip>
        <Button variant="primary" size="sm" onClick={() => setExportModal(true)} className="ml-1">
          <Download size={14} />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>
    </header>
  );
}

export default EditorHeader;
