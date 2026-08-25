import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

function Dropdown({ trigger, items, align = 'left' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={`absolute z-50 mt-1 min-w-[160px] panel py-1 animate-scale-in ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item, i) =>
            item.divider ? (
              <div key={i} className="h-px bg-workspace-700 my-1" />
            ) : (
              <button
                key={i}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                disabled={item.disabled}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-workspace-200 hover:bg-workspace-700 hover:text-workspace-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {item.icon && <item.icon size={14} />}
                <span>{item.label}</span>
                {item.shortcut && (
                  <span className="ml-auto text-xs text-workspace-400">{item.shortcut}</span>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

export default Dropdown;
