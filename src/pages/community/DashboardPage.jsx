import { useState, useEffect } from 'react'
import Sidebar from '../../sections/community/dashboard/Sidebar'
import TopBar from '../../sections/community/dashboard/TopBar'
import StatCards from '../../sections/community/dashboard/StatCards'
import ActivityFeed from '../../sections/community/dashboard/ActivityFeed'
import MapPreviewCard from '../../sections/community/dashboard/MapPreviewCard'
import DashboardFooter from '../../sections/community/dashboard/DashboardFooter'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

const LeafIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M8.25 17.0247C7.7 17.0247 7.14583 16.9622 6.5875 16.8372C6.02917 16.7122 5.45833 16.5331 4.875 16.2997C5.075 14.2831 5.65833 12.3997 6.625 10.6497C7.59167 8.89972 8.83333 7.35805 10.35 6.02472C8.51667 6.95805 6.92917 8.19139 5.5875 9.72472C4.24583 11.2581 3.30833 13.0081 2.775 14.9747C2.70833 14.9247 2.64583 14.8706 2.5875 14.8122C2.52917 14.7539 2.46667 14.6914 2.4 14.6247C1.61667 13.8414 1.02083 12.9664 0.6125 11.9997C0.204167 11.0331 0 10.0247 0 8.97472C0 7.84139 0.225 6.75805 0.675 5.72472C1.125 4.69139 1.75 3.77472 2.55 2.97472C3.9 1.62472 5.65 0.745552 7.8 0.337219C9.95 -0.0711142 12.9667 -0.108614 16.85 0.224719C17.15 4.20805 17.1 7.24555 16.7 9.33722C16.3 11.4289 15.4333 13.1414 14.1 14.4747C13.2833 15.2914 12.3708 15.9206 11.3625 16.3622C10.3542 16.8039 9.31667 17.0247 8.25 17.0247Z" fill="#006C49" />
  </svg>
)

function LevelBadge() {
  return (
    <div className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full
      border border-[#81F9C1] bg-[#81F9C1]/30 shrink-0">
      <LeafIcon />
      <span className="text-xs sm:text-sm font-semibold text-[#00734E] whitespace-nowrap">
        Level: Pahlawan Lingkungan
      </span>
    </div>
  )
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const username = user?.name || 'User'

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return 'Pagi'
    if (hour < 15) return 'Siang'
    return 'Sore'
  }

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/dashboard/community')
        setDashboardData(response.data)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-[287px] min-w-0">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-12">
          <div className="animate-fade-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6 sm:mb-8">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-[#004536]">
                  Selamat {getGreeting()}, {username}!
                </h1>
                <p className="text-[#3F4945] text-sm sm:text-base mt-0.5">
                  Kontribusimu hari ini menyelamatkan ekosistem kita.
                </p>
              </div>
              <LevelBadge />
            </div>
          </div>

          <div className="animate-fade-slide-up mb-6 sm:mb-8" style={{ animationDelay: '80ms' }}>
            <StatCards data={dashboardData?.summary} isLoading={isLoading} />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8
            animate-fade-slide-up" style={{ animationDelay: '160ms' }}>
            <div className="xl:col-span-2 flex flex-col gap-6 sm:gap-8 h-full">
              <ActivityFeed activities={dashboardData?.recentActivities} isLoading={isLoading} />
            </div>
            <div>
              <MapPreviewCard />
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
