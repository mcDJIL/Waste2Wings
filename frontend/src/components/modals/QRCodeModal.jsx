import { useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Reusable QR Code Modal Component
 * Renders QR Code for Batch or Submission
 * Provides Print Tag Label, Copy Link, and Download Image options
 */
export default function QRCodeModal({ isOpen, code, title, subtitle, onClose }) {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !code) return null

  // Generate public full URL for the QR code target
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://waste2wings.eepis.web.id'
  const targetUrl = `${origin}/trace/${encodeURIComponent(code)}`

  // Use reliable high-quality SVG QR Code renderer via Google Chart / QR Server API
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(targetUrl)}&color=004B3C`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error(e)
    }
  }

  const handlePrintLabel = () => {
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Tag Label - ${code}</title>
          <style>
            body { font-family: 'Plus Jakarta Sans', sans-serif; text-align: center; padding: 40px; }
            .label-card { border: 3px solid #004B3C; border-radius: 16px; padding: 24px; max-width: 320px; margin: auto; }
            .brand { color: #004B3C; font-weight: 800; font-size: 18px; margin-bottom: 4px; }
            .sub { color: #64748B; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 16px; }
            .qr { width: 200px; height: 200px; margin: auto; }
            .code { font-family: monospace; font-size: 14px; font-weight: 700; color: #1E293B; margin-top: 12px; }
            .footer { font-size: 10px; color: #94A3B8; margin-top: 12px; }
          </style>
        </head>
        <body>
          <div class="label-card">
            <div class="brand">🌱 Waste2Wings</div>
            <div class="sub">Supply Chain Traceability Tag</div>
            <img src="${qrImageUrl}" class="qr" alt="QR Code" />
            <div class="code">${code}</div>
            <div class="footer">Scan to verify origin & SAF compliance</div>
          </div>
          <script>window.onload = () => { window.print(); window.close(); }</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8F0] flex flex-col items-center text-center relative animate-fade-slide-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:bg-[#F1F5F9] transition-colors"
        >
          ✕
        </button>

        {/* Title */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004B3C]/10 text-[#004B3C] text-xs font-extrabold mb-2">
            📱 QR Code Traceability
          </div>
          <h3 className="text-[#004B3C] text-xl font-extrabold">{title || 'Traceability QR Tag'}</h3>
          <p className="text-[#64748B] text-xs mt-1">{subtitle || 'Pindai untuk melihat rantai pasokan dari dapur ke avtur'}</p>
        </div>

        {/* QR Display Card */}
        <div className="p-5 rounded-2xl bg-white border-2 border-[#004B3C]/20 shadow-inner flex flex-col items-center my-2">
          <img
            src={qrImageUrl}
            alt={`QR ${code}`}
            className="w-48 h-48 object-contain rounded-lg"
          />
          <span className="mt-3 px-3 py-1 rounded-lg bg-[#F8FAFC] text-[#1E293B] font-mono text-xs font-bold border border-[#E2E8F0]">
            {code}
          </span>
        </div>

        <p className="text-[11px] text-[#64748B] mb-5">
          Standardized URL: <span className="font-mono text-[#004B3C] font-semibold">{targetUrl}</span>
        </p>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#1E293B] text-xs font-bold hover:bg-[#F8FAFC] transition-colors flex items-center justify-center gap-1.5"
          >
            <span>{copied ? '✅' : '🔗'}</span>
            <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
          </button>

          <button
            onClick={handlePrintLabel}
            className="px-4 py-2.5 rounded-xl bg-[#004B3C] text-white text-xs font-bold hover:bg-[#00382D] transition-colors flex items-center justify-center gap-1.5 shadow-md"
          >
            <span>🖨️</span>
            <span>Cetak Tag Drum</span>
          </button>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
