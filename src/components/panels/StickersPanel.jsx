import editorStore from '@/store/editorStore';
import { uid } from '@/utils/time';

const STICKER_CATEGORIES = {
  Emoji: ['😀', '😂', '😍', '😎', '🤔', '😱', '🥳', '🤩', '😭', '😡', '🤯', '🥺', '😴', '🤠', '🤓', '👻'],
  Reactions: ['👍', '👎', '👏', '🙌', '🤝', '💪', '✌️', '🤞', '👌', '🤙', '👋', '🙏', '💪', '🔥', '💯', '✨'],
  Arrows: ['➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↖️', '↙️', '🔄', '🔁', '⚡', '💥'],
  Shapes: ['⭐', '❤️', '💙', '💚', '💛', '🧡', '💜', '🖤', '🤍', '♦️', '🔺', '🔻', '🔶', '🔷', '⚪', '⚫'],
  Social: ['📱', '💬', '📧', '🔔', '📢', '📣', '📸', '🎥', '🎬', '📺', '📻', '🎧'],
  Gaming: ['🎮', '🕹️', '👾', '🎯', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '⚔️', '🛡️'],
  Love: ['❤️', '💖', '💝', '💗', '💓', '💞', '💕', '💟', '💔', '❣️', '💌', '💋'],
  Celebration: ['🎉', '🎊', '🎈', '🎁', '🎂', '🍰', '🥂', '🍾', '🎆', '🎇', '✨', '🎄'],
};

function StickersPanel() {
  const { project, addClip, currentTime } = editorStore();

  const addSticker = (emoji) => {
    const stickerTrack = project?.tracks.find((t) => t.type === 'sticker');
    const targetTrack = stickerTrack || project?.tracks.find((t) => t.type === 'text');
    if (!targetTrack) return;

    addClip({
      id: uid(),
      trackId: targetTrack.id,
      type: 'sticker',
      name: `Sticker ${emoji}`,
      emoji,
      size: 64,
      start: currentTime,
      duration: 5,
      sourceStart: 0,
      sourceEnd: 5,
      volume: 1,
      speed: 1,
      transform: { x: 0, y: 0, scale: 1, rotation: 0, opacity: 1, flipH: false, flipV: false },
      color: '#ec4899',
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Stickers</h3>
      </div>

      <div className="p-3 space-y-4 overflow-y-auto scrollbar-thin flex-1">
        {Object.entries(STICKER_CATEGORIES).map(([category, stickers]) => (
          <div key={category}>
            <h4 className="text-xs font-semibold text-workspace-200 mb-2">{category}</h4>
            <div className="grid grid-cols-6 gap-1">
              {stickers.map((emoji, i) => (
                <button
                  key={`${emoji}-${i}`}
                  onClick={() => addSticker(emoji)}
                  className="aspect-square flex items-center justify-center text-xl hover:bg-workspace-700 rounded transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StickersPanel;
