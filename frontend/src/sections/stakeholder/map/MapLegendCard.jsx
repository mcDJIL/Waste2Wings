const legendItems = [
  { color: 'bg-brand-gold', label: 'Pusat Distribusi (HEN)' },
  { color: 'bg-brand-green', label: 'Pengepul Terverifikasi' },
  { color: 'bg-[#0B5E4B] border border-white', label: 'Armada Logistik' },
]

export default function MapLegendCard() {
  return (
    <div className="animate-legend-in rounded-xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)] p-4 w-[180px] sm:w-[210px]">
      <div className="pb-2 mb-3 border-b border-[rgba(190,201,195,0.30)]">
        <h3 className="text-[#051C37] text-sm font-bold leading-6">Legend</h3>
      </div>

      <ul className="flex flex-col gap-2">
        {legendItems.map(({ color, label }) => (
          <li key={label} className="flex items-center gap-1.5">
            <span className={`w-3 h-3 rounded-full flex-shrink-0 ${color}`} />
            <span className="text-[#051C37] text-xs sm:text-sm font-normal leading-6">{label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
