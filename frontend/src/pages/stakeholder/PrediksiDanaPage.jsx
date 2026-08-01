import { useState, useEffect } from 'react'
import api from '../../services/api'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'
import PrediksiHeader from '../../sections/stakeholder/prediksi/PrediksiHeader'
import PrediksiKpiCards from '../../sections/stakeholder/prediksi/PrediksiKpiCards'
import ForecastChartSection from '../../sections/stakeholder/prediksi/ForecastChartSection'
import BudgetScenarioSection from '../../sections/stakeholder/prediksi/BudgetScenarioSection'

export default function PrediksiDanaPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [predictionData, setPredictionData] = useState(null)
  const [trends, setTrends] = useState([])
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        setIsLoading(true)
        const [trendsRes, settingsRes] = await Promise.all([
          api.get('/dashboard/trends'),
          api.get('/stakeholder/settings'),
        ])
        setTrends(trendsRes.data?.trends || [])
        setSettings(settingsRes.data?.setting)
      } catch (error) {
        console.error('Failed to fetch prediction data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPredictionData()
  }, [])

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
            <PrediksiKpiCards trends={trends} settings={settings} isLoading={isLoading} />
          </section>

          <section className="animate-fade-slide-up" style={{ animationDelay: '180ms' }}>
            <BudgetScenarioSection trends={trends} settings={settings} isLoading={isLoading} />
          </section>
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
