import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import QRCodeModal from '../../components/modals/QRCodeModal'

export default function TraceabilityPage() {
  const { code: paramCode } = useParams()
  const navigate = useNavigate()

  const [inputCode, setInputCode] = useState(paramCode || 'W2W-BATCH-202608-6')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [qrModalOpen, setQrModalOpen] = useState(false)

  useEffect(() => {
    if (paramCode) {
      fetchTraceability(paramCode)
    } else {
      fetchTraceability('W2W-BATCH-202608-6')
    }
  }, [paramCode])

  const fetchTraceability = async (searchCode) => {
    if (!searchCode) return
    try {
      setIsLoading(true)
      setError('')
      const response = await api.get(`/traceability/${encodeURIComponent(searchCode)}`)
      setData(response.data)
    } catch (err) {
      console.error('Traceability fetch error:', err)
      setError(err.response?.data?.error || `Data traceability tidak ditemukan untuk kode "${searchCode}"`)
      setData(null)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (inputCode.trim()) {
      navigate(`/trace/${encodeURIComponent(inputCode.trim())}`)
      fetchTraceability(inputCode.trim())
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F7F6] text-[#1E293B] font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="bg-[#051C37] text-white border-b border-white/10 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/favicon.ico" alt="Logo" className="w-8 h-8 rounded-full" />
            <div>
              <span className="text-[#81F9C1] font-extrabold text-base leading-none block">Waste2Wings</span>
              <span className="text-white/60 text-[10px] font-bold uppercase tracking-wider block">PUBLIC TRACEABILITY PASSPORT</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl bg-[#004B3C] text-white text-xs font-bold hover:bg-[#00382D] transition-all shadow-sm"
            >
              Masuk Dashboard →
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
        {/* Search & Camera Banner */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm flex flex-col gap-6 animate-fade-slide-up">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004B3C]/10 text-[#004B3C] text-xs font-extrabold mb-3">
              ✈️ Transparency & SAF Compliance System
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#004B3C]">
              Lacak Silsilah Pasokan Minyak Jelantah
            </h1>
            <p className="text-sm text-[#64748B] mt-2">
              Masukkan Kode Batch atau Kode Setoran TRX untuk melacak perjalanan dari dapur masyarakat hingga diolah menjadi Avtur Ramah Lingkungan (SAF).
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto w-full">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder="Contoh: W2W-BATCH-202608-6"
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1E293B] font-semibold outline-none focus:border-[#004B3C] focus:bg-white transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3.5 rounded-2xl bg-[#004B3C] text-white font-bold text-sm hover:bg-[#00382D] transition-colors shadow-md disabled:opacity-50 whitespace-nowrap"
            >
              {isLoading ? 'Mencari...' : 'Lacak Sekarang'}
            </button>
          </form>
        </section>

        {/* Loading / Error States */}
        {isLoading && (
          <div className="p-12 text-center bg-white rounded-3xl border border-[#E2E8F0] shadow-sm animate-pulse">
            <div className="w-12 h-12 border-4 border-[#004B3C] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm font-bold text-[#004B3C]">Memverifikasi Rantai Pasokan...</p>
          </div>
        )}

        {error && !isLoading && (
          <div className="p-8 text-center bg-red-50 rounded-3xl border border-red-200">
            <span className="text-4xl block mb-2">❌</span>
            <p className="text-base font-bold text-red-800">{error}</p>
            <p className="text-xs text-red-600 mt-1">Pastikan kode yang Anda ketik atau scan sudah sesuai.</p>
          </div>
        )}

        {/* Traceability Data Display */}
        {data && !isLoading && (
          <div className="flex flex-col gap-6 animate-fade-slide-up">
            {/* Passport Header Card */}
            <div className="bg-[#051C37] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div className="z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-0.5 rounded-full bg-[#81F9C1]/20 text-[#81F9C1] text-xs font-bold border border-[#81F9C1]/30">
                    VERIFIED PASSPORT
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-white/10 text-white/80 text-xs font-mono">
                    {data.traceabilityType}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">{data.code}</h2>
                <p className="text-xs text-white/70 mt-1">
                  Total Volume Terverifikasi: <strong className="text-white text-sm">{data.totalVolumeLiter} Liter</strong>
                </p>
              </div>

              {/* CO2 Impact Counter Badge */}
              <div className="z-10 flex flex-col items-start sm:items-end">
                <div className="px-4 py-3 rounded-2xl bg-[#004B3C] border border-[#81F9C1]/40 flex items-center gap-3 shadow-lg">
                  <span className="text-3xl">🌱</span>
                  <div>
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">Estimasi Pengurangan CO2</span>
                    <span className="text-xl font-extrabold text-[#81F9C1]">{data.co2SavedKg} kg CO₂e</span>
                  </div>
                </div>
                <button
                  onClick={() => setQrModalOpen(true)}
                  className="mt-3 text-xs font-bold text-[#81F9C1] hover:underline flex items-center gap-1"
                >
                  <span>📱 Tampilkan QR Code</span>
                </button>
              </div>
            </div>

            {/* 4-Step Interactive Timeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm flex flex-col gap-8">
              <div className="flex items-center justify-between border-b border-[#F1F5F9] pb-4">
                <h3 className="text-lg font-extrabold text-[#004B3C]">Timeline Rantai Pasokan (Supply Chain)</h3>
                <span className="text-xs font-bold text-[#64748B] bg-[#F8FAFC] px-3 py-1 rounded-full border border-[#E2E8F0]">
                  4 Tahap Sertifikasi SAF
                </span>
              </div>

              {/* Step 1: Community Deposit */}
              <div className="flex gap-4 sm:gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold border border-amber-200 shadow-sm shrink-0">
                    📱
                  </div>
                  <div className="w-0.5 flex-1 bg-[#E2E8F0] my-2 group-hover:bg-[#004B3C] transition-colors" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-md border border-amber-200">
                      Step 1: Setoran Masyarakat
                    </span>
                    {data.step1_community?.createdAt && (
                      <span className="text-xs text-[#64748B] font-medium">
                        {new Date(data.step1_community.createdAt).toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  {data.step1_communitySubmissions && data.step1_communitySubmissions.length > 0 ? (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {data.step1_communitySubmissions.map((sub, idx) => (
                        <div key={sub.submissionId || idx} className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-mono font-bold text-[#004B3C] text-xs block">{sub.trxCode}</span>
                            <p className="font-bold text-[#1E293B] text-xs">{sub.communityName || 'Masyarakat'}</p>
                            {sub.address && <p className="text-gray-500 text-[11px]">{sub.address}</p>}
                          </div>
                          <div className="sm:text-right">
                            <p className="text-gray-400 font-semibold uppercase text-[10px]">Volume Setoran</p>
                            <p className="font-extrabold text-[#004B3C] text-sm">{sub.cleanLiter || sub.estimatedLiter || 0} Liter</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <p className="text-gray-400 font-semibold uppercase text-[10px]">Penyetor</p>
                        <p className="font-bold text-[#1E293B] text-sm">{data.step1_community?.communityName || 'Masyarakat'}</p>
                        <p className="text-gray-500">{data.step1_community?.address}</p>
                      </div>
                      <div>
                        <p className="text-gray-400 font-semibold uppercase text-[10px]">Volume Estimasi</p>
                        <p className="font-extrabold text-[#004B3C] text-sm">{data.step1_community?.estimatedLiter || data.totalVolumeLiter || 0} Liter</p>
                        {data.step1_community?.latitude && (
                          <p className="text-gray-500 font-mono text-[11px] mt-1">
                            📍 GPS: {data.step1_community.latitude.toFixed(4)}, {data.step1_community.longitude.toFixed(4)}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 2: Collector Validation */}
              <div className="flex gap-4 sm:gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold border border-blue-200 shadow-sm shrink-0">
                    📦
                  </div>
                  <div className="w-0.5 flex-1 bg-[#E2E8F0] my-2 group-hover:bg-[#004B3C] transition-colors" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200">
                      Step 2: Validasi Pengepul (Collector)
                    </span>
                    {data.step2_collector?.validatedAt && (
                      <span className="text-xs text-[#64748B] font-medium">
                        {new Date(data.step2_collector.validatedAt).toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-400 font-semibold uppercase text-[10px]">Pengepul Terverifikasi</p>
                      <p className="font-bold text-[#1E293B] text-sm">{data.step2_collector?.collectorName || '-'}</p>
                      <p className="text-gray-500">{data.step2_collector?.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase text-[10px]">Hasil Penimbangan Bersih</p>
                      <p className="font-extrabold text-[#004B3C] text-sm">
                        {data.step2_collector?.totalCleanLiter || data.step2_collector?.cleanLiter || data.totalVolumeLiter} Liter
                      </p>
                      {data.step2_collector?.sedimentLiter > 0 && (
                        <p className="text-amber-600 text-[11px] font-semibold mt-0.5">
                          Endapan terpisah: {data.step2_collector.sedimentLiter} L
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Lab Analysis */}
              <div className="flex gap-4 sm:gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-700 flex items-center justify-center text-xl font-bold border border-teal-200 shadow-sm shrink-0">
                    🧪
                  </div>
                  <div className="w-0.5 flex-1 bg-[#E2E8F0] my-2 group-hover:bg-[#004B3C] transition-colors" />
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-200">
                      Step 3: Uji Lab Refinery (Quality Assurance)
                    </span>
                    {data.step3_labResult?.testedAt && (
                      <span className="text-xs text-[#64748B] font-medium">
                        {new Date(data.step3_labResult.testedAt).toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                  {data.step3_labResult ? (
                    <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col gap-3">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Kadar Air</span>
                          <span className="text-sm font-extrabold text-[#1E293B]">{data.step3_labResult.waterContentPercent}%</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">FFA %</span>
                          <span className="text-sm font-extrabold text-[#1E293B]">{data.step3_labResult.ffaPercent}%</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#E2E8F0]">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Kotoran</span>
                          <span className="text-sm font-extrabold text-[#1E293B]">{data.step3_labResult.impurityPercent}%</span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#004B3C] text-white flex flex-col justify-center items-center">
                          <span className="text-[9px] font-bold text-white/70 uppercase">QUALITY GRADE</span>
                          <span className="text-base font-extrabold text-[#81F9C1]">GRADE {data.step3_labResult.grade}</span>
                        </div>
                      </div>
                      <p className="text-xs text-[#64748B]">
                        Analisis dilakukan oleh: <strong className="text-[#1E293B]">{data.step3_labResult.testedByName}</strong>
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                      ⌛ Menunggu Pengujian Laboratorium Refinery
                    </div>
                  )}
                </div>
              </div>

              {/* Step 4: SAF Production */}
              <div className="flex gap-4 sm:gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-xl font-bold border border-emerald-200 shadow-sm shrink-0">
                    ✈️
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                      Step 4: Produksi Avtur (Sustainable Aviation Fuel)
                    </span>
                  </div>
                  {data.status === 'ACCEPTED_BY_STAKEHOLDER' && data.step4_safProduction ? (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-[#004B3C] to-[#051C37] text-white shadow-lg flex flex-col gap-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold text-[#81F9C1] uppercase tracking-wider block">PRODUK AKHIR</span>
                          <h4 className="text-lg font-extrabold text-white">{data.step4_safProduction.product}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-[#81F9C1] text-[#004B3C] font-extrabold text-xs">
                          ✅ READY / LULUS SAF
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs text-white/80">
                        <div>
                          <span>Output Bio-Avtur Terverifikasi:</span>
                          <p className="text-base font-extrabold text-[#81F9C1]">
                            {data.step4_safProduction.avturOutputLiter || data.step4_safProduction.estAvturOutputLiter} Liter
                          </p>
                        </div>
                        <div>
                          <span>Standar Sertifikasi:</span>
                          <p className="text-sm font-bold text-white">
                            {data.step4_safProduction.complianceStandard}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : data.status === 'REJECTED_BY_STAKEHOLDER' || data.step3_labResult?.grade === 'REJECT' ? (
                    <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
                      <div>
                        <span className="font-extrabold block text-sm">❌ DITOLAK / TIDAK MEMENUHI STANDAR SAF</span>
                        <p className="text-[11px] text-rose-700 mt-0.5">Batch minyak ini ditolak karena tidak memenuhi kriteria mutu pengolahan Avtur.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold flex items-center justify-between">
                      <div>
                        <span className="font-extrabold block text-sm">⏳ BELUM BERSERTIFIKAT SAF</span>
                        <p className="text-[11px] text-amber-700 mt-0.5">Minyak jelantah masih dalam tahap pengujian lab / verifikasi stakeholder. Bio-Avtur baru diproduksi setelah verifikasi disetujui.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-6 px-4 text-center text-xs text-[#64748B] mt-auto">
        <p className="font-bold text-[#004B3C]">Waste2Wings Traceability Platform</p>
        <p>© 2026 Veridian Energy. Empowering Aviation Sustainability from Waste to Wings.</p>
      </footer>

      {/* QR Code Modal */}
      <QRCodeModal
        isOpen={qrModalOpen}
        code={data?.code}
        title="Traceability Passport QR Code"
        subtitle="Siap dicetak pada drum atau disebarkan untuk verifikasi pasokan"
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  )
}
