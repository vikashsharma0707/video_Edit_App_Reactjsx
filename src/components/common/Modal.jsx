import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

function Modal({ open, onClose, title, children, size = 'md', footer }) {
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className={`panel ${sizes[size]} w-full mx-4 max-h-[90vh] flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            {title && (
              <div className="panel-header">
                <h2 className="text-sm font-semibold text-workspace-100">{title}</h2>
                <button onClick={onClose} className="icon-btn">
                  <X size={16} />
                </button>
              </div>
            )}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
              {children}
            </div>
            {footer && (
              <div className="px-4 py-3 border-t border-workspace-700 flex justify-end gap-2">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
