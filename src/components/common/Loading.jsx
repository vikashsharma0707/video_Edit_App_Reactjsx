import { Loader2 } from 'lucide-react';

function Loading({ label = 'Loading...', size = 24, className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-8 ${className}`}>
      <Loader2 size={size} className="animate-spin text-accent-500" />
      <p className="text-sm text-workspace-300">{label}</p>
    </div>
  );
}

export default Loading;
