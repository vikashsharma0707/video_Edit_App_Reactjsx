function Slider({ value, min = 0, max = 100, step = 1, onChange, label, unit = '', className = '' }) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <div className="flex justify-between text-xs text-workspace-300">
          <span>{label}</span>
          <span className="text-workspace-400">{value}{unit}</span>
        </div>
      )}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full"
      />
    </div>
  );
}

export default Slider;
