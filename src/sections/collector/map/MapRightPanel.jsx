import { useState } from 'react'

const TANK_PERCENT   = 75
const TANK_CURRENT   = 45000
const TANK_CAPACITY  = 60000
const RADIUS         = 52
const CIRCUMFERENCE  = 2 * Math.PI * RADIUS

function TankGauge({ percent }) {
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
          {TANK_CURRENT.toLocaleString('id-ID')} / {TANK_CAPACITY.toLocaleString('id-ID')} Liters
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

const LIVE_ACTIVITIES = [
  {
    id: 1,
    icon: (
      <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
        <path d="M2 18C1.45 18 0.979 17.804 0.588 17.413C0.196 17.021 0 16.55 0 16V2C0 1.45 0.196 0.979 0.588 0.588C0.979 0.196 1.45 0 2 0H16C16.55 0 17.021 0.196 17.413 0.588C17.804 0.979 18 1.45 18 2V16C18 16.55 17.804 17.021 17.413 17.413C17.021 17.804 16.55 18 16 18H2ZM3 14H8V12H3V14ZM10.55 12L15.5 7.05L14.075 5.625L10.55 9.175L9.125 7.75L7.725 9.175L10.55 12ZM3 10H8V8H3V10ZM3 6H8V4H3V6Z" fill="#004536"/>
      </svg>
    ),
    title: 'Penyetoran Berhasil',
    subtitle: 'Unit A-12 • 450 Liters',
    time: 'BARU SAJA',
  },
  {
    id: 2,
    icon: (
      <svg width="16" height="14" viewBox="0 0 22 16" fill="none">
        <path d="M5 16C4.167 16 3.458 15.708 2.875 15.125C2.292 14.542 2 13.833 2 13H0V2C0 1.45 0.196 0.979 0.588 0.588C0.979 0.196 1.45 0 2 0H16V4H19L22 8V13H20C20 13.833 19.708 14.542 19.125 15.125C18.542 15.708 17.833 16 17 16C16.167 16 15.458 15.708 14.875 15.125C14.292 14.542 14 13.833 14 13H8C8 13.833 7.708 14.542 7.125 15.125C6.542 15.708 5.833 16 5 16ZM5 14C5.283 14 5.521 13.904 5.713 13.713C5.904 13.521 6 13.283 6 13C6 12.717 5.904 12.479 5.713 12.288C5.521 12.096 5.283 12 5 12C4.717 12 4.479 12.096 4.288 12.288C4.096 12.479 4 12.717 4 13C4 13.283 4.096 13.521 4.288 13.713C4.479 13.904 4.717 14 5 14ZM17 14C17.283 14 17.521 13.904 17.713 13.713C17.904 13.521 18 13.283 18 13C18 12.717 17.904 12.479 17.713 12.288C17.521 12.096 17.283 12 17 12C16.717 12 16.479 12.096 16.288 12.288C16.096 12.479 16 12.717 16 13C16 13.283 16.096 13.521 16.288 13.713C16.479 13.904 16.717 14 17 14ZM16 9H20.25L18 6H16V9Z" fill="#3F4945"/>
      </svg>
    ),
    title: 'Armada Keluar',
    subtitle: 'Truck #09 • Menuju Gubeng',
    time: '5 MENIT LALU',
  },
]

const UPCOMING_PICKUPS = [
  { id: 1, name: 'Keputih Hub',   time: '14:30 WIB' },
  { id: 2, name: 'Gubeng Point',  time: '16:15 WIB' },
]

const ScheduleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.617 20 7.317 19.738 6.1 19.213C4.883 18.688 3.825 17.975 2.925 17.075C2.025 16.175 1.313 15.117 0.788 13.9C0.263 12.683 0 11.383 0 10C0 8.617 0.263 7.317 0.788 6.1C1.313 4.883 2.025 3.825 2.925 2.925C3.825 2.025 4.883 1.313 6.1 0.788C7.317 0.263 8.617 0 10 0C11.383 0 12.683 0.263 13.9 0.788C15.117 1.313 16.175 2.025 17.075 2.925C17.975 3.825 18.688 4.883 19.213 6.1C19.738 7.317 20 8.617 20 10C20 11.383 19.738 12.683 19.213 13.9C18.688 15.117 17.975 16.175 17.075 17.075C16.175 17.975 15.117 18.688 13.9 19.213C12.683 19.738 11.383 20 10 20ZM10 18C12.233 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.233 18 10C18 7.767 17.225 5.875 15.675 4.325C14.125 2.775 12.233 2 10 2C7.767 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.767 2 10C2 12.233 2.775 14.125 4.325 15.675C5.875 17.225 7.767 18 10 18Z" fill="white"/>
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M9 18C6.7 18 4.696 17.238 2.988 15.713C1.279 14.188 0.3 12.283 0.05 10H2.1C2.333 11.733 3.104 13.167 4.413 14.3C5.721 15.433 7.25 16 9 16C10.95 16 12.604 15.321 13.963 13.963C15.321 12.604 16 10.95 16 9C16 7.05 15.321 5.396 13.963 4.038C12.604 2.679 10.95 2 9 2C7.85 2 6.775 2.267 5.775 2.8C4.775 3.333 3.933 4.067 3.25 5H6V7H0V1H2V3.35C2.85 2.283 3.888 1.458 5.113 0.875C6.338 0.292 7.633 0 9 0C10.25 0 11.421 0.238 12.513 0.713C13.604 1.188 14.554 1.829 15.363 2.638C16.171 3.446 16.813 4.396 17.288 5.488C17.763 6.579 18 7.75 18 9C18 10.25 17.763 11.421 17.288 12.513C16.813 13.604 16.171 14.554 15.363 15.363C14.554 16.171 13.604 16.813 12.513 17.288C11.421 17.763 10.25 18 9 18ZM11.8 13.2L8 9.4V4H10V8.6L13.2 11.8L11.8 13.2Z" fill="#6F7975"/>
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="#BEC9C3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function MapRightPanel({ className = '' }) {
  const [pickupLoading, setPickupLoading] = useState(false)

  const handleSchedule = async () => {
    setPickupLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setPickupLoading(false)
  }

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
        <TankGauge percent={TANK_PERCENT} />
      </div>

      {/* Live Activity */}
      <div className="flex flex-col gap-3 px-6 py-5 border-b border-[rgba(190,201,195,0.20)]">
        <div className="flex items-center justify-between">
          <span className="text-[#051C37] text-sm font-bold leading-5">Live Activity</span>
          <span className="w-2 h-2 rounded-full bg-[#006C49] status-pulse block shrink-0" />
        </div>

        <div className="flex flex-col gap-3">
          {LIVE_ACTIVITIES.map((act, i) => (
            <div
              key={act.id}
              className="flex items-start gap-3 animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="w-9 h-9 rounded-xl bg-[#F0F3FF] flex items-center justify-center shrink-0">
                {act.icon}
              </div>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[#051C37] text-sm font-semibold leading-5 truncate">
                  {act.title}
                </span>
                <span className="text-[#3F4945] text-xs leading-4 truncate">{act.subtitle}</span>
                <span className="text-[#BEC9C3] text-[10px] font-bold tracking-wider mt-0.5">
                  {act.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Pickups */}
      <div className="flex flex-col gap-3 px-6 py-5 flex-1">
        <span className="text-[#051C37] text-sm font-bold leading-5">Upcoming Pickups</span>

        <div className="flex flex-col gap-2">
          {UPCOMING_PICKUPS.map((pickup, i) => (
            <button
              key={pickup.id}
              className="flex items-center gap-3 w-full px-3 py-3 rounded-xl
                border border-[rgba(190,201,195,0.30)] bg-white
                hover:border-[#004536]/30 hover:bg-[#004536]/[0.02]
                active:scale-[0.98] transition-all duration-150 text-left
                animate-fade-in"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#F5F5F5] flex items-center justify-center shrink-0">
                <ClockIcon />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-[#051C37] text-sm font-semibold leading-5 truncate">
                  {pickup.name}
                </span>
                <span className="text-[#6F7975] text-xs leading-4">{pickup.time}</span>
              </div>
              <ChevronRightIcon />
            </button>
          ))}
        </div>
      </div>

      {/* Schedule button */}
      <div className="px-6 pb-6 shrink-0">
        <button
          onClick={handleSchedule}
          disabled={pickupLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
            bg-gradient-to-r from-[#004536] to-[#006C49]
            text-white font-bold text-sm leading-6
            shadow-[0_10px_15px_-3px_rgba(0,69,54,0.20)]
            hover:shadow-[0_16px_24px_-4px_rgba(0,69,54,0.35)]
            hover:-translate-y-0.5 active:translate-y-0 active:scale-95
            transition-all duration-200 disabled:opacity-60"
        >
          <ScheduleIcon />
          {pickupLoading ? 'Menjadwalkan...' : 'Jadwalkan Penjemputan Baru'}
        </button>
      </div>
    </aside>
  )
}
