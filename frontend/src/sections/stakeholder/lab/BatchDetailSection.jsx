import { useState, useMemo } from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'
import LabEditModal from '../../../components/modals/LabEditModal'

const getStatusColor = (value, limit) => {
  if (value > limit) return { status: 'CRITICAL', color: '#EF4444' }
  if (value > limit * 0.85) return { status: 'WARNING', color: '#F59E0B' }
  return { status: 'OPTIMAL', color: '#10B981' }
}

const computeRadarScore = (value, limit, maxValue = 100) => {
  if (!value || !limit) return 0
  return Math.max(0, Math.min(maxValue, (1 - value / limit) * maxValue))
}

function ExternalLinkIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
      <path
        d="M1.16667 10.5C0.845833 10.5 0.571181 10.3858 0.342708 10.1573C0.114236 9.92882 0 9.65417 0 9.33333V1.16667C0 0.845833 0.114236 0.571181 0.342708 0.342708C0.571181 0.114236 0.845833 0 1.16667 0H5.25V1.16667H1.16667V9.33333H9.33333V5.25H10.5V9.33333C10.5 9.65417 10.3858 9.92882 10.1573 10.1573C9.92882 10.3858 9.65417 10.5 9.33333 10.5H1.16667ZM3.90833 7.40833L3.09167 6.59167L8.51667 1.16667H6.41667V0H10.5V4.08333H9.33333V1.98333L3.90833 7.40833Z"
        fill="#004B3C"
      />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
      <path
        d="M0 19L11 0L22 19H0ZM3.45 17H18.55L11 4L3.45 17ZM11 16C11.2833 16 11.5208 15.9042 11.7125 15.7125C11.9042 15.5208 12 15.2833 12 15C12 14.7167 11.9042 14.4792 11.7125 14.2875C11.5208 14.0958 11.2833 14 11 14C10.7167 14 10.4792 14.0958 10.2875 14.2875C10.0958 14.4792 10 14.7167 10 15C10 15.2833 10.0958 15.5208 10.2875 15.7125C10.4792 15.9042 10.7167 16 11 16ZM10 13H12V8H10V13Z"
        fill="#F59E0B"
      />
    </svg>
  )
}

export default function BatchDetailSection({ selectedBatchId, batches = [] }) {
  const [editModalOpen, setEditModalOpen] = useState(false)

  const selectedBatch = useMemo(() => {
    return batches.find((b) => b.id === selectedBatchId)
  }, [selectedBatchId, batches])

  const batchData = useMemo(() => {
    if (!selectedBatch?.labResult) {
      return null
    }

    const labResult = selectedBatch.labResult
    const ffaLimit = 4.0
    const moistureLimit = 2.0
    const impurityLimit = 1.0

    const ffaStatus = getStatusColor(labResult.ffaPercent, ffaLimit)
    const moistureStatus = getStatusColor(labResult.waterContentPercent, moistureLimit)
    const impurityStatus = getStatusColor(labResult.impurityPercent, impurityLimit)

    const radarData = [
      { subject: 'MOISTURE', A: computeRadarScore(labResult.waterContentPercent, moistureLimit) },
      { subject: 'FFA', A: computeRadarScore(labResult.ffaPercent, ffaLimit) },
      { subject: 'IMPURITIES', A: computeRadarScore(labResult.impurityPercent, impurityLimit) },
    ]

    return {
      batchCode: selectedBatch.batchCode,
      ffa: {
        value: `${labResult.ffaPercent.toFixed(2)}%`,
        limit: `${ffaLimit.toFixed(1)}%`,
        status: ffaStatus.status,
        statusColor: ffaStatus.color,
      },
      moisture: {
        value: `${labResult.waterContentPercent.toFixed(2)}%`,
        limit: `${moistureLimit.toFixed(1)}%`,
        status: moistureStatus.status,
        statusColor: moistureStatus.color,
      },
      impurity: {
        value: `${labResult.impurityPercent.toFixed(2)}%`,
        limit: `${impurityLimit.toFixed(1)}%`,
        status: impurityStatus.status,
        statusColor: impurityStatus.color,
      },
      grade: labResult.grade,
      notes: labResult.notes,
      radarData,
      recommendation: labResult.ffaPercent > ffaLimit * 0.85 ? {
        text: 'Kadar FFA mendekati ambang batas. Perlu blending dengan Grade A untuk menjaga efisiensi katalis SAF.',
        link: 'Protokol Blending',
      } : null,
    }
  }, [selectedBatch])

  if (!batchData) {
    return (
      <div className="rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] overflow-hidden p-8">
        <div className="flex items-center justify-center h-64 text-center">
          <div className="flex flex-col gap-2">
            <p className="text-[#64748B] text-sm">Belum ada hasil lab untuk batch ini</p>
            <p className="text-[#94A3B8] text-xs">Klik tombol "Input Hasil Lab" untuk menambahkan data</p>
          </div>
        </div>
      </div>
    )
  }

  const isCritical = batchData.ffa.status === 'CRITICAL'

  return (
    <div className="rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] overflow-hidden animate-fade-slide-up">
      <div className="flex flex-col lg:flex-row">
        {/* ── Left info panel ── */}
        <div className="flex flex-col gap-6 p-6 lg:p-8 lg:w-[320px] lg:flex-shrink-0 border-b lg:border-b-0 lg:border-r border-[#F1F5F9] bg-[rgba(248,250,252,0.30)]">
          {/* Batch label + title */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded-lg bg-[rgba(245,158,11,0.10)] text-[#F59E0B] text-[10px] font-extrabold leading-[15px]">
                SELECTED BATCH
              </span>
              <span className="text-[#94A3B8] text-xs font-bold leading-4 tracking-[1.2px] uppercase">
                {batchData.batchCode}
              </span>
            </div>
            <h2 className="text-[#004B3C] text-2xl font-extrabold leading-8">Detail Analisis Batch</h2>
            <p className="text-[#64748B] text-sm font-normal leading-5">
              Hasil analisis lab dengan grade {batchData.grade}
            </p>
          </div>

          {/* Metric cards */}
          <div className="flex flex-col gap-4">
            {/* FFA */}
            <div
              className={[
                'flex flex-col gap-1 p-4 rounded-2xl border bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] transition-all duration-300',
                isCritical ? 'border-[#FCA5A5]' : 'border-[#E2E8F0]',
              ].join(' ')}
            >
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[0.6px]">FREE FATTY ACID</span>
                <span
                  className="text-[10px] font-bold leading-[15px] transition-colors duration-300"
                  style={{ color: batchData.ffa.statusColor }}
                >
                  {batchData.ffa.status}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className="text-xl font-extrabold leading-7 transition-colors duration-300"
                  style={{ color: isCritical ? '#EF4444' : '#1E293B' }}
                >
                  {batchData.ffa.value}
                </span>
                <span className="text-[#94A3B8] text-xs font-medium leading-4">Limit: {batchData.ffa.limit}</span>
              </div>
            </div>

            {/* Moisture */}
            <div className="flex flex-col gap-1 p-4 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[0.6px]">MOISTURE CONTENT</span>
                <span className="text-[10px] font-bold leading-[15px]" style={{ color: batchData.moisture.statusColor }}>
                  {batchData.moisture.status}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[#1E293B] text-xl font-extrabold leading-7">{batchData.moisture.value}</span>
                <span className="text-[#94A3B8] text-xs font-medium leading-4">Limit: {batchData.moisture.limit}</span>
              </div>
            </div>

            {/* Impurity */}
            <div className="flex flex-col gap-1 p-4 rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
              <div className="flex items-center justify-between">
                <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[0.6px]">IMPURITY</span>
                <span className="text-[10px] font-bold leading-[15px]" style={{ color: batchData.impurity.statusColor }}>
                  {batchData.impurity.status}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[#1E293B] text-xl font-extrabold leading-7">{batchData.impurity.value}</span>
                <span className="text-[#94A3B8] text-xs font-medium leading-4">Limit: {batchData.impurity.limit}</span>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          {batchData.recommendation && (
            <div className="flex flex-col pt-6 border-t border-[#E2E8F0]">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-[rgba(245,158,11,0.10)]">
                  <WarningIcon />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[#1E293B] text-sm font-bold leading-5">Rekomendasi Ahli</span>
                  <p className="text-[#64748B] text-xs font-normal leading-4">{batchData.recommendation.text}</p>
                  <button className="flex items-center gap-1.5 pt-2 text-[#004B3C] text-xs font-bold leading-4 hover:underline transition-all duration-200 group">
                    <span>{batchData.recommendation.link}</span>
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ExternalLinkIcon />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right radar panel ── */}
        <div className="flex flex-col items-center justify-center gap-6 flex-1 p-6 lg:p-8 bg-white overflow-hidden">
          <div className="self-start">
            <span className="text-[#CBD5E1] text-[10px] font-bold tracking-[1px] uppercase">SPECTROMETRY GRAPH</span>
          </div>

          {/* Radar chart */}
          <div className="w-full max-w-[500px] mx-auto">
            <ResponsiveContainer width="100%" aspect={1.1}>
              <RadarChart
                data={batchData.radarData}
                margin={{ top: 24, right: 48, bottom: 24, left: 48 }}
              >
                <PolarGrid
                  gridType="polygon"
                  stroke="#E2E8F0"
                  strokeWidth={1.5}
                />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#94A3B8', fontSize: 11, fontWeight: 700, fontFamily: 'Plus Jakarta Sans' }}
                />
                <Radar
                  dataKey="A"
                  stroke="#2DD4BF"
                  strokeWidth={3}
                  fill="#2DD4BF"
                  fillOpacity={0.2}
                  dot={{ r: 5, fill: '#2DD4BF', strokeWidth: 0 }}
                  animationBegin={0}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Notes section */}
          {batchData.notes && (
            <div className="w-full max-w-[500px] mx-auto pt-4 border-t border-[#E2E8F0]">
              <div className="flex flex-col gap-2">
                <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[0.6px]">CATATAN LAB</span>
                <p className="text-[#64748B] text-xs leading-4">{batchData.notes}</p>
              </div>
            </div>
          )}

          {/* Edit button for accepted/rejected batches */}
          {selectedBatch && (selectedBatch.status === 'ACCEPTED_BY_STAKEHOLDER' || selectedBatch.status === 'REJECTED_BY_STAKEHOLDER') && (
            <div className="w-full max-w-[500px] mx-auto pt-4 border-t border-[#E2E8F0]">
              <button
                onClick={() => setEditModalOpen(true)}
                className="w-full px-4 py-2.5 rounded-lg bg-[#F3F4F6] text-[#051C37] font-bold text-sm transition-all duration-200 hover:bg-[#E5E7EB] active:scale-95"
              >
                Edit Hasil Lab
              </button>
            </div>
          )}
        </div>
      </div>

      <LabEditModal
        isOpen={editModalOpen}
        labResult={selectedBatch?.labResult}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          setEditModalOpen(false)
          window.location.reload()
        }}
      />
    </div>
  )
}
