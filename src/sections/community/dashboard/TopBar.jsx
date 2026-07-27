import { useState, useEffect } from 'react'
import { useAuth } from '../../../contexts/AuthContext'
import api from '../../../services/api'

const SearchIcon = () => (
  <svg className="shrink-0 text-[#6F7975]" width="16" height="16" viewBox="0 0 18 18" fill="none">
    <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="currentColor" />
  </svg>
)

const BellIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
    <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z" fill="#3F4945" />
  </svg>
)

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M15 5L5 15M5 5L15 15" stroke="#3F4945" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const HamburgerIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 15V13.5H18V15H2ZM2 10.75V9.25H18V10.75H2ZM2 6.5V5H18V6.5H2Z" fill="#3F4945" />
  </svg>
)

export default function TopBar({ onMenuToggle }) {
  const [searchFocused, setSearchFocused] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activities, setActivities] = useState([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (notificationsOpen) {
      loadActivities()
    }
  }, [notificationsOpen])

  const loadActivities = async () => {
    try {
      setIsLoadingActivities(true)
      const response = await api.get('/dashboard/community')
      setActivities(response.data?.recentActivities || [])
    } catch (error) {
      console.error('Failed to load activities:', error)
    } finally {
      setIsLoadingActivities(false)
    }
  }

  const getActivityIcon = (type) => {
    switch (type?.toUpperCase()) {
      case 'SUBMISSION_CREATED':
        return '📤'
      case 'SUBMISSION_ACCEPTED':
        return '✅'
      case 'SUBMISSION_COMPLETED':
        return '🎉'
      case 'PAYMENT_RECEIVED':
        return '💰'
      default:
        return '📢'
    }
  }

  const getActivityTitle = (activity) => {
    if (activity.title) return activity.title

    const typeMap = {
      'SUBMISSION_CREATED': 'Setoran Baru Dibuat',
      'SUBMISSION_ACCEPTED': 'Setoran Diterima Pengepul',
      'SUBMISSION_COMPLETED': 'Setoran Selesai',
      'SUBMISSION_REJECTED': 'Setoran Ditolak',
      'PAYMENT_RECEIVED': 'Pembayaran Diterima',
    }
    return typeMap[activity.type] || 'Notifikasi Baru'
  }

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setNotificationsOpen(false)
    }

    if (notificationsOpen) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [notificationsOpen])

  return (
    <header className="sticky top-0 z-30 flex items-center px-4 h-[74px] gap-4
      bg-white/70 backdrop-blur-[10px] border-b border-white/20 shadow-sm">

      <button
        onClick={onMenuToggle}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg
          hover:bg-gray-100 active:bg-gray-200 transition-colors shrink-0"
        aria-label="Toggle sidebar"
      >
        <HamburgerIcon />
      </button>

      <div className={`flex-1 max-w-[512px] relative transition-all duration-200
        ${searchFocused ? 'max-w-[600px]' : ''}`}>
        <div className={`flex items-center gap-2 px-4 py-2.5 rounded-full border bg-white/50 transition-all duration-200
          ${searchFocused
            ? 'border-[#006C49]/40 shadow-[0_0_0_3px_rgba(0,108,73,0.10)]'
            : 'border-[#BEC9C3]/30'
          }`}>
          <SearchIcon />
          <input
            type="text"
            placeholder="Cari pengepul atau riwayat..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="flex-1 bg-transparent text-[#051C37] text-sm outline-none placeholder:text-[#6B7280] min-w-0"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto shrink-0">
        {/* Notifications Bell */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative p-2 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Notifications"
          >
            <BellIcon />
            {activities.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 animate-pulse" />
            )}
          </button>

          {/* Notifications Dropdown */}
          {notificationsOpen && (
            <div className="fixed right-4 top-[74px] w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-100px)]
              bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]
              border border-[#BEC9C3]/20 overflow-hidden animate-fade-slide-up z-40">

              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[#BEC9C3]/20">
                <h3 className="text-sm font-bold text-[#004536]">Aktivitas Terkini</h3>
                <button
                  onClick={() => setNotificationsOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-96 overflow-y-auto divide-y divide-[#BEC9C3]/15">
                {isLoadingActivities ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-xs text-[#3F4945]">Memuat aktivitas...</p>
                    </div>
                  </div>
                ) : activities.length === 0 ? (
                  <div className="flex items-center justify-center py-8 px-6">
                    <p className="text-sm text-[#3F4945] text-center">
                      Tidak ada aktivitas terbaru
                    </p>
                  </div>
                ) : (
                  activities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="px-6 py-4 hover:bg-[#F0F3FF]/30 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg shrink-0">
                          {getActivityIcon(activity.type)}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#004536] leading-snug">
                            {getActivityTitle(activity)}
                          </p>
                          {activity.description && (
                            <p className="text-xs text-[#3F4945] mt-1.5 line-clamp-2">
                              {activity.description}
                            </p>
                          )}
                          <p className="text-xs text-[#6B7280] mt-2">
                            {new Date(activity.createdAt).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#006C49] shrink-0 mt-1.5" />
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {activities.length > 0 && (
                <div className="px-6 py-3 border-t border-[#BEC9C3]/20 bg-[#F0F3FF]/50">
                  <button className="text-xs font-semibold text-[#006C49] hover:text-[#004536] transition-colors">
                    Lihat Semua Aktivitas →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden xs:block h-8 border-l border-[#BEC9C3]/30" />

        <div className="hidden xs:flex items-center gap-3">
          <div className="flex flex-col items-end">
            <span className="text-[#051C37] text-sm leading-6 truncate max-w-[120px]">{user?.name || 'User'}</span>
            <span className="text-[10px] font-bold text-[#0B5E4B] bg-[#81F9C1] px-2 py-px rounded-full tracking-wide uppercase">
              {user?.role?.toLowerCase() || 'Masyarakat'}
            </span>
          </div>

          <div className="relative">
            <div className="w-10 h-10 rounded-full border-2 border-[#004536]/20 overflow-hidden bg-[#81F9C1] flex items-center justify-center text-white font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#006C49] rounded-full border-2 border-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
