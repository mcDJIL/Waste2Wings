import { useState } from 'react'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'
import LabHeader from '../../components/stakeholder/lab/LabHeader'
import LabKpiCards from '../../components/stakeholder/lab/LabKpiCards'
import BatchTableSection from '../../sections/stakeholder/lab/BatchTableSection'
import BatchDetailSection from '../../sections/stakeholder/lab/BatchDetailSection'

export default function LabPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState('BAT-9895')

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
          {/* Page header */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '0ms' }}>
            <LabHeader />
          </section>

          {/* KPI cards */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '60ms' }}>
            <LabKpiCards />
          </section>

          {/* Batch analysis table */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '120ms' }}>
            <BatchTableSection
              selectedBatchId={selectedBatchId}
              onSelectBatch={setSelectedBatchId}
            />
          </section>

          {/* Batch detail + spectrometry */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '180ms' }}>
            <BatchDetailSection selectedBatchId={selectedBatchId} />
          </section>
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
