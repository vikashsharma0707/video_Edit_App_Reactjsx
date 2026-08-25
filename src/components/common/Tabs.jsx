function Tabs({ tabs, active, onChange, className = '' }) {
  return (
    <div className={`flex gap-1 overflow-x-auto no-scrollbar ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`tab-btn ${active === tab.id ? 'tab-btn-active' : ''}`}
        >
          {tab.icon && <tab.icon size={16} />}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export default Tabs;
