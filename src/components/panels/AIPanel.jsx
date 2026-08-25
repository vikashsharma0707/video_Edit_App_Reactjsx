import { useState } from 'react';
import { Bot, Sparkles, AlertCircle, Loader2, Settings } from 'lucide-react';
import { AI_TOOLS, getAvailableTools } from '@/services/ai/aiVideo';
import { isCaptionGenerationAvailable } from '@/services/ai/captions';
import { isTextToSpeechAvailable, getAvailableVoices, speak } from '@/services/ai/textToSpeech';
import { isScriptGeneratorConfigured } from '@/services/ai/scriptGenerator';
import { isSceneDetectionAvailable } from '@/services/ai/sceneDetection';
import editorStore from '@/store/editorStore';
import uiStore from '@/store/uiStore';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';

function AIPanel() {
  const [activeTool, setActiveTool] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const { project } = editorStore();
  const { addToast } = uiStore();

  const available = getAvailableTools();

  const runTool = async (toolId) => {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      switch (toolId) {
        case 'text-to-speech':
          setResult({ type: 'tts', voices: getAvailableVoices() });
          break;
        case 'scene-detection':
          setResult({ type: 'info', message: 'Scene detection runs on video clips. Add a video to the timeline and click detect.' });
          break;
        default:
          setResult({ type: 'info', message: 'This tool requires backend configuration. See the AI Studio settings below.' });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <div className="flex items-center gap-2">
          <Bot size={16} className="text-accent-400" />
          <h3 className="text-sm font-semibold text-workspace-100">AI Studio</h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
        {/* Tool grid */}
        <div className="grid grid-cols-1 gap-2">
          {AI_TOOLS.map((tool) => {
            const isAvailable = tool.available();
            return (
              <button
                key={tool.id}
                onClick={() => isAvailable && setActiveTool(tool.id)}
                disabled={!isAvailable}
                className={`panel p-3 text-left transition-all ${
                  isAvailable
                    ? 'hover:border-accent-500/50 cursor-pointer'
                    : 'opacity-50 cursor-not-allowed'
                } ${activeTool === tool.id ? 'ring-1 ring-accent-500/30' : ''}`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isAvailable ? 'bg-accent-500/20' : 'bg-workspace-800'
                  }`}>
                    <Sparkles size={14} className={isAvailable ? 'text-accent-400' : 'text-workspace-500'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-workspace-100">{tool.name}</span>
                      {!isAvailable && (
                        <span className="text-xxs text-workspace-500 bg-workspace-800 px-1.5 py-0.5 rounded">
                          Not configured
                        </span>
                      )}
                    </div>
                    <p className="text-xxs text-workspace-400 mt-0.5">{tool.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active tool panel */}
        {activeTool && (
          <div className="panel p-3 space-y-3">
            <h4 className="text-xs font-semibold text-workspace-200">
              {AI_TOOLS.find((t) => t.id === activeTool)?.name}
            </h4>

            {loading && (
              <div className="flex items-center gap-2 text-xs text-accent-400">
                <Loader2 size={14} className="animate-spin" />
                Processing...
              </div>
            )}

            {error && (
              <div className="flex items-start gap-2 p-2 bg-red-500/10 border border-red-500/30 rounded text-xs text-red-300">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {result?.type === 'tts' && (
              <div className="space-y-2">
                <p className="text-xs text-workspace-300">Browser TTS is ready. Enter text below to preview.</p>
                <textarea
                  placeholder="Type text to speak..."
                  className="input w-full h-20 resize-none"
                  id="tts-text"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const text = document.getElementById('tts-text')?.value;
                    if (text) speak(text);
                  }}
                >
                  <Sparkles size={12} />
                  Speak
                </Button>
              </div>
            )}

            {result?.type === 'info' && (
              <p className="text-xs text-workspace-300">{result.message}</p>
            )}

            <Button variant="primary" size="sm" onClick={() => runTool(activeTool)} disabled={loading}>
              Run Tool
            </Button>
          </div>
        )}

        {/* Configuration notice */}
        <div className="panel p-3">
          <div className="flex items-start gap-2">
            <Settings size={14} className="text-workspace-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-workspace-300 font-medium mb-1">Configuration</p>
              <p className="text-xxs text-workspace-400">
                AI tools require API keys. Set these environment variables to enable:
              </p>
              <ul className="text-xxs text-workspace-400 mt-1 space-y-0.5 font-mono">
                <li>VITE_SPEECH_TO_TEXT_API_KEY</li>
                <li>VITE_TTS_API_KEY</li>
                <li>VITE_LLM_API_KEY</li>
                <li>VITE_AI_API_URL</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIPanel;
