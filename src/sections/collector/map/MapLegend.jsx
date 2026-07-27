const LEGEND_ITEMS = [
  { color: '#BA1A1A', label: 'HEN Headquarters' },
  { color: '#004536', label: 'Pengepul (Collectors)' },
  { color: '#81F9C1', label: 'Masyarakat (Users)', border: '#00734E' },
]

export default function MapLegend() {
  return (
    <div className="
      absolute bottom-8 left-4 z-[500]
      flex flex-col gap-2 px-4 py-3 rounded-xl
      bg-white/95 backdrop-blur-sm
      border border-[rgba(190,201,195,0.40)]
      shadow-[0_4px_16px_rgba(0,0,0,0.12)]
      animate-fade-in min-w-[180px]
    ">
      <span className="text-[#051C37] text-xs font-bold uppercase tracking-[0.6px] pb-1
        border-b border-[rgba(190,201,195,0.30)]">
        Legenda Peta
      </span>
      {LEGEND_ITEMS.map(({ color, label, border }) => (
        <div key={label} className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{
              background: color,
              border: border ? `2px solid ${border}` : undefined,
            }}
          />
          <span className="text-[#3F4945] text-xs font-medium leading-4">{label}</span>
        </div>
      ))}
    </div>
  )
}
