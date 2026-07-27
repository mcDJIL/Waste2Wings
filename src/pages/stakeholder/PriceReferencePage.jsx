import { useState } from 'react'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'
import PriceReferenceHeader from '../../sections/stakeholder/referenceprice/PriceReferenceHeader'
import KpiSection from '../../sections/stakeholder/referenceprice/KpiSection'
import PriceChartSection from '../../sections/stakeholder/referenceprice/PriceChartSection'
import CorrelationSection from '../../sections/stakeholder/referenceprice/CorrelationSection'
import RegionalAnalysisSection from '../../sections/stakeholder/referenceprice/RegionalAnalysisSection'

export default function PriceReferencePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F5F7F6]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px] transition-all duration-300">
        <TopNav onMenuToggle={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-8 gap-8 overflow-y-auto">
          <section className="animate-fade-slide-up" style={{ animationDelay: '0ms' }}>
            <PriceReferenceHeader />
          </section>

          <section className="animate-fade-slide-up" style={{ animationDelay: '60ms' }}>
            <KpiSection />
          </section>

          <section className="animate-fade-slide-up" style={{ animationDelay: '120ms' }}>
            <PriceChartSection />
          </section>

          <section className="animate-fade-slide-up" style={{ animationDelay: '180ms' }}>
            <CorrelationSection />
          </section>

          <section className="animate-fade-slide-up" style={{ animationDelay: '240ms' }}>
            <RegionalAnalysisSection />
          </section>
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
