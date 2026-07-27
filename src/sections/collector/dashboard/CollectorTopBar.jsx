import { useState } from 'react'

const SearchIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M9.68333 10.5L6.00833 6.825C5.71667 7.05833 5.38125 7.24306 5.00208 7.37917C4.62292 7.51528 4.21944 7.58333 3.79167 7.58333C2.73194 7.58333 1.83507 7.21632 1.10104 6.48229C0.367014 5.74826 0 4.85139 0 3.79167C0 2.73194 0.367014 1.83507 1.10104 1.10104C1.83507 0.367014 2.73194 0 3.79167 0C4.85139 0 5.74826 0.367014 6.48229 1.10104C7.21632 1.83507 7.58333 2.73194 7.58333 3.79167C7.58333 4.21944 7.51528 4.62292 7.37917 5.00208C7.24306 5.38125 7.05833 5.71667 6.825 6.00833L10.5 9.68333L9.68333 10.5ZM3.79167 6.41667C4.52083 6.41667 5.14062 6.16146 5.65104 5.65104C6.16146 5.14062 6.41667 4.52083 6.41667 3.79167C6.41667 3.0625 6.16146 2.44271 5.65104 1.93229C5.14062 1.42188 4.52083 1.16667 3.79167 1.16667C3.0625 1.16667 2.44271 1.42188 1.93229 1.93229C1.42188 2.44271 1.16667 3.0625 1.16667 3.79167C1.16667 4.52083 1.42188 5.14062 1.93229 5.65104C2.44271 6.16146 3.0625 6.41667 3.79167 6.41667Z" fill="#8E8994" />
  </svg>
)

const BellIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
    <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z" fill="#5A5661" />
  </svg>
)

const PengepulStarIcon = () => (
  <svg width="8" height="11" viewBox="0 0 8 11" fill="none">
    <path d="M2.8375 5.85L3.275 4.425L2.125 3.5H3.55L4 2.1L4.45 3.5H5.875L4.7125 4.425L5.15 5.85L4 4.9625L2.8375 5.85ZM1 10.5V6.6375C0.683333 6.2875 0.4375 5.8875 0.2625 5.4375C0.0875 4.9875 0 4.50833 0 4C0 2.88333 0.3875 1.9375 1.1625 1.1625C1.9375 0.3875 2.88333 0 4 0C5.11667 0 6.0625 0.3875 6.8375 1.1625C7.6125 1.9375 8 2.88333 8 4C8 4.50833 7.9125 4.9875 7.7375 5.4375C7.5625 5.8875 7.31667 6.2875 7 6.6375V10.5L4 9.5L1 10.5ZM4 7C4.83333 7 5.54167 6.70833 6.125 6.125C6.70833 5.54167 7 4.83333 7 4C7 3.16667 6.70833 2.45833 6.125 1.875C5.54167 1.29167 4.83333 1 4 1C3.16667 1 2.45833 1.29167 1.875 1.875C1.29167 2.45833 1 3.16667 1 4C1 4.83333 1.29167 5.54167 1.875 6.125C2.45833 6.70833 3.16667 7 4 7Z" fill="#403100" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 15V13.5H18V15H2ZM2 10.75V9.25H18V10.75H2ZM2 6.5V5H18V6.5H2Z" fill="#5A5661" />
  </svg>
)

export default function CollectorTopBar({ onMenuToggle }) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 sm:px-12 h-16 gap-4
      border-b border-[#E0DBDF]/40 bg-[#FAF9F6]/80 backdrop-blur-[8px] font-poppins">

      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg
          hover:bg-[#E0DBDF]/40 active:bg-[#E0DBDF]/70 transition-colors shrink-0"
        aria-label="Toggle menu"
      >
        <HamburgerIcon />
      </button>

      {/* Search bar */}
      <div className="flex-1 max-w-xl relative">
        <div className={`flex items-center gap-3 px-4 py-2 rounded-full border bg-[#FCFAF8]
          transition-all duration-200
          ${searchFocused
            ? 'border-[#5A4199]/40 shadow-[0_0_0_3px_rgba(90,65,153,0.10)]'
            : 'border-[#E0DBDF]'
          }`}>
          <span className="shrink-0">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Cari setoran, penyetor, atau ID transaksi..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent text-[#1D1B1A] text-sm outline-none
              placeholder:text-[#8E8994]/60 min-w-0 font-poppins"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Bell with notification dot */}
        <button className="relative p-2 rounded-full hover:bg-[#E0DBDF]/40 transition-colors">
          <BellIcon />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#BA1A1A] border-2 border-[#FAF9F6]" />
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-[#E0DBDF]" />

        {/* PENGEPUL badge */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
          border border-[#C19A00]/20 bg-[#F0C34D] shadow-sm">
          <PengepulStarIcon />
          <span className="text-[10px] font-bold text-[#403100] tracking-[0.5px] uppercase font-poppins">
            PENGEPUL
          </span>
        </div>
      </div>
    </header>
  )
}
