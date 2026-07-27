export default function TopNav({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-6 md:px-10 py-4 h-[72px] md:h-[88px] border-b border-white/20 bg-[rgba(249,249,255,0.70)] backdrop-blur-xl">
      {/* Left: hamburger + title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 rounded-lg text-[#004536] hover:bg-[#004536]/10 transition-colors duration-200 flex-shrink-0"
          aria-label="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M2 15v-2h16v2H2zm0-4.5v-2h16v2H2zM2 6V4h16v2H2z" fill="currentColor" />
          </svg>
        </button>

        <div className="flex items-center gap-3 min-w-0">
          <p className="text-[#004536] text-sm md:text-base font-normal leading-6 tracking-[-0.4px] whitespace-nowrap hidden xs:block">
            Executive Command Center
          </p>
          <span className="hidden sm:flex items-center px-3 py-1 rounded-full border border-[#1D4ED8]/20 bg-[#DEE8FF] text-[#1D4ED8] text-sm font-normal leading-6 whitespace-nowrap">
            Stakeholder HEN
          </span>
        </div>
      </div>

      {/* Center: search */}
      <div className="flex-1 max-w-xs hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#DEE8FF]">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" className="flex-shrink-0 text-[#6F7975]">
          <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="currentColor" />
        </svg>
        <input
          type="text"
          placeholder="Cari data strategis..."
          className="w-full bg-transparent text-sm text-[#6B7280] placeholder:text-[#6B7280] outline-none"
        />
      </div>

      {/* Right: user info */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="text-right hidden sm:block">
          <p className="text-[#051C37] text-sm font-normal leading-6">Direktur Operasional</p>
          <p className="text-[#3F4945] text-sm font-normal leading-6">Verified Access</p>
        </div>
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/2f3ca51d5a565cc0c955d4ead0d405eff2d5e518?width=80"
          alt="Avatar"
          className="w-10 h-10 rounded-full border-2 border-[#004536] object-cover flex-shrink-0"
        />
      </div>
    </header>
  )
}
