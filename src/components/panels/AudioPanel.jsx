import { useState, useCallback } from 'react';
import { Music, Mic, Square, Play, Upload, Volume2 } from 'lucide-react';
import useAudio from '@/hooks/useAudio';
import mediaStore from '@/store/mediaStore';
import { formatDuration } from '@/utils/time';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';

function AudioPanel() {
  const { recording, error, startRecording, stopRecording } = useAudio();
  const [recordings, setRecordings] = useState([]);
  const mediaItems = mediaStore((s) => s.mediaItems);
  const audioMedia = mediaItems.filter((m) => m.type === 'audio');

  const handleStartRec = useCallback(() => {
    startRecording();
  }, [startRecording]);

  const handleStopRec = useCallback(async () => {
    const result = await stopRecording();
    if (result) {
      setRecordings((prev) => [
        ...prev,
        { id: Date.now(), url: result.url, name: `Recording ${prev.length + 1}`, duration: 0 },
      ]);
    }
  }, [stopRecording]);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Audio</h3>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto scrollbar-thin flex-1">
        {/* Voiceover section */}
        <div className="panel p-3">
          <div className="flex items-center gap-2 mb-3">
            <Mic size={16} className="text-accent-400" />
            <h4 className="text-xs font-semibold text-workspace-200">Voiceover Recording</h4>
          </div>
          {error && (
            <p className="text-xs text-red-400 mb-2">{error}</p>
          )}
          <div className="flex gap-2">
            {!recording ? (
              <Button variant="secondary" size="sm" onClick={handleStartRec} className="flex-1">
                <Mic size={14} />
                Start Recording
              </Button>
            ) : (
              <Button variant="danger" size="sm" onClick={handleStopRec} className="flex-1">
                <Square size={14} />
                Stop
              </Button>
            )}
          </div>
          {recording && (
            <div className="mt-2 flex items-center gap-2 text-xs text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              Recording...
            </div>
          )}
          {recordings.length > 0 && (
            <div className="mt-3 space-y-1">
              {recordings.map((rec) => (
                <div key={rec.id} className="flex items-center gap-2 p-1.5 bg-workspace-800 rounded">
                  <button
                    onClick={() => new Audio(rec.url).play()}
                    className="icon-btn"
                  >
                    <Play size={12} />
                  </button>
                  <span className="text-xs text-workspace-200 flex-1 truncate">{rec.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Audio library */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Music size={16} className="text-workspace-400" />
            <h4 className="text-xs font-semibold text-workspace-200">Audio Library</h4>
          </div>
          {audioMedia.length === 0 ? (
            <EmptyState
              icon={Music}
              title="No audio files"
              description="Upload MP3, WAV, or M4A files"
            />
          ) : (
            <div className="space-y-1">
              {audioMedia.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify({
                      assetId: item.id,
                      type: 'audio',
                      name: item.name,
                      duration: item.duration || 5,
                    }));
                  }}
                  className="group flex items-center gap-2 p-2 panel cursor-grab hover:border-accent-500/50"
                >
                  <Volume2 size={14} className="text-purple-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-workspace-200 truncate">{item.name}</p>
                    <p className="text-xxs text-workspace-400">{formatDuration(item.duration)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AudioPanel;
