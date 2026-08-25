import { Search } from 'lucide-react';

function SearchInput({ value, onChange, placeholder = 'Search...', className = '' }) {
  return (
    <div className={`relative ${className}`}>
      <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-workspace-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input pl-8 w-full"
      />
    </div>
  );
}

export default SearchInput;
