import { useState } from 'react';
import { Download, Loader2, CheckCircle, AlertCircle, Film, Clock, HardDrive } from 'lucide-react';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import editorStore from '@/store/editorStore';
import mediaStore from '@/store/mediaStore';
import uiStore from '@/store/uiStore';
import { exportProject, EXPORT_RESOLUTIONS, EXPORT_FPS, EXPORT_FORMATS, downloadBlob } from '@/services/export/exportService';
import { saveExportRecord } from '@/services/export/exportUtils';
import { formatBytes, formatDuration } from '@/utils/time';
import { getStageLabel, estimateRemainingTime } from '@/services/export/renderPipeline';

function ExportModal() {
  const { showExportModal, setExportModal } = uiStore();
  const { project } = editorStore();
  const mediaItems = mediaStore((s) => s.mediaItems);

  const [resolution, setResolution] = useState('1080p');
  const [fps, setFps] = useState(30);
  const [format, setFormat] = useState('webm');
  const [quality, setQuality] = useState('high');
  const [exporting, setExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('preparing');
  const [error, setError] = useState(null);
  const [exportedBlob, setExportedBlob] = useState(null);
  const [startTime, setStartTime] = useState(0);

  const duration = project?.clips.reduce((max, c) => Math.max(max, c.start + c.duration), 0) || 0;

  const handleExport = async () => {
    if (!project || duration === 0) {
      setError('Project is empty. Add clips before exporting.');
      return;
    }

    setExporting(true);
    setError(null);
    setProgress(0);
    setPhase('preparing');
    setStartTime(Date.now());

    try {
      const blob = await exportProject(project, mediaItems, { resolution, fps, format, quality }, ({ phase, progress, currentTime }) => {
        setPhase(phase);
        if (progress !== undefined) setProgress(progress);
      });

      setExportedBlob(blob);
      setProgress(100);
      setPhase('done');

      await saveExportRecord({
        filename: `${project.name || 'export'}.${EXPORT_FORMATS[format]?.extension || 'webm'}`,
        resolution,
        format,
        duration,
        size: blob.size,
        projectId: project.id,
      });
    } catch (err) {
      setError(err.message || 'Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = () => {
    if (!exportedBlob) return;
    const ext = EXPORT_FORMATS[format]?.extension || 'webm';
    downloadBlob(exportedBlob, `${project?.name || 'export'}.${ext}`);
  };

  const handleClose = () => {
    if (exporting) return;
    setExportModal(false);
    setExportedBlob(null);
    setError(null);
    setProgress(0);
  };

  const elapsed = (Date.now() - startTime) / 1000;
  const remaining = estimateRemainingTime(progress, elapsed * 1000);

  return (
    <Modal open={showExportModal} onClose={handleClose} title="Export Video" size="lg">
      <div className="space-y-4">
        {/* Export preview info */}
        <div className="panel p-3 flex items-center gap-3">
          <div className="w-16 h-10 rounded bg-workspace-800 flex items-center justify-center">
            <Film size={20} className="text-workspace-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-workspace-100">{project?.name || 'Untitled'}</p>
            <div className="flex items-center gap-3 text-xs text-workspace-400 mt-0.5">
              <span className="flex items-center gap-1"><Clock size={10} /> {formatDuration(duration)}</span>
              <span>{project?.aspectRatio}</span>
              <span>{EXPORT_RESOLUTIONS[resolution]?.label}</span>
            </div>
          </div>
        </div>

        {exporting ? (
          {/* Export progress */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-accent-400" />
              <span className="text-sm text-workspace-200">{getStageLabel(phase)}</span>
            </div>
            <div className="w-full h-2 bg-workspace-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-workspace-400">
              <span>{progress}%</span>
              {remaining > 0 && <span>~{Math.ceil(remaining)}s remaining</span>}
            </div>
          </div>
        ) : exportedBlob ? (
          {/* Export complete */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-accent-400">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">Export complete!</span>
            </div>
            <div className="panel p-3 space-y-1 text-xs text-workspace-300">
              <div className="flex justify-between"><span>Size:</span><span>{formatBytes(exportedBlob.size)}</span></div>
              <div className="flex justify-between"><span>Format:</span><span>{EXPORT_FORMATS[format]?.label}</span></div>
              <div className="flex justify-between"><span>Resolution:</span><span>{EXPORT_RESOLUTIONS[resolution]?.label}</span></div>
              <div className="flex justify-between"><span>FPS:</span><span>{fps}</span></div>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="md" onClick={handleDownload} className="flex-1">
                <Download size={14} />
                Download
              </Button>
              <Button variant="secondary" size="md" onClick={() => { setExportedBlob(null); setProgress(0); }}>
                Export Again
              </Button>
            </div>
          </div>
        ) : (
          {/* Export settings */}
          <>
            {error && (
              <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-workspace-200 mb-2 block">Resolution</label>
              <div className="grid grid-cols-3 gap-1">
                {Object.entries(EXPORT_RESOLUTIONS).map(([key, val]) => (
                  <button
                    key={key}
                    onClick={() => setResolution(key)}
                    className={`px-2 py-1.5 rounded text-xs transition-colors ${
                      resolution === key
                        ? 'bg-accent-500/20 text-accent-400 ring-1 ring-accent-500/30'
                        : 'bg-workspace-800 text-workspace-300 hover:bg-workspace-700'
                    }`}
                  >
                    {val.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-workspace-200 mb-2 block">Frame Rate</label>
                <select
                  value={fps}
                  onChange={(e) => setFps(parseInt(e.target.value))}
                  className="input w-full"
                >
                  {EXPORT_FPS.map((f) => (
                    <option key={f} value={f}>{f} fps</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-workspace-200 mb-2 block">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="input w-full"
                >
                  {Object.entries(EXPORT_FORMATS).map(([key, val]) => (
                    <option key={key} value={key}>{val.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-workspace-200 mb-2 block">Quality</label>
              <div className="grid grid-cols-4 gap-1">
                {['low', 'medium', 'high', 'custom'].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuality(q)}
                    className={`px-2 py-1.5 rounded text-xs capitalize transition-colors ${
                      quality === q
                        ? 'bg-accent-500/20 text-accent-400 ring-1 ring-accent-500/30'
                        : 'bg-workspace-800 text-workspace-300 hover:bg-workspace-700'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="primary" size="lg" onClick={handleExport} className="w-full">
              <Download size={16} />
              Start Export
            </Button>
          </>
        )}
      </div>
    </Modal>
  );
}

export default ExportModal;
