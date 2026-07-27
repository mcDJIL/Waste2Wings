import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useLogout } from '../../hooks/useLogout'

const navItems = [
  {
    label: 'Dashboard',
    path: '/stakeholder/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M10 6V0H18V6H10ZM0 10V0H8V10H0ZM10 18V8H18V18H10ZM0 18V12H8V18H0ZM2 8H6V2H2V8ZM12 16H16V10H12V16ZM12 4H16V2H12V4ZM2 16H6V14H2V16Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Pengajuan Pengepul',
    path: '/stakeholder/approve',
    icon: (
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
        <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.2C6.41667 1.4 6.77917 0.916667 7.2875 0.55C7.79583 0.183333 8.36667 0 9 0C9.63333 0 10.2042 0.183333 10.7125 0.55C11.2208 0.916667 11.5833 1.4 11.8 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V4H2V18ZM4 16H11V14H4V16ZM4 12H14V10H4V12ZM4 8H14V6H4V8ZM9 3.25C9.21667 3.25 9.39583 3.17917 9.5375 3.0375C9.67917 2.89583 9.75 2.71667 9.75 2.5C9.75 2.28333 9.67917 2.10417 9.5375 1.9625C9.39583 1.82083 9.21667 1.75 9 1.75C8.78333 1.75 8.60417 1.82083 8.4625 1.9625C8.32083 2.10417 8.25 2.28333 8.25 2.5C8.25 2.71667 8.32083 2.89583 8.4625 3.0375C8.60417 3.17917 8.78333 3.25 9 3.25ZM2 18V4V18Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Uji Lab',
    path: '/stakeholder/lab-test',
    icon: (
      <svg width="16" height="19" viewBox="0 0 16 19" fill="none">
        <path d="M0 19V17H5V15C3.61667 15 2.4375 14.5125 1.4625 13.5375C0.4875 12.5625 0 11.3833 0 10C0 8.98333 0.279167 8.05833 0.8375 7.225C1.39583 6.39167 2.15 5.78333 3.1 5.4C3.23333 4.83333 3.52917 4.375 3.9875 4.025C4.44583 3.675 4.96667 3.5 5.55 3.5L5 1.95L5.95 1.6L5.6 0.7L7.5 0L7.8 0.95L8.75 0.6L11.5 8.1L10.55 8.45L10.9 9.4L9 10.1L8.7 9.15L7.75 9.5L7.15 7.85C6.9 8.08333 6.6125 8.25833 6.2875 8.375C5.9625 8.49167 5.63333 8.53333 5.3 8.5C4.93333 8.46667 4.59167 8.35417 4.275 8.1625C3.95833 7.97083 3.68333 7.73333 3.45 7.45C3 7.71667 2.64583 8.075 2.3875 8.525C2.12917 8.975 2 9.46667 2 10C2 10.8333 2.29167 11.5417 2.875 12.125C3.45833 12.7083 4.16667 13 5 13H13V15H8V17H14V19H0ZM8.65 7.55L9.55 7.2L7.85 2.5L6.9 2.85L8.65 7.55ZM5.5 7C5.78333 7 6.02083 6.90417 6.2125 6.7125C6.40417 6.52083 6.5 6.28333 6.5 6C6.5 5.71667 6.40417 5.47917 6.2125 5.2875C6.02083 5.09583 5.78333 5 5.5 5C5.21667 5 4.97917 5.09583 4.7875 5.2875C4.59583 5.47917 4.5 5.71667 4.5 6C4.5 6.28333 4.59583 6.52083 4.7875 6.7125C4.97917 6.90417 5.21667 7 5.5 7Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Peta Sebaran',
    path: '/stakeholder/map',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M12 18L6 15.9L1.35 17.7C1.01667 17.8333 0.708333 17.7958 0.425 17.5875C0.141667 17.3792 0 17.1 0 16.75V2.75C0 2.53333 0.0625 2.34167 0.1875 2.175C0.3125 2.00833 0.483333 1.88333 0.7 1.8L6 0L12 2.1L16.65 0.3C16.9833 0.166667 17.2917 0.204167 17.575 0.4125C17.8583 0.620833 18 0.9 18 1.25V15.25C18 15.4667 17.9375 15.6583 17.8125 15.825C17.6875 15.9917 17.5167 16.1167 17.3 16.2L12 18ZM11 15.55V3.85L7 2.45V14.15L11 15.55ZM13 15.55L16 14.55V2.7L13 3.85V15.55ZM2 15.3L5 14.15V2.45L2 3.45V15.3Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Prediksi Dana',
    path: '/stakeholder/prediction',
    icon: (
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
        <path d="M1.4 12L0 10.6L7.4 3.15L11.4 7.15L16.6 2H14V0H20V6H18V3.4L11.4 10L7.4 6L1.4 12Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Harga Acuan',
    path: '/stakeholder/price-reference',
    icon: (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
        <path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.19583 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10ZM19 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16Z" fill="currentColor" />
      </svg>
    ),
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const handleLogout = useLogout()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
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
              STATA PORTAL
            </p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-6 pt-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                [
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group',
                  isActive
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
          ))}
        </nav>

        {/* Divider */}
        <div className="mx-6 my-4 border-t border-white/20" />

        {/* Settings */}
        <div className="px-6">
          <NavLink
            to="/stakeholder/settings"
            className="flex items-center gap-4 px-4 py-2 text-[#D5E3FF] hover:bg-white/5 rounded-lg transition-all duration-200"
          >
            <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
              <path d="M6.08333 16.6667L5.75 14C5.56944 13.9306 5.39931 13.8472 5.23958 13.75C5.07986 13.6528 4.92361 13.5486 4.77083 13.4375L2.29167 14.4792L0 10.5208L2.14583 8.89583C2.13194 8.79861 2.125 8.70486 2.125 8.61458V8.33333C2.125 8.14236 2.13194 7.86806 2.14583 7.77083L0 6.14583L2.29167 2.1875L4.77083 3.22917C4.92361 3.11806 5.08333 3.01389 5.25 2.91667C5.41667 2.81944 5.58333 2.73611 5.75 2.66667L6.08333 0H10.6667L11 2.66667C11.1806 2.73611 11.3507 2.81944 11.5104 2.91667C11.6701 3.01389 11.8264 3.11806 11.9792 3.22917L14.4583 2.1875L16.75 6.14583L14.6042 7.77083C14.6181 7.86806 14.625 7.96181 14.625 8.05208V8.33333C14.625 8.52431 14.6111 8.79861 14.5833 8.89583L16.7292 10.5208L14.4375 14.4792L11.9792 13.4375C11.8264 13.5486 11.6667 13.6528 11.5 13.75C11.3333 13.8472 11.1667 13.9306 11 14L10.6667 16.6667H6.08333ZM8.41667 11.25C9.22222 11.25 9.90972 10.9653 10.4792 10.3958C11.0486 9.82639 11.3333 9.13889 11.3333 8.33333C11.3333 7.52778 11.0486 6.84028 10.4792 6.27083C9.90972 5.70139 9.22222 5.41667 8.41667 5.41667C7.59722 5.41667 6.90625 5.70139 6.34375 6.27083C5.78125 6.84028 5.5 7.52778 5.5 8.33333C5.5 9.13889 5.78125 9.82639 6.34375 10.3958C6.90625 10.9653 7.59722 11.25 8.41667 11.25Z" fill="currentColor" />
            </svg>
            <span className="text-sm leading-6">Pengaturan</span>
          </NavLink>
        </div>

        {/* Request Pickup button */}
        <div className="px-6 mt-4">
          <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0B5E4B] text-white font-bold text-sm transition-all duration-200 hover:bg-[#0d7560] hover:shadow-lg active:scale-95">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="white" />
            </svg>
            Request Pickup
          </button>
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
            <p className="text-white/50 text-[10px] uppercase tracking-[-0.5px] leading-4">STAKEHOLDER MEMBER</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/40 hover:text-white/70 transition-colors duration-200 flex-shrink-0"
            title="Logout"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H9V18H2ZM13 14L11.625 12.55L14.175 10H6V8H14.175L11.625 5.45L13 4L18 9L13 14Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  )
}
