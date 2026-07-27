const topRegions = [
  { name: 'Jabodetabek', volume: '142,000L' },
  { name: 'Jawa Tengah', volume: '89,200L' },
]

export default function MapWidget() {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-sm h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[#051C37] text-base font-normal leading-6">Peta Sebaran</h3>
        <button className="text-[#3F4945] hover:text-[#004536] transition-colors duration-200">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M0 18V10H2V14.6L14.6 2H10V0H18V8H16V3.4L3.4 16H8V18H0Z" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* Map image */}
      <div className="relative flex-1 min-h-[240px] sm:min-h-[320px] rounded-xl overflow-hidden">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/53e6ca057401bd4b9cdbe726eb2f22b4fb5d8e20?width=579"
          alt="Peta Sebaran"
          className="w-full h-full object-cover"
        />

        {/* Cluster markers */}
        <div className="absolute top-[28%] left-[33%] w-8 h-6 flex items-center justify-center rounded-full border-2 border-white bg-[rgba(0,69,54,0.80)] text-white text-[10px] font-bold shadow-lg">
          24
        </div>
        <div className="absolute top-[62%] left-[62%] w-10 h-8 flex items-center justify-center rounded-full border-2 border-white bg-[rgba(0,108,73,0.80)] text-white text-[10px] font-bold shadow-lg">
          156
        </div>

        {/* Legend overlay */}
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-52 p-3 rounded-lg border border-[#BEC9C3]/30 bg-white/90 backdrop-blur-[6px] shadow-lg">
          <p className="text-[#051C37] text-sm font-bold leading-6 mb-1">Kepadatan Minyak Jelantah</p>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-3 h-3 rounded-full bg-[#004536] flex-shrink-0" />
            <span className="text-[#051C37] text-xs leading-5">High Capacity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#63DCA6] flex-shrink-0" />
            <span className="text-[#051C37] text-xs leading-5">Normal</span>
          </div>
        </div>
      </div>

      {/* Top regions */}
      <div className="flex flex-col gap-3">
        <p className="text-[#3F4945] text-xs font-bold uppercase tracking-[0.8px] leading-5">TOP REGION</p>
        {topRegions.map((r) => (
          <div key={r.name} className="flex justify-between items-center">
            <span className="text-[#051C37] text-sm leading-6">{r.name}</span>
            <span className="text-[#051C37] text-sm font-bold leading-6">{r.volume}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
