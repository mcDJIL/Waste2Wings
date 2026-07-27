import { useState, useEffect } from 'react'
import ValidationSidebar from '../../sections/collector/dashboard/CollectorSidebar'
import ValidationQueue from '../../sections/collector/validation/ValidationQueue'
import ValidationDetail from '../../sections/collector/validation/ValidationDetail'
import CollectorTopBar from '../../sections/collector/dashboard/CollectorTopBar'
import CollectorFooter from '../../sections/collector/dashboard/CollectorFooter'
import api from '../../services/api'

const BackArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 18L2 10L10 2L11.425 3.4L5.825 9H18V11H5.825L11.425 16.6L10 18Z" fill="#004536" />
  </svg>
)

export default function ValidationPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [toasts, setToasts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('SUBMITTED')

  useEffect(() => {
    loadSubmissions()
  }, [statusFilter])

  const loadSubmissions = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/submissions', {
        params: statusFilter ? { status: statusFilter } : {},
      })
      const data = Array.isArray(response.data) 
        ? response.data 
        : response.data?.submissions || []
      
      setSubmissions(data)
      if (data.length > 0 && !selectedSubmission) {
        setSelectedSubmission(data[0])
      }
    } catch (error) {
      console.error('Failed to load submissions:', error)
      addToast('Gagal memuat data validasi', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const addToast = (msg, type = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, type }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000)
  }

  const handleSelect = (item) => {
    setSelectedSubmission(item)
    setShowDetail(true)
  }

  const handleVerify = async (data) => {
    try {
      const actualLiter = parseFloat(data.actualLiter || 0)
      const sedimentLiter = parseFloat(data.sedimentLiter || 0)

      // Try minimal payload first - without cleanLiter calculation
      const payload = {
        status: 'ACCEPTED_BY_COLLECTOR',
        actualLiter: actualLiter,
        sedimentLiter: sedimentLiter,
        collectorNote: (data.collectorNote || '').trim(),
      }

      console.log('=== VERIFY PAYLOAD ===')
      console.log('Submission ID:', selectedSubmission.id)
      console.log('Payload:', JSON.stringify(payload))

      const response = await api.patch(`/submissions/${selectedSubmission.id}/collector-validation`, payload)
      console.log('Verify response:', response.data)

      addToast(`Setoran berhasil diverifikasi!`, 'success')
      setShowDetail(false)
      loadSubmissions()

      // Auto-refresh after 2 seconds
      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      console.error('Failed to verify submission:', error)
      console.error('Error details:', error?.response?.data)
      addToast(error?.response?.data?.error?.message || error?.response?.data?.message || 'Gagal memverifikasi setoran', 'error')
    }
  }

  const handleReject = async (data) => {
    try {
      const payload = {
        status: 'REJECTED_BY_COLLECTOR',
        collectorNote: data.collectorNote || '',
      }

      console.log('Reject payload:', payload)
      const response = await api.patch(`/submissions/${selectedSubmission.id}/collector-validation`, payload)
      console.log('Reject response:', response.data)

      addToast(`Setoran ditolak.`, 'error')
      setShowDetail(false)
      loadSubmissions()

      // Auto-refresh after 2 seconds
      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      console.error('Failed to reject submission:', error)
      console.error('Error details:', error?.response?.data)
      addToast(error?.response?.data?.error?.message || error?.response?.data?.message || 'Gagal menolak setoran', 'error')
    }
  }

  const pendingCount = submissions.length

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <ValidationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — offset by sidebar width on large screens */}
      <div className="flex-1 flex flex-col lg:ml-[280px] min-w-0">
        <CollectorTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Two-panel content area */}
        <main className="flex-1 flex overflow-hidden" style={{ minHeight: 0 }}>

          {/* ── Left panel: Queue ── */}
          <section
            className={`
              flex flex-col shrink-0 overflow-hidden
              transition-all duration-300 ease-in-out
              ${showDetail
                ? 'w-0 opacity-0 pointer-events-none lg:w-[44%] lg:opacity-100 lg:pointer-events-auto'
                : 'w-full opacity-100 lg:w-[44%]'
              }
            `}
            style={{ minHeight: 0 }}
          >
            <div className="h-full overflow-hidden flex flex-col">
              <ValidationQueue
                submissions={submissions}
                selectedId={selectedSubmission?.id}
                onSelect={handleSelect}
                isLoading={isLoading}
                pendingCount={pendingCount}
              />
            </div>
          </section>

          {/* ── Right panel: Detail ── */}
          <section
            className={`
              flex flex-col flex-1 overflow-hidden bg-white
              transition-all duration-300 ease-in-out
              ${showDetail
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 lg:opacity-100 pointer-events-none lg:pointer-events-auto'
              }
              ${!showDetail && !selectedSubmission ? 'hidden lg:flex' : 'flex'}
            `}
            style={{ minHeight: 0 }}
          >
            {/* Mobile back button */}
            <div className="lg:hidden flex items-center gap-2 px-4 pt-4 pb-1 shrink-0">
              <button
                onClick={() => setShowDetail(false)}
                className="flex items-center gap-2 text-[#004536] text-sm font-semibold
                  hover:opacity-70 active:scale-95 transition-all duration-150"
              >
                <BackArrowIcon />
                Kembali ke Antrean
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" style={{ minHeight: 0 }}>
              {selectedSubmission ? (
                <ValidationDetail
                  key={selectedSubmission.id}
                  submission={selectedSubmission}
                  onVerify={handleVerify}
                  onReject={handleReject}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6 py-20">
                  <div className="w-16 h-16 rounded-2xl bg-[#F0F3FF] flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 20 18" fill="none">
                      <path d="M2 18C1.45 18 0.979 17.804 0.588 17.413C0.196 17.021 0 16.55 0 16V2C0 1.45 0.196 0.979 0.588 0.588C0.979 0.196 1.45 0 2 0H18C18.55 0 19.021 0.196 19.413 0.588C19.804 0.979 20 1.45 20 2V16C20 16.55 19.804 17.021 19.413 17.413C19.021 17.804 18.55 18 18 18H2ZM3 14H8V12H3V14ZM12.55 12L17.5 7.05L16.075 5.625L12.55 9.175L11.125 7.75L9.725 9.175L12.55 12ZM3 10H8V8H3V10ZM3 6H8V4H3V6Z" fill="#BEC9C3"/>
                    </svg>
                  </div>
                  <p className="text-[#3F4945] text-base font-medium">
                    Pilih item antrean untuk melihat detail verifikasi
                  </p>
                </div>
              )}
            </div>
          </section>
        </main>

        <CollectorFooter />
      </div>

      {/* Toast notifications */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`
              flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl text-white text-sm font-semibold
              animate-fade-slide-up pointer-events-auto max-w-[90vw] sm:max-w-sm
              ${t.type === 'success' ? 'bg-[#004536]' : 'bg-[#BA1A1A]'}
            `}
          >
            <span className="shrink-0">
              {t.type === 'success' ? '✓' : '✕'}
            </span>
            {t.msg}
          </div>
        ))}
      </div>
    </div>
  )
}
