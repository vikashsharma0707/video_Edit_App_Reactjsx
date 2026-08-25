import editorStore from '@/store/editorStore';

const ANIMATIONS = {
  Entrance: [
    { name: 'Fade', value: 'fade' },
    { name: 'Slide', value: 'slide' },
    { name: 'Pop', value: 'pop' },
    { name: 'Zoom', value: 'zoom' },
    { name: 'Bounce', value: 'bounce' },
    { name: 'Typewriter', value: 'typewriter' },
  ],
  Exit: [
    { name: 'Fade', value: 'fade' },
    { name: 'Slide', value: 'slide' },
    { name: 'Zoom', value: 'zoom' },
    { name: 'Shrink', value: 'shrink' },
  ],
  Loop: [
    { name: 'None', value: null },
    { name: 'Pulse', value: 'pulse' },
    { name: 'Shake', value: 'shake' },
    { name: 'Floating', value: 'floating' },
  ],
};

function AnimationPanel() {
  const { project, selectedClipId, updateClip } = editorStore();
  const clip = project?.clips.find((c) => c.id === selectedClipId);

  if (!clip) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header">
          <h3 className="text-sm font-semibold text-workspace-100">Animation</h3>
        </div>
        <div className="flex-1 flex items-center justify-center text-xs text-workspace-400 p-4 text-center">
          Select a clip to apply animations
        </div>
      </div>
    );
  }

  const animation = clip.animation || { entrance: 'fade', exit: 'fade', loop: null };
  const setAnimation = (type, value) => {
    updateClip(clip.id, { animation: { ...animation, [type]: value } });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Animation</h3>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto scrollbar-thin flex-1">
        <p className="text-xs text-workspace-400">Applied to: {clip.name}</p>
        {Object.entries(ANIMATIONS).map(([category, anims]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-workspace-200 mb-2">{category}</h4>
            <div className="grid grid-cols-3 gap-1">
              {anims.map((anim) => (
                <button
                  key={anim.value || 'none'}
                  onClick={() => setAnimation(category.toLowerCase(), anim.value)}
                  className={`px-2 py-1.5 rounded text-xs transition-colors ${
                    animation[category.toLowerCase()] === anim.value
                      ? 'bg-accent-500/20 text-accent-400 ring-1 ring-accent-500/30'
                      : 'bg-workspace-800 text-workspace-300 hover:bg-workspace-700'
                  }`}
                >
                  {anim.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AnimationPanel;
