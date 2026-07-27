import { useState } from 'react'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'
import PrediksiHeader from '../../sections/stakeholder/prediksi/PrediksiHeader'
import PrediksiKpiCards from '../../sections/stakeholder/prediksi/PrediksiKpiCards'
import ForecastChartSection from '../../sections/stakeholder/prediksi/ForecastChartSection'
import BudgetScenarioSection from '../../sections/stakeholder/prediksi/BudgetScenarioSection'

export default function PrediksiDanaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F5F7F6]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px] transition-all duration-300">
        <TopNav onMenuToggle={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-8 gap-8 overflow-y-auto">
          <section className="animate-fade-slide-up" style={{ animationDelay: '0ms' }}>
            <PrediksiHeader />
          </section>

          <section className="animate-fade-slide-up" style={{ animationDelay: '60ms' }}>
            <PrediksiKpiCards />
          </section>

          <section className="animate-fade-slide-up" style={{ animationDelay: '120ms' }}>
            <ForecastChartSection />
          </section>

          <section className="animate-fade-slide-up" style={{ animationDelay: '180ms' }}>
            <BudgetScenarioSection />
          </section>
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
