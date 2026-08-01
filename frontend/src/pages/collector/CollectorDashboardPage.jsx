import { useState, useEffect } from 'react'
import api from '../../services/api'
import CollectorSidebar from '../../sections/collector/dashboard/CollectorSidebar'
import CollectorTopBar from '../../sections/collector/dashboard/CollectorTopBar'
import CollectorWelcome from '../../sections/collector/dashboard/CollectorWelcome'
import CollectorKpiGrid from '../../sections/collector/dashboard/CollectorKpiGrid'
import VolumeChart from '../../sections/collector/dashboard/VolumeChart'
import ActiveDepositsMap from '../../sections/collector/dashboard/ActiveDepositsMap'
import DepositsTable from '../../sections/collector/dashboard/DepositsTable'
import CollectorFooter from '../../sections/collector/dashboard/CollectorFooter'

export default function CollectorDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get('/dashboard/collector')
        console.log('Dashboard response:', response.data)
        const data = response.data?.data || response.data
        console.log('Dashboard data:', data)
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to fetch dashboard:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboard()
  }, [])

  const handleInputSetoran = () => {
    // TODO: open setoran modal or navigate
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex font-poppins">
      <CollectorSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-[279px] min-w-0">
        <CollectorTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 flex flex-col gap-6 px-6 sm:px-12 py-6 sm:py-8">
          {/* Welcome + date + CTA */}
          <CollectorWelcome onInputSetoran={handleInputSetoran} />

          {/* KPI cards */}
          <div className="animate-fade-slide-up" style={{ animationDelay: '80ms' }}>
            <CollectorKpiGrid data={dashboardData} isLoading={isLoading} />
          </div>

          {/* Chart + Map row */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-slide-up"
            style={{ animationDelay: '160ms' }}
          >
            <div className="lg:col-span-2">
              <VolumeChart data={dashboardData?.volumeTrends} isLoading={isLoading} />
            </div>
            <div className="lg:col-span-1">
              <ActiveDepositsMap />
            </div>
          </div>

          {/* Deposits table */}
          <div className="animate-fade-slide-up" style={{ animationDelay: '240ms' }}>
            <DepositsTable submissions={dashboardData?.latestSubmissions} isLoading={isLoading} />
          </div>
        </main>

        <CollectorFooter />
      </div>
    </div>
  )
}
