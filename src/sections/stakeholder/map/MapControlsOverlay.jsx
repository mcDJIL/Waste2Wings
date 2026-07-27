import { useState } from 'react'

export default function MapControlsOverlay({ onZoomIn, onZoomOut }) {
  const [layersOpen, setLayersOpen] = useState(false)

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 animate-fade-slide-left">
      {/* Zoom + Geolocate */}
      <div className="flex flex-col items-center rounded-2xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-lg overflow-hidden">
        <button
          onClick={onZoomIn}
          aria-label="Zoom in"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 hover:bg-brand-dark/10 transition-colors duration-200 active:scale-95"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="#004536" />
          </svg>
        </button>

        <div className="w-full h-px bg-[rgba(190,201,195,0.30)]" />

        <button
          onClick={onZoomOut}
          aria-label="Zoom out"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 hover:bg-brand-dark/10 transition-colors duration-200 active:scale-95"
        >
          <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
            <path d="M0 2V0H14V2H0Z" fill="#004536" />
          </svg>
        </button>

        <div className="w-full h-px bg-[rgba(190,201,195,0.30)]" />

        <button
          aria-label="My location"
          className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 hover:bg-brand-dark/10 transition-colors duration-200 active:scale-95"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M9.95 21.9V19.9C7.86667 19.6667 6.07917 18.8042 4.5875 17.3125C3.09583 15.8208 2.23333 14.0333 2 11.95H0V9.95H2C2.23333 7.86667 3.09583 6.07917 4.5875 4.5875C6.07917 3.09583 7.86667 2.23333 9.95 2V0H11.95V2C14.0333 2.23333 15.8208 3.09583 17.3125 4.5875C18.8042 6.07917 19.6667 7.86667 19.9 9.95H21.9V11.95H19.9C19.6667 14.0333 18.8042 15.8208 17.3125 17.3125C15.8208 18.8042 14.0333 19.6667 11.95 19.9V21.9H9.95ZM10.95 17.95C12.8833 17.95 14.5333 17.2667 15.9 15.9C17.2667 14.5333 17.95 12.8833 17.95 10.95C17.95 9.01667 17.2667 7.36667 15.9 6C14.5333 4.63333 12.8833 3.95 10.95 3.95C9.01667 3.95 7.36667 4.63333 6 6C4.63333 7.36667 3.95 9.01667 3.95 10.95C3.95 12.8833 4.63333 14.5333 6 15.9C7.36667 17.2667 9.01667 17.95 10.95 17.95ZM10.95 14.95C9.85 14.95 8.90833 14.5583 8.125 13.775C7.34167 12.9917 6.95 12.05 6.95 10.95C6.95 9.85 7.34167 8.90833 8.125 8.125C8.90833 7.34167 9.85 6.95 10.95 6.95C12.05 6.95 12.9917 7.34167 13.775 8.125C14.5583 8.90833 14.95 9.85 14.95 10.95C14.95 12.05 14.5583 12.9917 13.775 13.775C12.9917 14.5583 12.05 14.95 10.95 14.95ZM10.95 12.95C11.5 12.95 11.9708 12.7542 12.3625 12.3625C12.7542 11.9708 12.95 11.5 12.95 10.95C12.95 10.4 12.7542 9.92917 12.3625 9.5375C11.9708 9.14583 11.5 8.95 10.95 8.95C10.4 8.95 9.92917 9.14583 9.5375 9.5375C9.14583 9.92917 8.95 10.4 8.95 10.95C8.95 11.5 9.14583 11.9708 9.5375 12.3625C9.92917 12.7542 10.4 12.95 10.95 12.95Z" fill="#004536" />
          </svg>
        </button>
      </div>

      {/* Layers toggle */}
      <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-lg overflow-hidden">
        <div className="w-full h-[66px] rounded-2xl bg-white/0 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)]" />
        <button
          onClick={() => setLayersOpen((v) => !v)}
          className="absolute flex items-center gap-3 px-3 py-2 -mt-[66px] hover:bg-brand-dark/5 transition-colors duration-200 w-full active:scale-95"
        >
          <svg width="18" height="20" viewBox="0 0 18 20" fill="none" className="flex-shrink-0">
            <path d="M9 19.05L0 12.05L1.65 10.8L9 16.5L16.35 10.8L18 12.05L9 19.05ZM9 14L0 7L9 0L18 7L9 14Z" fill="#004536" />
          </svg>
          <span className="text-[#051C37] text-sm font-normal leading-6">Layers</span>
        </button>
      </div>
    </div>
  )
}
