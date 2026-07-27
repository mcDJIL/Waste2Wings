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

          {/* Tab navigation */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '80ms' }}>
            <TabNavigation activeTab={activeTab} onChange={setActiveTab} />
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

            {activeTab === 'Pengajuan' && <PlaceholderTab title="Pengajuan Pengepul" />}
            {activeTab === 'Lab' && <PlaceholderTab title="Hasil Uji Lab" />}
            {activeTab === 'Peta' && <PlaceholderTab title="Peta Sebaran" />}
            {activeTab === 'Prediksi' && <PlaceholderTab title="Prediksi Dana" />}
            {activeTab === 'Harga Acuan' && <PlaceholderTab title="Harga Acuan" />}
          </section>
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>

      {/* Floating action button */}
      <button className="fixed bottom-6 right-6 w-14 h-14 flex items-center justify-center rounded-full bg-[#0B5E4B] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)] text-white transition-all duration-200 hover:scale-110 hover:bg-[#004536] active:scale-95 z-30">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M7.5 10H0V7.5H7.5V0H10V7.5H17.5V10H10V17.5H7.5V10Z" fill="white" />
        </svg>
      </button>
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
