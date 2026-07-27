import { useState, useEffect } from 'react'
import api from '../../services/api'
import { exportBatchesToPDF } from '../../utils/pdfExport'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import ApplicationMetricsSection from '../../sections/stakeholder/ApplicationMetricsSection'
import ApplicationTableSection from '../../sections/stakeholder/ApplicationTableSection'
import RightSidebarSection from '../../sections/stakeholder/RightSidebarSection'

function PageHeader({ batches = [], isExporting = false, onExportPDF }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      {/* Breadcrumb + title */}
      <div className="flex flex-col gap-2">
        <nav className="flex items-center gap-2 text-sm">
          <span className="text-[#3F4945]">Beranda</span>
          <span className="text-[#3F4945]">/</span>
          <span className="text-[#004536] font-bold">Pengajuan</span>
        </nav>
        <p className="text-[#004536] text-sm">Pengajuan Kemitraan Pengepul</p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        <button
          onClick={onExportPDF}
          disabled={isExporting || batches.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#BEC9C3] bg-[#F9F9FF] text-[#051C37] text-sm font-bold transition-all duration-200 hover:border-[#004536] hover:bg-[rgba(0,69,54,0.04)] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 9L2.25 5.25L3.3 4.1625L5.25 6.1125V0H6.75V6.1125L8.7 4.1625L9.75 5.25L6 9ZM1.5 12C1.0875 12 0.734375 11.8531 0.440625 11.5594C0.146875 11.2656 0 10.9125 0 10.5V8.25H1.5V10.5H10.5V8.25H12V10.5C12 10.9125 11.8531 11.2656 11.5594 11.5594C11.2656 11.8531 10.9125 12 10.5 12H1.5Z" fill="currentColor" />
          </svg>
          {isExporting ? 'Memproses...' : 'Export PDF'}
        </button>
      </div>
    </div>
  )
}

function PageFooter() {
  return (
    <footer className="border-t border-[rgba(190,201,195,0.30)] bg-white px-6 sm:px-12 py-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#004536] text-sm font-bold">HEN Platform</span>
          <span className="text-[#6F7975] text-sm">|</span>
          <span className="text-[#3F4945] text-xs font-medium">
            © 2026 Veridian Energy. Sustainable Luxury in Waste Management.
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          {['Privacy Policy', 'Terms of Service', 'ESG Report'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#3F4945] text-xs font-medium transition-colors duration-150 hover:text-[#004536]"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}

function RightSidebarDrawer({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 xl:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={[
          'fixed top-0 right-0 h-full w-[280px] bg-white border-l border-[rgba(190,201,195,0.30)] z-40',
          'overflow-y-auto transition-transform duration-300 ease-in-out',
          'xl:hidden',
          open ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[rgba(190,201,195,0.20)]">
          <span className="text-[#004536] text-sm font-bold">Panel Info</span>
          <button onClick={onClose} className="p-1 rounded-lg text-[#3F4945] hover:bg-[rgba(0,69,54,0.06)] transition-colors duration-150">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <RightSidebarSection />
      </aside>
    </>
  )
}

export default function CollectorApplicationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(false)
  const [batches, setBatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/batches')
        const data = response.data?.batches || response.data
        setBatches(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch batches:', error)
        setBatches([])
      } finally {
        setIsLoading(false)
      }
    }
    fetchBatches()
  }, [])

  const handleExportPDF = async () => {
    try {
      setIsExporting(true)
      await exportBatchesToPDF(batches, 'Pengajuan-Kemitraan-Pengepul.pdf')
    } catch (error) {
      console.error('Export failed:', error)
      alert('Gagal mengekspor PDF')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9FF] flex">
      {/* Left sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col lg:ml-[280px] min-w-0">
        {/* Top nav */}
        <TopNav onMenuToggle={() => setSidebarOpen((o) => !o)} />

        {/* Content row */}
        <div className="flex flex-1 min-h-0">
          {/* Main content */}
          <main className="flex-1 overflow-y-auto min-w-0">
            <div className="p-4 sm:p-8 lg:p-10 xl:p-12 flex flex-col gap-5 sm:gap-6">
              {/* Mobile: right panel toggle */}
              <div className="flex justify-end xl:hidden">
                <button
                  onClick={() => setRightPanelOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#004536] text-xs font-bold transition-all duration-200 hover:shadow-sm"
                >
                  <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
                    <path d="M5.83333 9.16667H7.5V5H5.83333V9.16667ZM6.66667 11.6667C6.90278 11.6667 7.10069 11.5868 7.26042 11.4271C7.42014 11.2674 7.5 11.0694 7.5 10.8333C7.5 10.5972 7.42014 10.3993 7.26042 10.2396C7.10069 10.0799 6.90278 10 6.66667 10C6.43056 10 6.23264 10.0799 6.07292 10.2396C5.91319 10.3993 5.83333 10.5972 5.83333 10.8333C5.83333 11.0694 5.91319 11.2674 6.07292 11.4271C6.23264 11.5868 6.43056 11.6667 6.66667 11.6667ZM0 14.1667V12.5H1.66667V6.66667C1.66667 5.51389 2.01389 4.48958 2.70833 3.59375C3.40278 2.69792 4.30556 2.11111 5.41667 1.83333V1.25C5.41667 0.902778 5.53819 0.607639 5.78125 0.364583C6.02431 0.121528 6.31944 0 6.66667 0C7.01389 0 7.30903 0.121528 7.55208 0.364583C7.79514 0.607639 7.91667 0.902778 7.91667 1.25V1.83333C9.02778 2.11111 9.93056 2.69792 10.625 3.59375C11.3194 4.48958 11.6667 5.51389 11.6667 6.66667V12.5H13.3333V14.1667H0ZM6.66667 16.6667C6.20833 16.6667 5.81597 16.5035 5.48958 16.1771C5.16319 15.8507 5 15.4583 5 15H8.33333C8.33333 15.4583 8.17014 15.8507 7.84375 16.1771C7.51736 16.5035 7.125 16.6667 6.66667 16.6667ZM3.33333 12.5H10V6.66667C10 5.75 9.67361 4.96528 9.02083 4.3125C8.36806 3.65972 7.58333 3.33333 6.66667 3.33333C5.75 3.33333 4.96528 3.65972 4.3125 4.3125C3.65972 4.96528 3.33333 5.75 3.33333 6.66667V12.5Z" fill="currentColor" />
                  </svg>
                  Panel Info
                </button>
              </div>

              <PageHeader batches={batches} isExporting={isExporting} onExportPDF={handleExportPDF} />
              <ApplicationMetricsSection batches={batches} isLoading={isLoading} />
              <ApplicationTableSection batches={batches} isLoading={isLoading} />
            </div>
          </main>

          {/* Right sidebar — desktop only */}
          <aside className="hidden xl:flex w-[250px] shrink-0 flex-col border-l border-[rgba(190,201,195,0.30)] bg-white overflow-y-auto">
            <RightSidebarSection />
          </aside>
        </div>

        <PageFooter />
      </div>

      {/* Right sidebar drawer — mobile/tablet */}
      <RightSidebarDrawer open={rightPanelOpen} onClose={() => setRightPanelOpen(false)} />
    </div>
  )
}
