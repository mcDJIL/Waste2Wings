import { useEffect, useState } from 'react'

export default function ProgressSection() {
  const [barWidth, setBarWidth] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setBarWidth(80), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#8DD5BD]/10 bg-white
      shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden relative">
      <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-[#004536]/5 blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-4 mb-6 sm:mb-8 relative">
        <div>
          <h3 className="text-xl sm:text-2xl font-semibold text-[#004536]">Target Bulan Ini</h3>
          <p className="text-[#3F4945] text-sm sm:text-base mt-1">
            20 liter lagi untuk mencapai Gold Member
          </p>
        </div>
        <span className="text-xl sm:text-2xl font-bold text-[#004536] shrink-0">80%</span>
      </div>

      <div className="h-3 sm:h-4 rounded-full bg-[#A8F1D8] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-[#004536] to-[#006C49] transition-all duration-1000 ease-out relative overflow-hidden"
          style={{ width: `${barWidth}%` }}
        >
          <div className="absolute inset-0 opacity-20"
            style={{
              background: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 8px, transparent 8px, transparent 16px)'
            }}
          />
        </div>
      </div>

      <div className="flex justify-between mt-3 text-xs sm:text-sm text-[#3F4945]">
        <span className="font-medium">80L Terkumpul</span>
        <span>Target: 100L</span>
      </div>
    </div>
  )
}
