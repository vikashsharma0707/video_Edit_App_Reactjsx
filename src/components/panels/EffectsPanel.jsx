import { useState } from 'react';
import { Search, Star, Clock, Sparkles } from 'lucide-react';
import SearchInput from '@/components/common/SearchInput';

const EFFECT_CATEGORIES = {
  Basic: [
    { name: 'Fade', icon: '◐', type: 'fade', intensity: 50 },
    { name: 'Zoom In', icon: '🔍', type: 'zoom_in', intensity: 50 },
    { name: 'Zoom Out', icon: '🔎', type: 'zoom_out', intensity: 50 },
    { name: 'Shake', icon: '📳', type: 'shake', intensity: 30 },
  ],
  Cinematic: [
    { name: 'Letterbox', icon: '🎬', type: 'letterbox', intensity: 100 },
    { name: 'Film Grain', icon: '🎞️', type: 'film_grain', intensity: 40 },
    { name: 'Color Grade', icon: '🎨', type: 'color_grade', intensity: 60 },
    { name: 'Anamorphic', icon: '📸', type: 'anamorphic', intensity: 70 },
  ],
  Glitch: [
    { name: 'RGB Split', icon: '🔴', type: 'rgb_split', intensity: 50 },
    { name: 'Pixelate', icon: '🟦', type: 'pixelate', intensity: 50 },
    { name: 'Distort', icon: '〰️', type: 'distort', intensity: 60 },
    { name: 'Scan Lines', icon: '📺', type: 'scan_lines', intensity: 50 },
  ],
  Retro: [
    { name: 'VHS', icon: '📹', type: 'vhs', intensity: 60 },
    { name: 'Old Film', icon: '🎞️', type: 'old_film', intensity: 50 },
    { name: '8-Bit', icon: '👾', type: '8bit', intensity: 80 },
    { name: 'Sepia', icon: '🟤', type: 'sepia', intensity: 100 },
  ],
  Light: [
    { name: 'Glow', icon: '✨', type: 'glow', intensity: 50 },
    { name: 'Lens Flare', icon: '🌟', type: 'lens_flare', intensity: 60 },
    { name: 'Bloom', icon: '🌸', type: 'bloom', intensity: 50 },
    { name: 'Light Leak', icon: '🌈', type: 'light_leak', intensity: 40 },
  ],
  Blur: [
    { name: 'Gaussian', icon: '🌫️', type: 'gaussian_blur', intensity: 50 },
    { name: 'Motion Blur', icon: '💨', type: 'motion_blur', intensity: 50 },
    { name: 'Radial Blur', icon: '🌀', type: 'radial_blur', intensity: 50 },
    { name: 'Tilt Shift', icon: '📐', type: 'tilt_shift', intensity: 50 },
  ],
  Motion: [
    { name: 'Zoom Pulse', icon: '💓', type: 'zoom_pulse', intensity: 50 },
    { name: 'Slide', icon: '➡️', type: 'slide', intensity: 50 },
    { name: 'Rotate', icon: '🔄', type: 'rotate', intensity: 50 },
    { name: 'Bounce', icon: '⬆️', type: 'bounce', intensity: 50 },
  ],
};

function EffectsPanel() {
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);

  const toggleFavorite = (name) => {
    setFavorites((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <h3 className="text-sm font-semibold text-workspace-100">Effects</h3>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto scrollbar-thin flex-1">
        <SearchInput value={search} onChange={setSearch} placeholder="Search effects..." />

        {favorites.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Star size={12} className="text-amber-400" />
              <h4 className="text-xs font-semibold text-workspace-200">Favorites</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {favorites.map((name) => (
                <EffectCard key={name} name={name} favorite onToggleFav={() => toggleFavorite(name)} />
              ))}
            </div>
          </div>
        )}

        {recent.length > 0 && (
          <div>
            <div className="flex items-center gap-1 mb-2">
              <Clock size={12} className="text-workspace-400" />
              <h4 className="text-xs font-semibold text-workspace-200">Recently Used</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {recent.map((name) => (
                <EffectCard key={name} name={name} onToggleFav={() => toggleFavorite(name)} />
              ))}
            </div>
          </div>
        )}

        {Object.entries(EFFECT_CATEGORIES).map(([category, effects]) => (
          <div key={category}>
            <div className="flex items-center gap-1 mb-2">
              <Sparkles size={12} className="text-accent-400" />
              <h4 className="text-xs font-semibold text-workspace-200">{category}</h4>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {effects
                .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
                .map((effect) => (
                  <EffectCard
                    key={effect.name}
                    name={effect.name}
                    icon={effect.icon}
                    favorite={favorites.includes(effect.name)}
                    onToggleFav={() => toggleFavorite(effect.name)}
                    onApply={() => setRecent((prev) => [effect.name, ...prev.filter((n) => n !== effect.name)].slice(0, 4))}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EffectCard({ name, icon, favorite, onToggleFav, onApply }) {
  return (
    <div className="group panel p-2 hover:border-accent-500/50 transition-all cursor-pointer" onClick={onApply}>
      <div className="aspect-video bg-workspace-800 rounded flex items-center justify-center text-2xl mb-1">
        {icon || '✨'}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-workspace-200 truncate">{name}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFav(); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Star size={12} className={favorite ? 'text-amber-400 fill-amber-400' : 'text-workspace-400'} />
        </button>
      </div>
    </div>
  );
}

export default EffectsPanel;
