import { useRef, useCallback } from 'react';
import { Upload, Film, Music, Image as ImageIcon, Search, Grid, List, Trash2, Loader2 } from 'lucide-react';
import mediaStore from '@/store/mediaStore';
import editorStore from '@/store/editorStore';
import { formatDuration, formatBytes } from '@/utils/time';
import { formatResolution } from '@/utils/media';
import useMediaUpload from '@/hooks/useMediaUpload';
import EmptyState from '@/components/common/EmptyState';
import SearchInput from '@/components/common/SearchInput';
import { useState } from 'react';

function MediaPanel() {
  const { uploadFiles, uploading } = useMediaUpload();
  const mediaItems = mediaStore((s) => s.mediaItems);
  const removeMedia = mediaStore((s) => s.removeMedia);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const fileInputRef = useRef(null);

  const handleFileSelect = useCallback((files) => {
    if (files && files.length > 0) uploadFiles(Array.from(files));
  }, [uploadFiles]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) uploadFiles(files);
  }, [uploadFiles]);

  const filtered = mediaItems.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const typeIcons = {
    video: Film,
    audio: Music,
    image: ImageIcon,
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Media</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setView('grid')}
            className={`icon-btn ${view === 'grid' ? 'text-accent-400' : ''}`}
            aria-label="Grid view"
          >
            <Grid size={14} />
          </button>
          <button
            onClick={() => setView('list')}
            className={`icon-btn ${view === 'list' ? 'text-accent-400' : ''}`}
            aria-label="List view"
          >
            <List size={14} />
          </button>
        </div>
      </div>

      <div className="p-3 space-y-3">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-workspace-600 rounded-lg p-4 text-center cursor-pointer hover:border-accent-500 hover:bg-accent-500/5 transition-all"
        >
          <Upload size={24} className="mx-auto text-workspace-400 mb-2" />
          <p className="text-xs text-workspace-300">Drop files or click to upload</p>
          <p className="text-xxs text-workspace-500 mt-1">Video, Audio, Images</p>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="video/*,audio/*,image/*"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        <SearchInput value={search} onChange={setSearch} placeholder="Search media..." />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-3 pb-3">
        {uploading && (
          <div className="flex items-center gap-2 p-2 text-xs text-accent-400">
            <Loader2 size={14} className="animate-spin" />
            Uploading...
          </div>
        )}
        {filtered.length === 0 && !uploading ? (
          <EmptyState
            icon={Film}
            title="No media yet"
            description="Upload video, audio, or image files to get started"
          />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((item) => {
              const Icon = typeIcons[item.type] || Film;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      assetId: item.id,
                      type: item.type,
                      name: item.name,
                      duration: item.duration || 5,
                    }));
                  }}
                  className="group relative panel cursor-grab hover:border-accent-500/50 transition-all"
                >
                  <div className="aspect-video bg-workspace-800 rounded-t-lg overflow-hidden flex items-center justify-center">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                    ) : item.loading ? (
                      <Loader2 size={20} className="animate-spin text-workspace-400" />
                    ) : (
                      <Icon size={24} className="text-workspace-500" />
                    )}
                  </div>
                  <div className="p-1.5">
                    <p className="text-xs text-workspace-200 truncate">{item.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xxs text-workspace-400">{item.type}</span>
                      <span className="text-xxs text-workspace-400">
                        {item.duration ? formatDuration(item.duration) : formatBytes(item.size)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeMedia(item.id)}
                    className="absolute top-1 right-1 w-6 h-6 rounded bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center hover:bg-red-500/80 transition-all"
                  >
                    <Trash2 size={12} className="text-white" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((item) => {
              const Icon = typeIcons[item.type] || Film;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      assetId: item.id,
                      type: item.type,
                      name: item.name,
                      duration: item.duration || 5,
                    }));
                  }}
                  className="group flex items-center gap-2 p-2 panel cursor-grab hover:border-accent-500/50"
                >
                  <div className="w-12 h-8 bg-workspace-800 rounded flex items-center justify-center shrink-0 overflow-hidden">
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Icon size={16} className="text-workspace-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-workspace-200 truncate">{item.name}</p>
                    <p className="text-xxs text-workspace-400">
                      {item.type} · {formatResolution(item.width, item.height)} · {formatDuration(item.duration)}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMedia(item.id)}
                    className="opacity-0 group-hover:opacity-100 icon-btn shrink-0"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MediaPanel;
