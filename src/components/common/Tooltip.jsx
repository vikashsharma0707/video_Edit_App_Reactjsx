import { useState } from 'react';

function Tooltip({ children, content, side = 'top' }) {
  const [show, setShow] = useState(false);
  const sides = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && content && (
        <div className={`absolute z-[100] ${sides[side]} px-2 py-1 text-xs bg-workspace-900 border border-workspace-600 rounded text-workspace-200 whitespace-nowrap pointer-events-none animate-fade-in`}>
          {content}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
