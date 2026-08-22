import { useState, useEffect, useMemo } from 'react'
import api from '../../services/api'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'
import { useToast } from '../../contexts/ToastContext'

const ENTITY_TYPE_LABELS = {
  STAKEHOLDER_SETTING: 'Pengaturan Stakeholder',
  COMMUNITY_SUBMISSION: 'Setoran Komunitas',
  COLLECTOR_BATCH: 'Batch Pengepul',
  LAB_RESULT: 'Hasil Uji Lab',
}

const ACTION_CONFIG = {
  CREATE: { label: 'Dibuat', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✨' },
  UPDATE: { label: 'Diperbarui', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: '📝' },
  DELETE: { label: 'Dihapus', bg: 'bg-red-50 text-red-700 border-red-200', icon: '🗑️' },
  ACCEPT: { label: 'Disetujui', bg: 'bg-green-50 text-green-700 border-green-200', icon: '✅' },
  REJECT: { label: 'Ditolak', bg: 'bg-rose-50 text-rose-700 border-rose-200', icon: '❌' },
  FINAL_VALIDATE: { label: 'Validasi Akhir', bg: 'bg-teal-50 text-teal-800 border-teal-200', icon: '🔬' },
  CORRECTION: { label: 'Koreksi', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⚠️' },
}

function ActionBadge({ action }) {
  const cfg = ACTION_CONFIG[action] || { label: action, bg: 'bg-gray-50 text-gray-700 border-gray-200', icon: '📌' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${cfg.bg}`}>
      <span>{cfg.icon}</span>
      <span>{cfg.label}</span>
    </span>
  )
}

function AuditDetailModal({ isOpen, log, onClose }) {
  if (!isOpen || !log) return null

  const beforeObj = log.before ? (typeof log.before === 'string' ? JSON.parse(log.before) : log.before) : null
  const afterObj = log.after ? (typeof log.after === 'string' ? JSON.parse(log.after) : log.after) : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-[#E2E8F0] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
          <div className="flex items-center gap-3">
            <ActionBadge action={log.action} />
            <span className="text-[#004B3C] text-lg font-bold">Detail Audit Log</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-white border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex flex-col gap-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]">
            <div>
              <p className="text-[#94A338] text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Waktu Perubahan</p>
              <p className="text-[#1E293B] text-sm font-semibold mt-0.5">
                {new Date(log.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'medium' })}
              </p>
            </div>
            <div>
              <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider">Pelaku (Actor)</p>
              <p className="text-[#1E293B] text-sm font-semibold mt-0.5">
                {log.actor?.name || 'Sistem'} <span className="text-xs text-[#64748B]">({log.actor?.role || 'SYSTEM'})</span>
              </p>
              <p className="text-xs text-[#64748B]">{log.actor?.email}</p>
            </div>
            <div>
              <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider">Tipe & ID Entitas</p>
              <p className="text-[#1E293B] text-sm font-semibold mt-0.5">
                {ENTITY_TYPE_LABELS[log.entityType] || log.entityType}
              </p>
              <p className="text-xs font-mono text-[#64748B] truncate">{log.entityId}</p>
            </div>
            <div>
              <p className="text-[#64748B] text-[10px] font-bold uppercase tracking-wider">IP Address & User Agent</p>
              <p className="text-[#1E293B] text-sm font-semibold mt-0.5">{log.ipAddress || 'Internal'}</p>
              <p className="text-[11px] text-[#64748B] truncate">{log.userAgent || '-'}</p>
            </div>
          </div>

          {/* Reason / Catatan */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
            <p className="text-amber-800 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span>💬</span> Alasan / Catatan Perubahan:
            </p>
            <p className="text-[#1E293B] text-sm font-medium mt-1 whitespace-pre-wrap">
              {log.reason || '(Tidak ada catatan/alasan tertulis)'}
            </p>
          </div>

          {/* Before & After JSON Diffs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#64748B] flex items-center gap-1">
                <span>🔴</span> Data Sebelum (Before)
              </span>
              <pre className="p-4 rounded-2xl bg-[#1E293B] text-red-300 text-xs font-mono overflow-x-auto max-h-60">
                {beforeObj ? JSON.stringify(beforeObj, null, 2) : '// Tidak ada data sebelumnya'}
              </pre>
            </div>

            {/* After */}
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-[#64748B] flex items-center gap-1">
                <span>🟢</span> Data Sesudah (After)
              </span>
              <pre className="p-4 rounded-2xl bg-[#1E293B] text-emerald-300 text-xs font-mono overflow-x-auto max-h-60">
                {afterObj ? JSON.stringify(afterObj, null, 2) : '// Tidak ada data sesudahnya'}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-[#F1F5F9] bg-[#F8FAFC]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-[#004B3C] text-white text-sm font-bold hover:bg-[#00382D] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AuditLogPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [entityFilter, setEntityFilter] = useState('ALL')
  const [actionFilter, setActionFilter] = useState('ALL')
  const [selectedLog, setSelectedLog] = useState(null)
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 15

  const { showToast } = useToast()

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  const fetchAuditLogs = async () => {
    try {
      setIsLoading(true)
      const res = await api.get('/audit-logs?limit=100')
      const data = res.data?.auditLogs || res.data || []
      setLogs(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch audit logs:', error)
      showToast('Gagal memuat log audit', 'error', 3000, 'Error')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch =
        search === '' ||
        log.actor?.name?.toLowerCase().includes(search.toLowerCase()) ||
        log.actor?.email?.toLowerCase().includes(search.toLowerCase()) ||
        log.reason?.toLowerCase().includes(search.toLowerCase()) ||
        log.entityId?.toLowerCase().includes(search.toLowerCase())

      const matchesEntity = entityFilter === 'ALL' || log.entityType === entityFilter
      const matchesAction = actionFilter === 'ALL' || log.action === actionFilter

      return matchesSearch && matchesEntity && matchesAction
    })
  }, [logs, search, entityFilter, actionFilter])

  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginatedLogs = filteredLogs.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="flex min-h-screen bg-[#F5F7F6]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px] transition-all duration-300">
        <TopNav onMenuToggle={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-8 gap-8 overflow-y-auto">
          {/* Header */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '0ms' }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <nav className="flex items-center gap-2 text-sm text-[#64748B] mb-1">
                  <span>Stakeholder</span>
                  <span>/</span>
                  <span className="text-[#004B3C] font-bold">Audit Trail</span>
                </nav>
                <h1 className="text-2xl font-extrabold text-[#004B3C]">Audit Trail & Log Aktivitas</h1>
                <p className="text-sm text-[#64748B]">
                  Pelacakan transparan seluruh aktivitas pengeditan, persetujuan, dan catatan perubahannya.
                </p>
              </div>

              <button
                onClick={fetchAuditLogs}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#004B3C] text-sm font-bold hover:bg-[#F8FAFC] transition-colors self-start sm:self-auto"
              >
                <span>🔄</span> Segarkan Log
              </button>
            </div>
          </section>

          {/* Stats Bar */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-slide-up" style={{ animationDelay: '60ms' }}>
            <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#004B3C]/10 text-[#004B3C] flex items-center justify-center text-xl font-bold">
                📋
              </div>
              <div>
                <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Total Audit Log</p>
                <p className="text-2xl font-extrabold text-[#1E293B]">{logs.length}</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center text-xl font-bold">
                💬
              </div>
              <div>
                <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Dengan Catatan/Alasan</p>
                <p className="text-2xl font-extrabold text-[#1E293B]">{logs.filter((l) => !!l.reason).length}</p>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center text-xl font-bold">
                👤
              </div>
              <div>
                <p className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Aktivitas Terfilter</p>
                <p className="text-2xl font-extrabold text-[#1E293B]">{filteredLogs.length}</p>
              </div>
            </div>
          </section>

          {/* Table Container */}
          <section className="animate-fade-slide-up" style={{ animationDelay: '120ms' }}>
            <div className="rounded-3xl border border-[#E2E8F0] bg-white shadow-sm overflow-hidden">
              {/* Filters */}
              <div className="p-6 border-b border-[#F1F5F9] flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px]">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                  <input
                    type="text"
                    placeholder="Cari nama pelaku, email, ID, atau alasan..."
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] text-sm text-[#1E293B] placeholder:text-gray-400 outline-none focus:border-[#004B3C] focus:bg-white transition-all"
                  />
                </div>

                {/* Dropdowns */}
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={entityFilter}
                    onChange={(e) => { setEntityFilter(e.target.value); setPage(1) }}
                    className="px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#1E293B] font-medium outline-none focus:border-[#004B3C]"
                  >
                    <option value="ALL">Semua Tipe Entitas</option>
                    <option value="COLLECTOR_BATCH">Batch Pengepul</option>
                    <option value="LAB_RESULT">Hasil Uji Lab</option>
                    <option value="COMMUNITY_SUBMISSION">Setoran Komunitas</option>
                    <option value="STAKEHOLDER_SETTING">Pengaturan Stakeholder</option>
                  </select>

                  <select
                    value={actionFilter}
                    onChange={(e) => { setActionFilter(e.target.value); setPage(1) }}
                    className="px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#1E293B] font-medium outline-none focus:border-[#004B3C]"
                  >
                    <option value="ALL">Semua Aksi</option>
                    <option value="CREATE">CREATE (Dibuat)</option>
                    <option value="UPDATE">UPDATE (Diperbarui)</option>
                    <option value="DELETE">DELETE (Dihapus)</option>
                    <option value="ACCEPT">ACCEPT (Disetujui)</option>
                    <option value="REJECT">REJECT (Ditolak)</option>
                    <option value="FINAL_VALIDATE">FINAL VALIDATE</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px]">
                  <thead>
                    <tr className="bg-[#F8FAFC]">
                      <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">WAKTU</th>
                      <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">PELAKU (ACTOR)</th>
                      <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">AKSI</th>
                      <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">ENTITAS</th>
                      <th className="px-6 py-4 text-left text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">ALASAN / CATATAN</th>
                      <th className="px-6 py-4 text-right text-[#94A3B8] text-[11px] font-bold uppercase tracking-wider">ACTION</th>
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
                    ) : paginatedLogs.length > 0 ? (
                      paginatedLogs.map((log) => (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedLog(log)}
                          className="border-t border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4 text-xs font-medium text-[#475569] whitespace-nowrap">
                            {new Date(log.createdAt).toLocaleString('id-ID', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-sm font-bold text-[#1E293B] group-hover:text-[#004B3C] transition-colors">
                                {log.actor?.name || 'System'}
                              </p>
                              <p className="text-xs text-[#64748B]">{log.actor?.role || 'SYSTEM'}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <ActionBadge action={log.action} />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="text-xs font-bold text-[#1E293B]">
                                {ENTITY_TYPE_LABELS[log.entityType] || log.entityType}
                              </p>
                              <p className="text-[11px] font-mono text-[#94A3B8] truncate max-w-[120px]">
                                {log.entityId}
                              </p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-xs text-[#334155] max-w-xs truncate font-medium">
                              {log.reason ? `"${log.reason}"` : <span className="text-[#94A3B8] italic">Tanpa alasan</span>}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-bold text-[#004B3C] group-hover:underline">
                              Detail & Diff →
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-[#94A3B8] text-sm">
                          Tidak ada data audit log yang sesuai.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 px-6 py-4 border-t border-[#F1F5F9] bg-[#F8FAFC]">
                  <button
                    disabled={safePage === 1}
                    onClick={() => setPage(safePage - 1)}
                    className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] font-bold text-sm disabled:opacity-40"
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold border transition-colors ${
                        p === safePage
                          ? 'bg-[#004B3C] text-white border-[#004B3C]'
                          : 'bg-white text-[#64748B] border-[#E2E8F0] hover:bg-[#F1F5F9]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    disabled={safePage === totalPages}
                    onClick={() => setPage(safePage + 1)}
                    className="w-8 h-8 rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] font-bold text-sm disabled:opacity-40"
                  >
                    ›
                  </button>
                </div>
              )}
            </div>
          </section>
        </main>

        <DashboardFooter />
      </div>

      {/* Audit Detail Modal */}
      <AuditDetailModal
        isOpen={!!selectedLog}
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
      />
    </div>
  )
}
