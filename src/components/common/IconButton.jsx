function IconButton({ icon: Icon, label, onClick, active, disabled, size = 18, className = '', ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`icon-btn ${active ? 'bg-accent-500/20 text-accent-400' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon size={size} />}
    </button>
  );
}

export default IconButton;
