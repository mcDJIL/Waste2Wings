const BellIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
    <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z" fill="#404945" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 15V13.5H18V15H2ZM2 10.75V9.25H18V10.75H2ZM2 6.5V5H18V6.5H2Z" fill="#3F4945" />
  </svg>
)

export default function SettingsTopBar({ onMenuToggle }) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 xs:px-6 sm:px-12 h-16 bg-white/70 backdrop-blur-[6px] border-b border-white/20 shadow-sm">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0"
          aria-label="Toggle sidebar"
        >
          <HamburgerIcon />
        </button>

        <h1 className="text-[#002D22] text-lg xs:text-xl sm:text-2xl font-bold leading-tight">
          Pengaturan Akun
        </h1>
      </div>

      {/* Bell notification */}
      <button
        className="relative p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
        aria-label="Notifications"
      >
        <BellIcon />
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#BA1A1A] border-2 border-white" />
      </button>
    </header>
  )
}
