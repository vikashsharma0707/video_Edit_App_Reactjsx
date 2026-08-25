import { Inbox } from 'lucide-react';

function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-workspace-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-workspace-400" />
      </div>
      <h3 className="text-sm font-semibold text-workspace-200 mb-1">{title}</h3>
      {description && <p className="text-xs text-workspace-400 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}

export default EmptyState;
