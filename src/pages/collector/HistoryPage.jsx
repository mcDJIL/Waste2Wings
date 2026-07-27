import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import CollectorSidebar from '../../sections/collector/dashboard/CollectorSidebar'
import CollectorTopBar from '../../sections/collector/dashboard/CollectorTopBar'
import CollectorFooter from '../../sections/collector/dashboard/CollectorFooter'
import HistoriHeader from '../../sections/collector/histori/HistoriHeader'
import HistoriFilters from '../../sections/collector/histori/HistoriFilters'
import HistoriTable from '../../sections/collector/histori/HistoriTable'

const PER_PAGE = 10

export default function CollectorHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [dateRange, setDateRange] = useState('7')
  const [activeStatus, setActiveStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [historyData, setHistoryData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState(null)
  const [showDetailModal, setShowDetailModal] = useState(false)

  useEffect(() => {
    console.log('useEffect triggered')

    const fetchHistory = async () => {
      try {
        console.log('Starting API call...')
        setIsLoading(true)
        const endpoint = '/collectors/me/history'
        const params = {
          ...(activeStatus && { status: activeStatus }),
          ...(search && { q: search }),
        }
        console.log('Calling endpoint:', endpoint, 'with params:', params)

        const response = await api.get(endpoint, { params })
        console.log('Raw response:', response)
        console.log('response.data:', response.data)

        const data = response.data?.data || response.data
        console.log('Extracted data:', data)

        setHistoryData(data)
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const submissions = (historyData?.submissions || []).map(sub => ({
    idTransaksi: sub.id,
    tanggal: new Date(sub.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' }),
    waktu: new Date(sub.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    namaPenyetor: sub.community?.name || 'Unknown',
    volume: sub.cleanLiter || sub.actualLiter || sub.estimatedLiter || 0,
    status: sub.status,
  }))

  const filtered = useMemo(() => {
    return submissions.filter(t => {
      const q = search.toLowerCase()
      const matchSearch = !q ||
        t.idTransaksi.toLowerCase().includes(q) ||
        t.namaPenyetor.toLowerCase().includes(q)
      const matchStatus = !activeStatus || t.status === activeStatus
      return matchSearch && matchStatus
    })
  }, [submissions, search, activeStatus])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const pageRows = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  const handleSearchChange = (val) => {
    setSearch(val)
    setCurrentPage(1)
  }

  const handleStatusChange = (val) => {
    setActiveStatus(val)
    setCurrentPage(1)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewDetail = (row) => {
    const fullSubmission = historyData?.submissions?.find(s => s.id === row.idTransaksi)
    setSelectedSubmission({ ...row, ...fullSubmission })
    setShowDetailModal(true)
  }

  const handleExportPDF = () => {
    const element = document.querySelector('table')
    if (!element) {
      alert('Tidak ada data untuk diekspor')
      return
    }

    const printWindow = window.open('', '', 'width=900,height=600')
    const printContent = `
      <html>
        <head>
          <title>Histori Setoran</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #004536; color: white; font-weight: bold; }
            tr:nth-child(even) { background-color: #f5f5f5; }
            .summary { margin-top: 20px; padding: 10px; background-color: #f0f0f0; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Laporan Histori Setoran Minyak Jelantah</h1>
          <div class="summary">
            <p><strong>Total Liter Bersih:</strong> ${historyData?.summary?.totalCleanLiter || 0} L</p>
            <p><strong>Total Transaksi:</strong> ${historyData?.summary?.totalTransactions || 0}</p>
            <p><strong>Total Pendapatan:</strong> Rp ${(historyData?.summary?.totalRevenueFromHen || 0).toLocaleString('id-ID')}</p>
          </div>
          ${element.outerHTML}
          <p style="margin-top: 20px; font-size: 12px;">Dicetak pada: ${new Date().toLocaleString('id-ID')}</p>
        </body>
      </html>
    `
    printWindow.document.write(printContent)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <CollectorSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-[279px] min-w-0">
        <CollectorTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 flex flex-col gap-6 p-6 sm:p-8 lg:p-[26px_48px_48px]">
          <HistoriHeader summary={historyData?.summary} isLoading={isLoading} onExport={handleExportPDF} />
          <HistoriFilters
            search={search}
            onSearchChange={handleSearchChange}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            activeStatus={activeStatus}
            onStatusChange={handleStatusChange}
          />
          <HistoriTable
            rows={pageRows}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filtered.length}
            perPage={PER_PAGE}
            onPageChange={handlePageChange}
            onView={handleViewDetail}
          />
        </main>

        <CollectorFooter />
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-[#BEC9C3]/20">
              <h2 className="text-[#004536] font-bold text-lg">Detail Setoran</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-[#6F7975] hover:text-[#004536] text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <p className="text-[#6F7975] text-xs font-bold uppercase">ID Transaksi</p>
                <p className="text-[#004536] font-semibold">{selectedSubmission.idTransaksi}</p>
              </div>

              <div>
                <p className="text-[#6F7975] text-xs font-bold uppercase">Nama Komunitas</p>
                <p className="text-[#004536] font-semibold">{selectedSubmission.namaPenyetor}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[#6F7975] text-xs font-bold uppercase">Tanggal</p>
                  <p className="text-[#004536] font-semibold text-sm">{selectedSubmission.tanggal}</p>
                </div>
                <div>
                  <p className="text-[#6F7975] text-xs font-bold uppercase">Waktu</p>
                  <p className="text-[#004536] font-semibold text-sm">{selectedSubmission.waktu}</p>
                </div>
              </div>

              <div>
                <p className="text-[#6F7975] text-xs font-bold uppercase">Volume</p>
                <p className="text-[#004536] font-semibold">{selectedSubmission.volume} L</p>
              </div>

              <div>
                <p className="text-[#6F7975] text-xs font-bold uppercase">Status</p>
                <div className="mt-1">
                  {selectedSubmission.status === 'SUBMITTED' && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFDF93]/20 text-[#7A5F00]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4E3807]" />
                      Menunggu
                    </span>
                  )}
                  {selectedSubmission.status === 'ACCEPTED_BY_COLLECTOR' && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-[#FFDF93]/20 text-[#7A5F00]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#4E3807]" />
                      Validasi
                    </span>
                  )}
                  {selectedSubmission.status === 'VERIFIED' && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-[#81F9C1]/20 text-[#006C49]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006C49]" />
                      Terverifikasi
                    </span>
                  )}
                  {selectedSubmission.status === 'IN_BATCH' && (
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-[#D5E3FF]/20 text-[#1D4ED8]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1D4ED8]" />
                      Dalam Batch
                    </span>
                  )}
                </div>
              </div>

              {selectedSubmission.collectorNote && (
                <div>
                  <p className="text-[#6F7975] text-xs font-bold uppercase">Catatan</p>
                  <p className="text-[#3F4945] text-sm">{selectedSubmission.collectorNote}</p>
                </div>
              )}
            </div>

            <div className="border-t border-[#BEC9C3]/20 px-6 py-4 flex gap-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-[#BEC9C3]/30 text-[#004536] font-semibold hover:bg-[#F0F3FF] transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
