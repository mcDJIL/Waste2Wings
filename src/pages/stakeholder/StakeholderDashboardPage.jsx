import { useState } from 'react'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import KpiCards from '../../components/stakeholder/KpiCards'
import TabNavigation from '../../components/stakeholder/TabNavigation'
import SubmissionCards from '../../components/stakeholder/SubmissionCards'
import PredictionChart from '../../components/stakeholder/PredictionChart'
import MapWidget from '../../components/stakeholder/MapWidget'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'

export default function StakeholderDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('Overview')

  return (
    <div className="flex min-h-screen bg-[#F5F7F6]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px] transition-all duration-300">
        {/* Top nav */}
        <TopNav onMenuToggle={() => setSidebarOpen((v) => !v)} />

        {/* Scrollable content */}
        <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-8 gap-8 overflow-y-auto">
          {/* KPI cards */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '0ms' }}>
            <KpiCards />
          </section>

          {/* Tab content */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '160ms' }}>
            {activeTab === 'Overview' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                {/* Left column */}
                <div className="xl:col-span-8 flex flex-col gap-6">
                  <SubmissionCards />
                  <PredictionChart />
                </div>

                {/* Right column */}
                <div className="xl:col-span-4">
                  <MapWidget />
                </div>
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  )
}

function PlaceholderTab({ title }) {
  return (
    <div className="flex items-center justify-center min-h-[300px] rounded-2xl border border-[#BEC9C3]/30 bg-white/70 backdrop-blur-[10px]">
      <div className="text-center">
        <p className="text-[#051C37] text-lg font-semibold mb-2">{title}</p>
        <p className="text-[#3F4945] text-sm">Konten akan segera tersedia.</p>
      </div>
    </div>
  )
}
