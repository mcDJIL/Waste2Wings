import { useNavigate, useLocation, NavLink } from 'react-router-dom'
import { useAuth } from '../../../contexts/AuthContext'
import { useLogout } from '../../../hooks/useLogout'

const NAV_ITEMS = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/collector/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0ZM2 8H6V2H2V8ZM12 16H16V10H12V16ZM12 4H16V2H12V4ZM2 16H6V14H2V16Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'setoran',
    label: 'Setoran Masuk',
    route: '/collector/validation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M1 18C0.716667 18 0.479167 17.9042 0.2875 17.7125C0.0958333 17.5208 0 17.2833 0 17C0 16.7167 0.0958333 16.4792 0.2875 16.2875C0.479167 16.0958 0.716667 16 1 16H2V10H1C0.716667 10 0.479167 9.90417 0.2875 9.7125C0.0958333 9.52083 0 9.28333 0 9C0 8.71667 0.0958333 8.47917 0.2875 8.2875C0.479167 8.09583 0.716667 8 1 8H2V2H1C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H17C17.2833 0 17.5208 0.0958333 17.7125 0.2875C17.9042 0.479167 18 0.716667 18 1C18 1.28333 17.9042 1.52083 17.7125 1.7125C17.5208 1.90417 17.2833 2 17 2H16V8H17C17.2833 8 17.5208 8.09583 17.7125 8.2875C17.9042 8.47917 18 8.71667 18 9C18 9.28333 17.9042 9.52083 17.7125 9.7125C17.5208 9.90417 17.2833 10 17 10H16V16H17C17.2833 16 17.5208 16.0958 17.7125 16.2875C17.9042 16.4792 18 16.7167 18 17C18 17.2833 17.9042 17.5208 17.7125 17.7125C17.5208 17.9042 17.2833 18 17 18H1Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'peta',
    label: 'Peta Aktif',
    route: '/collector/map',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M12 18L6 15.9L1.35 17.7C1.01667 17.8333 0.708333 17.7958 0.425 17.5875C0.141667 17.3792 0 17.1 0 16.75V2.75C0 2.53333 0.0625 2.34167 0.1875 2.175C0.3125 2.00833 0.483333 1.88333 0.7 1.8L6 0L12 2.1L16.65 0.3C16.9833 0.166667 17.2917 0.204167 17.575 0.4125C17.8583 0.620833 18 0.9 18 1.25V15.25C18 15.4667 17.9375 15.6583 17.8125 15.825C17.6875 15.9917 17.5167 16.1167 17.3 16.2L12 18ZM11 15.55V3.85L7 2.45V14.15L11 15.55Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'pengajuan',
    label: 'Pengajuan ke HEN',
    route: '/collector/batch',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 13H10V8H9V13ZM9 7H10V6H9V7ZM2 16L0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V14C18 14.55 17.8042 15.0208 17.4125 15.4125C17.0208 15.8042 16.55 16 16 16H2ZM2.85 14H16V2H2V14.125L2.85 14Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'histori',
    label: 'Histori',
    route: '/collector/history',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M9 18C6.7 18 4.69583 17.2375 2.9875 15.7125C1.27917 14.1875 0.3 12.2833 0.05 10H2.1C2.33333 11.7333 3.10417 13.1667 4.4125 14.3C5.72083 15.4333 7.25 16 9 16C10.95 16 12.6042 15.3208 13.9625 13.9625C15.3208 12.6042 16 10.95 16 9C16 7.05 15.3208 5.39583 13.9625 4.0375C12.6042 2.67917 10.95 2 9 2C7.85 2 6.775 2.26667 5.775 2.8C4.775 3.33333 3.93333 4.06667 3.25 5H6V7H0V1H2V3.35C2.85 2.28333 3.8875 1.45833 5.1125 0.875C6.3375 0.291667 7.63333 0 9 0C10.25 0 11.4208 0.2375 12.5125 0.7125C13.6042 1.1875 14.5542 1.82917 15.3625 2.6375C16.1708 3.44583 16.8125 4.39583 17.2875 5.4875C17.7625 6.57917 18 7.75 18 9C18 10.25 17.7625 11.4208 17.2875 12.5125C16.8125 13.6042 16.1708 14.5542 15.3625 15.3625C14.5542 16.1708 13.6042 16.8125 12.5125 17.2875C11.4208 17.7625 10.25 18 9 18ZM11.8 13.2L8 9.4V4H10V8.6L13.2 11.8L11.8 13.2Z" fill="currentColor" />
      </svg>
    ),
  },
]

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <path d="M7.3 20L6.9 16.8C6.68333 16.7167 6.47917 16.6167 6.2875 16.5C6.09583 16.3833 5.90833 16.2583 5.725 16.125L2.75 17.375L0 12.625L2.575 10.675C2.55833 10.5583 2.55 10.4458 2.55 10.3375V9.6625C2.55 9.55417 2.55833 9.44167 2.575 9.325L0 7.375L2.75 2.625L5.725 3.875C5.90833 3.74167 6.1 3.61667 6.3 3.5C6.5 3.38333 6.7 3.28333 6.9 3.2L7.3 0H12.8L13.2 3.2C13.4167 3.28333 13.6208 3.38333 13.8125 3.5C14.0042 3.61667 14.1917 3.74167 14.375 3.875L17.35 2.625L20.1 7.375L17.525 9.325C17.5417 9.44167 17.55 9.55417 17.55 9.6625V10.3375C17.55 10.4458 17.5333 10.5583 17.5 10.675L20.075 12.625L17.325 17.375L14.375 16.125C14.1917 16.2583 14 16.3833 13.8 16.5C13.6 16.6167 13.4 16.7167 13.2 16.8L12.8 20H7.3Z" fill="currentColor" />
  </svg>
)

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="currentColor" />
  </svg>
)

function NavItem({ item, isActive, onClick }) {
  return (
    <NavLink
      to={item.route}
      onClick={onClick}
      className={({ isActive: navActive }) =>
        [
          'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
          navActive
            ? 'bg-[#0B5E4B] text-white font-bold shadow-[0_0_20px_0_rgba(11,94,75,0.05)]'
            : 'text-[#D5E3FF] hover:bg-white/5 font-normal',
        ].join(' ')
      }
    >
      <span className="flex-shrink-0 w-5 flex items-center justify-center">
        {item.icon}
      </span>
      <span className="text-sm leading-6">{item.label}</span>
    </NavLink>
  )
}

export default function CollectorSidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { user } = useAuth()
  const handleLogout = useLogout()

  const getActiveId = () => {
    if (pathname.startsWith('/collector/validation')) return 'setoran'
    if (pathname.startsWith('/collector/map'))     return 'peta'
    if (pathname.startsWith('/collector/batch')) return 'pengajuan'
    if (pathname.startsWith('/collector/history')) return 'histori'
    if (pathname.startsWith('/collector/settings')) return 'pengaturan'
    return 'dashboard'
  }

  const activeNav = getActiveId()

  const handleNav = (route) => {
    if (route) navigate(route)
    onClose()
  }

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={[
          'fixed top-0 left-0 h-full w-[280px] bg-[#051C37] z-40 flex flex-col',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-6 pt-7 pb-4">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/30f7b17162844e6618a588f8aa7300aeba8a1470?width=73"
            alt="HEN Logo"
            className="w-9 h-9 rounded-full flex-shrink-0"
          />
          <div>
            <p className="text-[#81F9C1] font-bold text-base leading-5">HEN Waste Oil</p>
            <p className="text-white/60 text-[11px] font-bold tracking-[0.55px] uppercase leading-4">
              COLLECTOR PORTAL
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-6 pt-4 flex flex-col gap-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeNav === item.id}
              onClick={() => handleNav(item.route)}
            />
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-6 my-4 border-t border-white/20" />

        {/* Settings */}
        <div className="px-6">
          <NavLink
            to="/collector/settings"
            className="flex items-center gap-4 px-4 py-2 text-[#D5E3FF] hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M6.08333 16.6667L5.75 14C5.56944 13.9306 5.39931 13.8472 5.23958 13.75C5.07986 13.6528 4.92361 13.5486 4.77083 13.4375L2.29167 14.4792L0 10.5208L2.14583 8.89583C2.13194 8.79861 2.125 8.70486 2.125 8.61458V8.33333C2.125 8.14236 2.13194 7.86806 2.14583 7.77083L0 6.14583L2.29167 2.1875L4.77083 3.22917C4.92361 3.11806 5.08333 3.01389 5.25 2.91667C5.41667 2.81944 5.58333 2.73611 5.75 2.66667L6.08333 0H10.6667L11 2.66667C11.1806 2.73611 11.3507 2.81944 11.5104 2.91667C11.6701 3.01389 11.8264 3.11806 11.9792 3.22917L14.4583 2.1875L16.75 6.14583L14.6042 7.77083C14.6181 7.86806 14.625 7.96181 14.625 8.05208V8.33333C14.625 8.52431 14.6111 8.79861 14.5833 8.89583L16.7292 10.5208L14.4375 14.4792L11.9792 13.4375C11.8264 13.5486 11.6667 13.6528 11.5 13.75C11.3333 13.8472 11.1667 13.9306 11 14L10.6667 16.6667H6.08333ZM8.41667 11.25C9.22222 11.25 9.90972 10.9653 10.4792 10.3958C11.0486 9.82639 11.3333 9.13889 11.3333 8.33333C11.3333 7.52778 11.0486 6.84028 10.4792 6.27083C9.90972 5.70139 9.22222 5.41667 8.41667 5.41667C7.59722 5.41667 6.90625 5.70139 6.34375 6.27083C5.78125 6.84028 5.5 7.52778 5.5 8.33333C5.5 9.13889 5.78125 9.82639 6.34375 10.3958C6.90625 10.9653 7.59722 11.25 8.41667 11.25Z" fill="currentColor" />
            </svg>
            <span className="text-sm leading-6">Pengaturan</span>
          </NavLink>
        </div>

        {/* User card */}
        <div className="mx-6 my-4 flex items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm">
          <div className="w-10 h-10 rounded-full bg-[#81F9C1] overflow-hidden flex-shrink-0">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/12722183bce6bc818937ff4cd3ae05ff6edf167d?width=80"
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-bold leading-5 truncate">{user?.name || 'User'}</p>
            <p className="text-white/50 text-[10px] uppercase tracking-[-0.5px] leading-4">COLLECTOR MEMBER</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white/70 transition-colors duration-200 flex-shrink-0"
            title="Logout"
          >
            <LogoutIcon />
          </button>
        </div>
      </aside>
    </>
  )
}
