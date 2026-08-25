import { AnimatePresence, motion } from 'framer-motion';

function ContextMenu({ open, x, y, items, onClose }) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} onContextMenu={(e) => { e.preventDefault(); onClose(); }} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
        className="fixed z-50 min-w-[180px] panel py-1"
        style={{ left: x, top: y }}
      >
        {items.map((item, i) =>
          item.divider ? (
            <div key={i} className="h-px bg-workspace-700 my-1" />
          ) : (
            <button
              key={i}
              onClick={() => {
                item.onClick?.();
                onClose();
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
      </motion.div>
    </>
  );
}

export default ContextMenu;
