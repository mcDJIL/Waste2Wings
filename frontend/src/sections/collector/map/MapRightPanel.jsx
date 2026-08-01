import { useState, useMemo } from 'react'
const RADIUS         = 52
const CIRCUMFERENCE  = 2 * Math.PI * RADIUS

function TankGauge({ percent, capacity, current }) {
  const filled = (percent / 100) * CIRCUMFERENCE
  const gap    = CIRCUMFERENCE - filled

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-[130px] h-[130px] sm:w-[140px] sm:h-[140px]">
        <svg
          className="w-full h-full -rotate-90"
          viewBox="0 0 120 120"
        >
          <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#E8F5E9" strokeWidth="10" />
          <circle
            cx="60" cy="60" r={RADIUS} fill="none"
            stroke="#004536" strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${gap}`}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[#004536] text-2xl sm:text-3xl font-extrabold leading-none">
            {percent}%
          </span>
          <span className="text-[#6F7975] text-[10px] font-bold tracking-widest uppercase mt-0.5">
            FULL
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <span className="text-[#051C37] text-sm font-bold">
          {current?.toLocaleString('id-ID')} / {capacity?.toLocaleString('id-ID')} Liters
        </span>
        <div className="flex items-center gap-1.5">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M0.7 10L0 9.3L3.7 5.575L5.7 7.575L8.3 5H7V4H10V7H9V5.7L5.7 9L3.7 7L0.7 10Z" fill="#006C49"/>
          </svg>
          <span className="text-[#006C49] text-xs font-semibold">+1.2k L hari ini</span>
        </div>
      </div>
    </div>
  )
}



export default function MapRightPanel({ mapData, className = '' }) {
  const stats = useMemo(() => {
    if (!mapData?.collector) return { percent: 0, current: 0, capacity: 0 }

    const capacity = mapData.collector.capacityLiter
    const communities = mapData.communityMarkers || []
    const totalCollected = communities.reduce((sum, m) => sum + m.totalCleanLiter, 0)
    const percent = capacity > 0 ? Math.round((totalCollected / capacity) * 100) : 0

    return { percent, current: totalCollected, capacity }
  }, [mapData])

  const communityList = useMemo(() => {
    return mapData?.communityMarkers || []
  }, [mapData])

  return (
    <aside className={`
      flex flex-col bg-white overflow-y-auto
      w-full lg:w-[300px] xl:w-[320px] shrink-0
      border-l border-[rgba(190,201,195,0.20)]
      shadow-[-4px_0_24px_rgba(0,0,0,0.06)]
      animate-fade-in
      ${className}
    `}>
      {/* Tank Capacity */}
      <div className="flex flex-col items-center gap-1 px-6 pt-6 pb-5 border-b border-[rgba(190,201,195,0.20)]">
        <h2 className="text-[#051C37] text-base font-bold leading-6 self-stretch mb-3">
          Main Tank Capacity
        </h2>
        <TankGauge percent={stats.percent} current={stats.current} capacity={stats.capacity} />
      </div>

      {/* Community Submissions */}
      {communityList.length > 0 && (
        <div className="flex flex-col gap-3 px-6 py-5 flex-1 overflow-y-auto">
          <span className="text-[#051C37] text-sm font-bold leading-5">Community Submissions</span>

          <div className="flex flex-col gap-2">
            {communityList.map((community, i) => (
              <div
                key={community.id}
                className="flex flex-col px-3 py-3 rounded-xl
                  border border-[rgba(190,201,195,0.30)] bg-[#FAF9F6]
                  animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <span className="text-[#051C37] text-sm font-semibold leading-5 truncate">
                  {community.name}
                </span>
                <span className="text-[#6F7975] text-xs leading-4">{community.category}</span>
                <span className="text-[#006C49] text-xs font-semibold mt-1">
                  {community.totalCleanLiter} L • {community.submissionCount} Setoran
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {communityList.length === 0 && (
        <div className="flex-1 flex items-center justify-center px-6 py-8">
          <span className="text-[#6F7975] text-sm text-center">No community submissions yet</span>
        </div>
      )}
    </aside>
  )
}
