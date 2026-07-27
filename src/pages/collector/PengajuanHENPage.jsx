import { useState, useEffect } from 'react'
import CollectorSidebar from '../../sections/collector/dashboard/CollectorSidebar'
import CollectorTopBar from '../../sections/collector/dashboard/CollectorTopBar'
import DashboardFooter from '../../sections/collector/dashboard/CollectorFooter'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'

const CheckboxIcon = ({ checked }) => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect x="1" y="1" width="18" height="18" rx="4" 
      fill={checked ? '#004536' : 'white'} 
      stroke={checked ? '#004536' : '#BEC9C3'} 
      strokeWidth="2" />
    {checked && (
      <path d="M6 10L9 13L14 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
)

const LightbulbIcon = () => (
  <svg width="15" height="20" viewBox="0 0 15 20" fill="none">
    <path d="M7.5 20C6.95 20 6.47917 19.8042 6.0875 19.4125C5.69583 19.0208 5.5 18.55 5.5 18H9.5C9.5 18.55 9.30417 19.0208 8.9125 19.4125C8.52083 19.8042 8.05 20 7.5 20ZM3.5 17V15H11.5V17H3.5ZM3.75 14C2.6 13.3167 1.6875 12.4 1.0125 11.25C0.3375 10.1 0 8.85 0 7.5C0 5.41667 0.729167 3.64583 2.1875 2.1875C3.64583 0.729167 5.41667 0 7.5 0C9.58333 0 11.3542 0.729167 12.8125 2.1875C14.2708 3.64583 15 5.41667 15 7.5C15 8.85 14.6625 10.1 13.9875 11.25C13.3125 12.4 12.4 13.3167 11.25 14H3.75Z" fill="#4E3807" />
  </svg>
)

const ShippingTipsCard = () => (
  <div className="flex flex-col gap-2 p-5 rounded-xl bg-white/70 backdrop-blur-[10px]
    border-t border-r border-b border-[#FFDEA4] border-l-4 border-l-[#FFDEA4]">
    <div className="flex items-center gap-3">
      <LightbulbIcon />
      <span className="text-[#4E3807] text-base font-bold leading-6">Tips Pengiriman</span>
    </div>
    <p className="text-[#3F4945] text-[13px] leading-[19.5px]">
      Pastikan minyak tidak tercampur dengan air hujan. Pengiriman dengan kadar air &lt; 1%
      mendapatkan bonus premium sebesar 5% dari total nilai.
    </p>
  </div>
)

export default function PengajuanHENPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [selectedSubmissions, setSelectedSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/submissions', {
        params: { status: 'ACCEPTED_BY_COLLECTOR' },
      })
      const data = Array.isArray(response.data) 
        ? response.data 
        : response.data?.submissions || []
      
      setSubmissions(data)
      console.log('Accepted submissions loaded:', data)
    } catch (error) {
      console.error('Failed to load submissions:', error)
      showToast('Gagal memuat data setoran', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSubmission = (id) => {
    setSelectedSubmissions(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    )
  }

  const handleSubmit = async () => {
    if (selectedSubmissions.length === 0) {
      showToast('Pilih minimal 1 setoran', 'error')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        submissionIds: selectedSubmissions,
      }

      console.log('Batch payload:', payload)
      const response = await api.post('/batches', payload)
      console.log('Batch response:', response.data)

      showToast('✓ Pengajuan batch berhasil dibuat!', 'success')
      setSelectedSubmissions([])
      
      // Reload submissions after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Failed to create batch:', error)
      const errorMsg = error?.response?.data?.error?.message || 
                      error?.response?.data?.message || 
                      'Gagal membuat pengajuan batch'
      showToast(errorMsg, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalVolume = selectedSubmissions.reduce((sum, id) => {
    const sub = submissions.find(s => s.id === id)
    return sum + (sub?.estimatedLiter || 0)
  }, 0)

  const estimatedReward = Math.round(totalVolume * 8500)

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <CollectorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-[279px] min-w-0">
        <CollectorTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-6 lg:p-12 flex flex-col gap-8">

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#004536] text-2xl font-bold leading-8">
                Pengajuan HEN
              </h1>
              <p className="text-[#3F4945] text-base leading-6 max-w-lg">
                Pilih setoran yang sudah diterima untuk dibuat batch pengajuan.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={selectedSubmissions.length === 0 || isSubmitting}
              className="px-8 py-3 rounded-xl
                bg-gradient-to-r from-[#0B5E4B] to-[#004536]
                text-white text-base font-bold leading-6
                shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]
                hover:shadow-[0_20px_30px_-6px_rgba(0,69,54,0.30)]
                hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200 whitespace-nowrap">
              {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
            </button>
          </div>

          {/* Content grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left: Submissions List */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="rounded-2xl border-t-2 border-r border-b border-l border-[#FFDEA4]
                bg-white/70 backdrop-blur-[10px]">

                <div className="px-6 py-5 border-b border-[#BEC9C3]/20">
                  <h2 className="text-[#004536] text-lg font-bold">
                    Daftar Setoran Diterima ({submissions.length})
                  </h2>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <p className="text-[#3F4945]">Tidak ada setoran yang sudah diterima</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#BEC9C3]/10">
                    {submissions.map((submission) => (
                      <button
                        key={submission.id}
                        onClick={() => toggleSubmission(submission.id)}
                        className="w-full px-6 py-4 text-left hover:bg-[#004536]/[0.02]
                          transition-colors duration-150 flex items-center gap-4">
                        
                        <CheckboxIcon checked={selectedSubmissions.includes(submission.id)} />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-[#051C37]">
                              {submission.community?.user?.name || 'Unknown'}
                            </h3>
                            <span className="text-xs bg-[#81F9C1]/20 text-[#006C49] px-2 py-1 rounded">
                              {submission.estimatedLiter} L
                            </span>
                          </div>
                          <p className="text-xs text-[#6B7280] truncate">
                            {submission.community?.address || 'Alamat tidak tersedia'}
                          </p>
                          <p className="text-xs text-[#3F4945] mt-1">
                            ID: {submission.id.substring(0, 12)}...
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-[#004536]">
                            Rp {(submission.estimatedLiter * 8500).toLocaleString('id-ID')}
                          </p>
                          <p className="text-xs text-[#6B7280]">
                            {new Date(submission.createdAt).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Summary */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Summary Card */}
              <div className="rounded-2xl border-t-2 border-r border-b border-l border-[#FFDEA4]
                bg-gradient-to-br from-[#004536] to-[#0B5E4B]
                p-6 text-white">
                
                <h3 className="text-[#81F9C1] text-base font-bold mb-4">Ringkasan Pengajuan</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Jumlah Setoran</span>
                    <span className="font-bold text-lg">{selectedSubmissions.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Total Volume</span>
                    <span className="font-bold text-lg">{totalVolume} L</span>
                  </div>
                  <div className="h-px bg-white/20"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#81F9C1] font-bold">Estimasi Pendapatan</span>
                    <span className="font-bold text-xl">
                      Rp {estimatedReward.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={selectedSubmissions.length === 0 || isSubmitting}
                  className="w-full mt-4 py-3 rounded-lg bg-[#81F9C1] text-[#004536]
                    font-bold text-sm hover:bg-white
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-all duration-200">
                  {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
                </button>
              </div>

              <ShippingTipsCard />
            </div>

          </div>
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
