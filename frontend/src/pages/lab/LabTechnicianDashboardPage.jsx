import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { useLogout } from '../../hooks/useLogout'
import LabInputModal from '../../components/modals/LabInputModal'
import QRCodeModal from '../../components/modals/QRCodeModal'

export default function LabTechnicianDashboardPage() {
  const { user } = useAuth()
  const handleLogout = useLogout()

  const [batches, setBatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBatchId, setSelectedBatchId] = useState(null)
  const [isInputModalOpen, setIsInputModalOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [selectedQrCode, setSelectedQrCode] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchBatches()
  }, [])

  const fetchBatches = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/batches')
      const data = res.data?.batches || res.data || []
      setBatches(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to fetch batches:', err)
      setBatches([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenInputModal = (batchId) => {
    setSelectedBatchId(batchId)
    setIsInputModalOpen(true)
  }

  const handleOpenQrModal = (batchCode) => {
    setSelectedQrCode(batchCode)
    setQrModalOpen(true)
  }

  const filteredBatches = useMemo(() => {
    return batches.filter((b) => {
      const matchSearch =
        search === '' ||
        b.batchCode?.toLowerCase().includes(search.toLowerCase()) ||
        b.collectorProfile?.companyName?.toLowerCase().includes(search.toLowerCase())
      return matchSearch
    })
  }, [batches, search])

  const pendingTestCount = batches.filter((b) => !b.labResult).length
  const completedTestCount = batches.filter((b) => !!b.labResult).length

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#1E293B] flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="bg-[#051C37] text-white border-b border-white/10 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/favicon.ico" alt="Logo" className="w-8 h-8 rounded-full" />
            <div>
              <span className="text-[#81F9C1] font-extrabold text-base leading-none block">Waste2Wings</span>
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider block">LABORATORY TECHNICIAN PORTAL</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#81F9C1] animate-pulse" />
              <span>{user?.name || 'Petugas Lab'}</span>
              <span className="text-white/40">|</span>
              <span className="text-[#81F9C1] font-bold">LAB_TECHNICIAN</span>
            </div>

            <button
              onClick={handleLogout}
              className="px-3.5 py-1.5 rounded-xl bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-colors text-xs font-bold flex items-center gap-1.5 border border-red-500/30"
            >
              <span>🚪</span>
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 flex flex-col gap-8">
        {/* Banner Segregasi Peran */}
        <section className="bg-gradient-to-r from-[#004B3C] to-[#051C37] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-fade-slide-up">
          <div className="z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#81F9C1]/20 text-[#81F9C1] text-xs font-extrabold mb-3 border border-[#81F9C1]/30">
              🔒 Segregasi Peran & Separation of Duties
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Portal Uji Mutu Laboratorium Refinery
            </h1>
            <p className="text-xs sm:text-sm text-white/80 mt-2 leading-relaxed">
              Anda bertugas melakukan pengujian mutu minyak jelantah (Kadar Air, FFA, Kotoran & Grade). Pengujian Anda akan dicatat ke dalam audit trail dan selanjutnya diverifikasi oleh Stakeholder.
            </p>
          </div>
        </section>

        {/* KPI Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-slide-up" style={{ animationDelay: '60ms' }}>
          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold">
              ⏳
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Menunggu Pengujian</p>
              <p className="text-2xl font-extrabold text-[#1E293B]">{pendingTestCount} Batch</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold">
              ✅
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Selesai Diuji Lab</p>
              <p className="text-2xl font-extrabold text-[#1E293B]">{completedTestCount} Batch</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold">
              📦
            </div>
            <div>
              <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Total Batch Pengepul</p>
              <p className="text-2xl font-extrabold text-[#1E293B]">{batches.length} Batch</p>
            </div>
          </div>
        </section>

        {/* Batch List Table */}
        <section className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-fade-slide-up" style={{ animationDelay: '120ms' }}>
          <div className="p-6 border-b border-[#F1F5F9] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#004B3C]">Daftar Batch Siap Diuji Lab</h2>
              <p className="text-xs text-[#64748B]">Klik "Simpan Data Uji" pada batch yang hendak diuji kadar mutunya.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Cari ID batch atau pengepul..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm outline-none focus:border-[#004B3C] transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">KODE BATCH</th>
                  <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">PENGEPUL</th>
                  <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">VOLUME</th>
                  <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">STATUS UJI</th>
                  <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">HASIL LAB</th>
                  <th className="px-6 py-4 text-right text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">AKSI</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-t border-[#F1F5F9] animate-pulse">
                      <td colSpan={6} className="px-6 py-5">
                        <div className="h-5 bg-[#F1F5F9] rounded" />
                      </td>
                    </tr>
                  ))
                ) : filteredBatches.length > 0 ? (
                  filteredBatches.map((batch) => (
                    <tr
                      key={batch.id}
                      onClick={() => handleOpenInputModal(batch.id)}
                      className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-extrabold text-[#004B3C] block">{batch.batchCode}</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(batch.createdAt).toLocaleDateString('id-ID')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#1E293B]">
                        {batch.collectorProfile?.companyName || 'Pengepul'}
                      </td>
                      <td className="px-6 py-4 text-sm font-extrabold text-[#004B3C]">
                        {batch.totalCleanLiter} L
                      </td>
                      <td className="px-6 py-4">
                        {batch.labResult ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap inline-flex items-center gap-1">
                            ✅ Selesai Diuji
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap inline-flex items-center gap-1">
                            ⏳ Menunggu Uji
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {batch.labResult ? (
                          <div className="text-xs space-y-0.5">
                            <p className="font-extrabold text-[#004B3C]">GRADE {batch.labResult.grade}</p>
                            <p className="text-gray-500">
                              Air: {Number(batch.labResult.waterContentPercent).toFixed(1)}% | FFA: {Number(batch.labResult.ffaPercent).toFixed(1)}%
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">Belum diinput</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenQrModal(batch.batchCode)
                            }}
                            className="px-3 py-1.5 rounded-xl border border-[#E2E8F0] text-xs font-bold hover:bg-[#F1F5F9] transition-colors"
                            title="QR Code Tag"
                          >
                            📱 QR
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleOpenInputModal(batch.id)
                            }}
                            className="px-4 py-2 rounded-xl bg-[#004B3C] text-white text-xs font-bold hover:bg-[#00382D] transition-colors shadow-sm whitespace-nowrap"
                          >
                            {batch.labResult ? '👁️ Detail' : '🧪 Input Data Lab'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-[#94A3B8] text-sm">
                      Tidak ada batch yang sesuai.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 px-6 text-center text-xs text-gray-400 mt-auto">
        Waste2Wings Platform • Segregated Laboratory Technician Module
      </footer>

      {/* Modals */}
      <LabInputModal
        isOpen={isInputModalOpen}
        batchId={selectedBatchId}
        onClose={() => {
          setIsInputModalOpen(false)
          setSelectedBatchId(null)
        }}
        onSuccess={fetchBatches}
      />

      <QRCodeModal
        isOpen={qrModalOpen}
        code={selectedQrCode}
        title="Batch Traceability Tag"
        subtitle={`Standardized QR for Batch ${selectedQrCode}`}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  )
}
