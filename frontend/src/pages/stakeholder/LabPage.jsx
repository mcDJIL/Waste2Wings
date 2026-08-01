import { useState, useEffect } from 'react'
import api from '../../services/api'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'
import LabHeader from '../../components/stakeholder/lab/LabHeader'
import LabKpiCards from '../../components/stakeholder/lab/LabKpiCards'
import BatchTableSection from '../../sections/stakeholder/lab/BatchTableSection'
import BatchDetailSection from '../../sections/stakeholder/lab/BatchDetailSection'
import { exportLabReportToPDF } from '../../utils/labPdfExport'

export default function LabPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [batches, setBatches] = useState([])
  const [selectedBatchId, setSelectedBatchId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const handleExportReport = () => {
    exportLabReportToPDF(batches)
  }

  const handleRefreshBatches = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/batches')
      const data = response.data?.batches || response.data
      if (Array.isArray(data) && data.length > 0) {
        setBatches(data)
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/batches')
        const data = response.data?.batches || response.data
        if (Array.isArray(data) && data.length > 0) {
          setBatches(data)
          setSelectedBatchId(data[0].id)
        }
      } catch (error) {
        console.error('Failed to fetch batches:', error)
        setBatches([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchBatches()
  }, [])

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
            <LabHeader onExport={handleExportReport} />
          </section>

          {/* KPI cards */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '60ms' }}>
            <LabKpiCards batches={batches} />
          </section>

          {/* Batch analysis table */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '120ms' }}>
            <BatchTableSection
              batches={batches}
              selectedBatchId={selectedBatchId}
              onSelectBatch={setSelectedBatchId}
              isLoading={isLoading}
              onRefresh={handleRefreshBatches}
            />
          </section>

          {/* Batch detail + spectrometry */}
          {selectedBatchId && (
            <section className="animate-fade-slide-up" style={{ animationDelay: '180ms' }}>
              <BatchDetailSection selectedBatchId={selectedBatchId} batches={batches} />
            </section>
          )}
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
