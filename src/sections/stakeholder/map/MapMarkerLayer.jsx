import { useState } from 'react'

function HubMarker({ style, label }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="absolute map-marker-pop"
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Pulse ring */}
      <div className="absolute inset-[-48px] rounded-full bg-brand-gold/35 animate-hub-pulse pointer-events-none" />

      {/* Tooltip */}
      {hovered && (
        <div className="animate-tooltip-pop absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 whitespace-nowrap px-3 py-1.5 rounded-lg border border-white/10 bg-[rgba(5,28,55,0.85)] backdrop-blur-md text-white text-xs sm:text-sm font-normal leading-6 pointer-events-none">
          {label}
        </div>
      )}

      {/* Pin */}
      <div className="relative animate-marker-float cursor-pointer">
        <svg width="27" height="34" viewBox="0 0 27 34" fill="none">
          <g filter="url(#hub_shadow)">
            <path d="M13.3333 16.6667C14.25 16.6667 15.0347 16.3403 15.6875 15.6875C16.3403 15.0347 16.6667 14.25 16.6667 13.3333C16.6667 12.4167 16.3403 11.6319 15.6875 10.9792C15.0347 10.3264 14.25 10 13.3333 10C12.4167 10 11.6319 10.3264 10.9792 10.9792C10.3264 11.6319 10 12.4167 10 13.3333C10 14.25 10.3264 15.0347 10.9792 15.6875C11.6319 16.3403 12.4167 16.6667 13.3333 16.6667ZM13.3333 33.3333C8.86111 29.5278 5.52083 25.9931 3.3125 22.7292C1.10417 19.4653 0 16.4444 0 13.6667C0 9.5 1.34028 6.18056 4.02083 3.70833C6.70139 1.23611 9.80556 0 13.3333 0C16.8611 0 19.9653 1.23611 22.6458 3.70833C25.3264 6.18056 26.6667 9.5 26.6667 13.6667C26.6667 16.4444 25.5625 19.4653 23.3542 22.7292C21.1458 25.9931 17.8056 29.5278 13.3333 33.3333Z" fill="#C9A96E" />
          </g>
          <defs>
            <filter id="hub_shadow" x="-8" y="-8" width="42.667" height="49.3333" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset />
              <feGaussianBlur stdDeviation="4" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.0431373 0 0 0 0 0.368627 0 0 0 0 0.294118 0 0 0 0.6 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
            </filter>
          </defs>
        </svg>
      </div>
    </div>
  )
}

function TruckMarker({ style }) {
  return (
    <div className="absolute map-marker-pop" style={style}>
      <div className="flex flex-col items-center gap-1 animate-truck-drive">
        <div className="flex items-center justify-center w-[22px] h-[22px] rounded-md bg-brand-dark shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10)]">
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
            <path d="M2.91667 9.33333C2.43056 9.33333 2.01736 9.16319 1.67708 8.82292C1.33681 8.48264 1.16667 8.06944 1.16667 7.58333H0V1.16667C0 0.845833 0.114236 0.571181 0.342708 0.342708C0.571181 0.114236 0.845833 0 1.16667 0H9.33333V2.33333H11.0833L12.8333 4.66667V7.58333H11.6667C11.6667 8.06944 11.4965 8.48264 11.1562 8.82292C10.816 9.16319 10.4028 9.33333 9.91667 9.33333C9.43056 9.33333 9.01736 9.16319 8.67708 8.82292C8.33681 8.48264 8.16667 8.06944 8.16667 7.58333H4.66667C4.66667 8.06944 4.49653 8.48264 4.15625 8.82292C3.81597 9.16319 3.40278 9.33333 2.91667 9.33333ZM2.91667 8.16667C3.08194 8.16667 3.22049 8.11076 3.33229 7.99896C3.4441 7.88715 3.5 7.74861 3.5 7.58333C3.5 7.41806 3.4441 7.27951 3.33229 7.16771C3.22049 7.0559 3.08194 7 2.91667 7C2.75139 7 2.61285 7.0559 2.50104 7.16771C2.38924 7.27951 2.33333 7.41806 2.33333 7.58333C2.33333 7.74861 2.38924 7.88715 2.50104 7.99896C2.61285 8.11076 2.75139 8.16667 2.91667 8.16667ZM1.16667 6.41667H1.63333C1.79861 6.24167 1.98819 6.10069 2.20208 5.99375C2.41597 5.88681 2.65417 5.83333 2.91667 5.83333C3.17917 5.83333 3.41736 5.88681 3.63125 5.99375C3.84514 6.10069 4.03472 6.24167 4.2 6.41667H8.16667V1.16667H1.16667V6.41667ZM9.91667 8.16667C10.0819 8.16667 10.2205 8.11076 10.3323 7.99896C10.4441 7.88715 10.5 7.74861 10.5 7.58333C10.5 7.41806 10.4441 7.27951 10.3323 7.16771C10.2205 7.0559 10.0819 7 9.91667 7C9.75139 7 9.61285 7.0559 9.50104 7.16771C9.38924 7.27951 9.33333 7.41806 9.33333 7.58333C9.33333 7.74861 9.38924 7.88715 9.50104 7.99896C9.61285 8.11076 9.75139 8.16667 9.91667 8.16667ZM9.33333 5.25H11.8125L10.5 3.5H9.33333V5.25Z" fill="white" />
          </svg>
        </div>
        <div className="w-1 h-1 rounded-full bg-brand-dark" />
      </div>
    </div>
  )
}

export default function MapMarkerLayer() {
  return (
    <>
      <HubMarker
        style={{ left: '44%', top: '38%', transform: 'translate(-50%, -50%)' }}
        label="Jakarta Central Hub (92% Cap)"
      />
      <TruckMarker
        style={{ left: '54%', top: '47%', transform: 'translate(-50%, -50%)' }}
      />
    </>
  )
}
