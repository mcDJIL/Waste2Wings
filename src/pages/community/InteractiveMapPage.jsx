import { useState, useEffect, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'
import Sidebar from '../../sections/community/dashboard/Sidebar'
import TopBar from '../../sections/community/dashboard/TopBar'
import DashboardFooter from '../../sections/community/dashboard/DashboardFooter'

// Fix Leaflet default icon URLs broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const createMapPin = (color, label) => {
  const colorMap = { red: '#BA1A1A', green: '#006C49', blue: '#2563EB' }
  const fill = colorMap[color] ?? '#006C49'
  return L.divIcon({
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
    html: `<div style="position:relative;width:32px;height:42px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">
      <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 8C11.03 8 7 12.03 7 17C7 24 16 34 16 34C16 34 25 24 25 17C25 12.03 20.97 8 16 8Z" fill="${fill}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="17" r="4" fill="white"/>
      </svg>
      ${label ? `<div style="position:absolute;top:-4px;right:-16px;background:#004536;border:1.5px solid white;border-radius:10px;padding:0 5px;color:white;font-size:9px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;line-height:16px">${label}</div>` : ''}
    </div>`,
  })
}

const LEGEND_ITEMS = [
  { color: '#006C49', label: 'Lokasi Anda' },
  { color: '#2563EB', label: 'Pengepul' },
]

// ─── SVG icons ──────────────────────────────────────────────────────────────

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 14 13" fill="none">
    <path d="M2.55 12.6667L3.63333 7.98333L0 4.83333L4.8 4.41667L6.66667 0L8.53333 4.41667L13.3333 4.83333L9.7 7.98333L10.7833 12.6667L6.66667 10.1833L2.55 12.6667Z" fill="#C9A96E"/>
  </svg>
)

const NavigateIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M5.775 10.5L4.1125 6.3875L0 4.725V3.90833L10.5 0L6.59167 10.5H5.775ZM6.15417 8.34167L8.51667 1.98333L2.15833 4.34583L5.01667 5.48333L6.15417 8.34167Z" fill="white"/>
  </svg>
)

const PhoneIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M9.8875 10.5C8.67222 10.5 7.47153 10.2351 6.28542 9.70521C5.09931 9.17535 4.02014 8.4243 3.04792 7.45208C2.07569 6.47986 1.32465 5.40069 0.794792 4.21458C0.264931 3.02847 0 1.82778 0 0.6125C0 0.4375 0.0583333 0.291667 0.175 0.175C0.291667 0.0583333 0.4375 0 0.6125 0H2.975C3.11111 0 3.23264 0.0461806 3.33958 0.138542C3.44653 0.230903 3.50972 0.340278 3.52917 0.466667L3.90833 2.50833C3.92778 2.66389 3.92292 2.79514 3.89375 2.90208C3.86458 3.00903 3.81111 3.10139 3.73333 3.17917L2.31875 4.60833C2.51319 4.96806 2.7441 5.31562 3.01146 5.65104C3.27882 5.98646 3.57292 6.30972 3.89375 6.62083C4.19514 6.92222 4.51111 7.20174 4.84167 7.45937C5.17222 7.71701 5.52222 7.95278 5.89167 8.16667L7.2625 6.79583C7.35 6.70833 7.46424 6.64271 7.60521 6.59896C7.74618 6.55521 7.88472 6.54306 8.02083 6.5625L10.0333 6.97083C10.1694 7.00972 10.2812 7.08021 10.3687 7.18229C10.4562 7.28437 10.5 7.39861 10.5 7.525V9.8875C10.5 10.0625 10.4417 10.2083 10.325 10.325C10.2083 10.4417 10.0625 10.5 9.8875 10.5ZM1.76458 3.5L2.72708 2.5375L2.47917 1.16667H1.18125C1.22986 1.56528 1.29792 1.95903 1.38542 2.34792C1.47292 2.73681 1.59931 3.12083 1.76458 3.5ZM6.98542 8.72083C7.36458 8.88611 7.75104 9.01736 8.14479 9.11458C8.53854 9.21181 8.93472 9.275 9.33333 9.30417V8.02083L7.9625 7.74375L6.98542 8.72083Z" fill="#051C37"/>
  </svg>
)

const TruckIcon = () => (
  <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
    <path d="M5 16C4.16667 16 3.45833 15.7083 2.875 15.125C2.29167 14.5417 2 13.8333 2 13H0V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16V4H19L22 8V13H20C20 13.8333 19.7083 14.5417 19.125 15.125C18.5417 15.7083 17.8333 16 17 16C16.1667 16 15.4583 15.7083 14.875 15.125C14.2917 14.5417 14 13.8333 14 13H8C8 13.8333 7.70833 14.5417 7.125 15.125C6.54167 15.7083 5.83333 16 5 16ZM5 14C5.28333 14 5.52083 13.9042 5.7125 13.7125C5.90417 13.5208 6 13.2833 6 13C6 12.7167 5.90417 12.4792 5.7125 12.2875C5.52083 12.0958 5.28333 12 5 12C4.71667 12 4.47917 12.0958 4.2875 12.2875C4.09583 12.4792 4 12.7167 4 13C4 13.2833 4.09583 13.5208 4.2875 13.7125C4.47917 13.9042 4.71667 14 5 14ZM2 11H2.8C3.08333 10.7 3.40833 10.4583 3.775 10.275C4.14167 10.0917 4.55 10 5 10C5.45 10 5.85833 10.0917 6.225 10.275C6.59167 10.4583 6.91667 10.7 7.2 11H14V2H2V11ZM17 14C17.2833 14 17.5208 13.9042 17.7125 13.7125C17.9042 13.5208 18 13.2833 18 13C18 12.7167 17.9042 12.4792 17.7125 12.2875C17.5208 12.0958 17.2833 12 17 12C16.7167 12 16.4792 12.0958 16.2875 12.2875C16.0958 12.4792 16 12.7167 16 13C16 13.2833 16.0958 13.5208 16.2875 13.7125C16.4792 13.9042 16.7167 14 17 14ZM16 9H20.25L18 6H16V9Z" fill="white"/>
  </svg>
)

const LocationIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <path d="M9.95 21.9V19.9C7.86667 19.6667 6.07917 18.8042 4.5875 17.3125C3.09583 15.8208 2.23333 14.0333 2 11.95H0V9.95H2C2.23333 7.86667 3.09583 6.07917 4.5875 4.5875C6.07917 3.09583 7.86667 2.23333 9.95 2V0H11.95V2C14.0333 2.23333 15.8208 3.09583 17.3125 4.5875C18.8042 6.07917 19.6667 7.86667 19.9 9.95H21.9V11.95H19.9C19.6667 14.0333 18.8042 15.8208 17.3125 17.3125C15.8208 18.8042 14.0333 19.6667 11.95 19.9V21.9H9.95ZM10.95 17.95C12.8833 17.95 14.5333 17.2667 15.9 15.9C17.2667 14.5333 17.95 12.8833 17.95 10.95C17.95 9.01667 17.2667 7.36667 15.9 6C14.5333 4.63333 12.8833 3.95 10.95 3.95C9.01667 3.95 7.36667 4.63333 6 6C4.63333 7.36667 3.95 9.01667 3.95 10.95C3.95 12.8833 4.63333 14.5333 6 15.9C7.36667 17.2667 9.01667 17.95 10.95 17.95ZM10.95 14.95C9.85 14.95 8.90833 14.5583 8.125 13.775C7.34167 12.9917 6.95 12.05 6.95 10.95C6.95 9.85 7.34167 8.90833 8.125 8.125C8.90833 7.34167 9.85 6.95 10.95 6.95C12.05 6.95 12.9917 7.34167 13.775 8.125C14.5583 8.90833 14.95 9.85 14.95 10.95C14.95 12.05 14.5583 12.9917 13.775 13.775C12.9917 14.5583 12.05 14.95 10.95 14.95Z" fill="#004536"/>
  </svg>
)

const LayersIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
    <path d="M9 19.05L0 12.05L1.65 10.8L9 16.5L16.35 10.8L18 12.05L9 19.05ZM9 14L0 7L9 0L18 7L9 14ZM9 11.45L14.75 7L9 2.55L3.25 7L9 11.45Z" fill="#4B5563"/>
  </svg>
)

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 24" fill="none">
    <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#9CA3AF"/>
  </svg>
)

const PinNavIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none">
    <path d="M5 10.8333H6.66667V8.33333H9.58333V10.4167L12.5 7.5L9.58333 4.58333V6.66667H5.83333C5.59722 6.66667 5.39931 6.74653 5.23958 6.90625C5.07986 7.06597 5 7.26389 5 7.5V10.8333ZM8.33333 16.6667C8.125 16.6667 7.92014 16.625 7.71875 16.5417C7.51736 16.4583 7.33333 16.3333 7.16667 16.1667L0.5 9.5C0.333333 9.33333 0.208333 9.14931 0.125 8.94792C0.0416667 8.74653 0 8.54167 0 8.33333C0 8.125 0.0416667 7.92014 0.125 7.71875C0.208333 7.51736 0.333333 7.33333 0.5 7.16667L7.16667 0.5C7.33333 0.333333 7.51736 0.208333 7.71875 0.125C7.92014 0.0416667 8.125 0 8.33333 0C8.54167 0 8.74653 0.0416667 8.94792 0.125C9.14931 0.208333 9.33333 0.333333 9.5 0.5L16.1667 7.16667C16.3333 7.33333 16.4583 7.51736 16.5417 7.71875C16.625 7.92014 16.6667 8.125 16.6667 8.33333C16.6667 8.54167 16.625 8.74653 16.5417 8.94792C16.4583 9.14931 16.3333 9.33333 16.1667 9.5L9.5 16.1667C9.33333 16.3333 9.14931 16.4583 8.94792 16.5417C8.74653 16.625 8.54167 16.6667 8.33333 16.6667Z" fill="#004536"/>
  </svg>
)

// ─── Map zoom controller (must be inside MapContainer) ────────────────────

function ZoomController({ onReady }) {
  const map = useMap()
  useEffect(() => { onReady(map) }, [map, onReady])
  return null
}

// ─── Floating map search bar ──────────────────────────────────────────────

function FloatingSearchBar({ searchQuery, onSearchChange }) {
  const [focused, setFocused] = useState(false)

  return (
    <div className={`flex items-center bg-white rounded-lg overflow-hidden
      shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)]
      border transition-all duration-300
      ${focused ? 'border-[#004536]/30' : 'border-[#E5E7EB]'}`}
    >
      <span className="pl-4 pr-3 shrink-0 text-[#9CA3AF]">
        <SearchIcon />
      </span>
      <input
        type="text"
        placeholder="Cari pengepul, alamat, atau perusahaan..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="flex-1 py-3 text-sm font-medium text-[#051C37]
          placeholder:text-[#6B7280] placeholder:font-medium
          bg-transparent outline-none min-w-0"
      />
      {searchQuery && (
        <button
          onClick={() => onSearchChange('')}
          className="pr-3 pl-2 py-2 shrink-0 hover:opacity-70 active:scale-95
            transition-all duration-200 text-[#9CA3AF]"
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      <div className="w-px h-6 bg-[#E5E7EB] shrink-0 mx-1" />
      <button className="pr-3 pl-2 py-2 shrink-0 hover:opacity-70 active:scale-95
        transition-all duration-200" aria-label="Navigasi">
        <PinNavIcon />
      </button>
    </div>
  )
}

// ─── Map legend overlay ───────────────────────────────────────────────────

function MapLegend() {
  return (
    <div className="flex flex-col gap-3 p-4 rounded-xl bg-white/95 backdrop-blur-sm
      border border-[#E5E7EB] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10)]
      min-w-[168px] animate-fade-in">
      <p className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-widest">
        Tipe Lokasi
      </p>
      <div className="flex flex-col gap-3">
        {LEGEND_ITEMS.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
            <span className="text-[#051C37] text-xs font-semibold">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Custom map controls ──────────────────────────────────────────────────

function MapControlButtons({ mapRef }) {
  const handleZoomIn  = () => mapRef?.zoomIn()
  const handleZoomOut = () => mapRef?.zoomOut()
  const handleLocate  = () => mapRef?.locate({ setView: true, maxZoom: 15 })

  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <div className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden
        shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10)]">
        <button
          onClick={handleZoomIn}
          className="flex w-10 h-10 items-center justify-center border-b border-[#F3F4F6]
            hover:bg-gray-50 active:bg-gray-100 transition-colors"
          aria-label="Zoom in"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M6 8H0V6H6V0H8V6H14V8H8V14H6V8Z" fill="#374151"/>
          </svg>
        </button>
        <button
          onClick={handleZoomOut}
          className="flex w-10 h-10 items-center justify-center hover:bg-gray-50
            active:bg-gray-100 transition-colors"
          aria-label="Zoom out"
        >
          <svg width="14" height="2" viewBox="0 0 14 2" fill="none">
            <path d="M0 2V0H14V2H0Z" fill="#374151"/>
          </svg>
        </button>
      </div>

      <button
        onClick={handleLocate}
        className="flex w-10 h-10 items-center justify-center rounded-lg bg-white
          border border-[#E5E7EB] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10)]
          hover:bg-gray-50 active:bg-gray-100 transition-colors"
        aria-label="Lokasi saya"
      >
        <LocationIcon />
      </button>

      <button
        className="flex w-10 h-10 items-center justify-center rounded-lg bg-white
          border border-[#E5E7EB] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10)]
          hover:bg-gray-50 active:bg-gray-100 transition-colors"
        aria-label="Lapisan peta"
      >
        <LayersIcon />
      </button>
    </div>
  )
}

// ─── Collector card ───────────────────────────────────────────────────────

function CollectorCard({ collector, index, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer group animate-fade-slide-up ${
        isSelected
          ? 'border-[#006C49] bg-[#006C49]/5 shadow-lg'
          : 'border-white bg-white/50 hover:shadow-lg hover:bg-white/80 hover:-translate-y-0.5'
      }`}
      style={{ animationDelay: `${200 + index * 80}ms` }}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <h4 className="text-[#051C37] font-bold text-base leading-6 truncate">
            {collector.companyName}
          </h4>
          <p className="text-[#3F4945] text-[10px] leading-4 truncate">{collector.address}</p>
        </div>
        <span className="shrink-0 px-2 py-1 rounded-lg text-xs font-semibold leading-4 whitespace-nowrap
          bg-[#81F9C1] text-[#004536]">
          {collector.distanceKm.toFixed(2)} km
        </span>
      </div>

      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#BEC9C3]/20">
        <div className="flex-1 text-[10px]">
          <p className="text-[#3F4945]">Harga per liter</p>
          <p className="text-[#004536] font-bold">Rp {collector.buyPricePerLiter.toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  )
}

// ─── Right collector panel ────────────────────────────────────────────────

function CollectorPanel({ collectors, isLoading, selectedCollectorId, onCollectorSelect, searchQuery }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className={`flex flex-col w-full bg-white/85 backdrop-blur-[10px]
      border-t-2 border-[#C9A96E]/40 border-l border-r border-b border-[#C9A96E]/40
      lg:rounded-3xl overflow-hidden
      shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]
      transition-all duration-500 ease-out
      ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
    >
      {/* Panel header */}
      <div className="flex flex-col gap-4 px-6 pt-6 pb-4 border-b border-[#BEC9C3]/10 shrink-0">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[#004536] font-bold text-base leading-6">
            {searchQuery ? `Hasil Pencarian (${collectors.length})` : 'Pengepul Terdekat'}
          </h3>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[#C9A96E]/10 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A96E] animate-pulse" />
            <span className="text-[#C9A96E] text-[10px] font-bold uppercase tracking-wide">
              Live Update
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable collector list */}
      <div className="flex flex-col gap-4 p-6 overflow-y-auto flex-1 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-[#3F4945]">Memuat pengepul...</p>
            </div>
          </div>
        ) : collectors.length > 0 ? (
          collectors.map((c, i) => (
            <CollectorCard
              key={c.id}
              collector={c}
              index={i}
              isSelected={selectedCollectorId === c.id}
              onClick={() => onCollectorSelect(c.id)}
            />
          ))
        ) : (
          <p className="text-[#3F4945]/50 text-sm text-center py-8">
            Tidak ada pengepul terdekat
          </p>
        )}
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────

export default function InteractiveMapPage() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mapInstance, setMapInstance] = useState(null)
  const [collectors, setCollectors] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCollectorId, setSelectedCollectorId] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [userLat, setUserLat] = useState(-6.2615)
  const [userLng, setUserLng] = useState(106.8106)
  const [userName, setUserName] = useState('')

  const handleMapReady = useCallback((map) => setMapInstance(map), [])

  // Fetch user profile to get latest lat/lng from API
  useEffect(() => {
    const fetchUserLocation = async () => {
      try {
        const response = await api.get('/profiles/me')
        const profile = response.data
        if (profile?.profile?.latitude && profile?.profile?.longitude) {
          setUserLat(profile.profile.latitude)
          setUserLng(profile.profile.longitude)
        }
        if (profile?.name) {
          setUserName(profile.name)
        }
      } catch (error) {
        console.error('Failed to fetch user location:', error)
      }
    }

    fetchUserLocation()
  }, [])

  // Filter collectors based on search query
  const filteredCollectors = collectors.filter(collector => {
    const query = searchQuery.toLowerCase()
    return (
      collector.companyName.toLowerCase().includes(query) ||
      collector.address.toLowerCase().includes(query) ||
      collector.user?.name.toLowerCase().includes(query)
    )
  })

  // Load collectors on mount
  useEffect(() => {
    const loadCollectors = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/collectors/nearby', {
          params: {
            lat: userLat,
            lng: userLng,
            limit: 10,
          },
        })
        setCollectors(response.data.collectors || [])
        if (response.data.collectors && response.data.collectors.length > 0) {
          setSelectedCollectorId(response.data.collectors[0].id)
        }
      } catch (error) {
        console.error('Failed to load collectors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCollectors()
  }, [userLat, userLng])

  return (
    <div className="min-h-screen bg-[#E5E3DF] flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-[287px] min-w-0 min-h-screen">
        <TopBar onMenuToggle={() => setSidebarOpen(prev => !prev)} />

        {/* Map + Collector panel area */}
        <div className="flex-1 flex flex-col lg:block relative min-h-0">

          {/* Leaflet Map */}
          <div className="relative min-h-[60vw] sm:min-h-[50vh] lg:absolute lg:inset-0">
            <MapContainer
              center={[userLat, userLng]}
              zoom={13}
              zoomControl={false}
              className="absolute inset-0 w-full h-full"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <ZoomController onReady={handleMapReady} />

              {/* User marker */}
              <Marker position={[userLat, userLng]} icon={createMapPin('green', 'Anda')} zIndexOffset={1000}>
                <Popup>
                  <div className="min-w-[240px] p-3 bg-white rounded-lg">
                    <div className="flex items-start gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S15.33 8 14.5 8 13 8.67 13 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S8.33 8 7.5 8 6 8.67 6 9.5 6.67 11 7.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" fill="#065F46" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-[#051C37] text-sm leading-tight">Lokasi Anda</h4>
                        <p className="text-[#6F7975] text-xs mt-1">{user?.name || 'Komunitas'}</p>
                        <div className="flex items-center gap-1 mt-2 text-[10px] text-[#3F4945]">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="#6F7975" />
                          </svg>
                          <span>Latitude: {userLat.toFixed(4)}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-[#3F4945]">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="#6F7975" />
                          </svg>
                          <span>Longitude: {userLng.toFixed(4)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>

              {/* Collector markers - only show filtered ones */}
              {filteredCollectors.map((collector) => (
                <Marker
                  key={collector.id}
                  position={[collector.latitude, collector.longitude]}
                  icon={createMapPin(selectedCollectorId === collector.id ? 'green' : 'blue', collector.companyName.substring(0, 3))}
                  eventHandlers={{
                    click: () => setSelectedCollectorId(collector.id),
                  }}
                >
                  <Popup>
                    <div className="min-w-[260px] p-3 bg-white rounded-lg">
                      <div className="flex items-start gap-2.5 mb-3">
                        <div className="w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.06c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="#2563EB" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#051C37] text-sm leading-tight">{collector.companyName}</h4>
                          <p className="text-[#6F7975] text-xs mt-0.5">{collector.address}</p>
                        </div>
                      </div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#F3F4F6]">
                          <span className="text-[#6F7975]">Jarak</span>
                          <span className="font-semibold text-[#2563EB]">{collector.distanceKm.toFixed(2)} km</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#FEF3C7]">
                          <span className="text-[#6F7975]">Harga Beli</span>
                          <span className="font-semibold text-[#B45309]">Rp {collector.buyPricePerLiter.toLocaleString('id-ID')}/L</span>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#D1FAE5]">
                          <span className="text-[#6F7975]">Kapasitas</span>
                          <span className="font-semibold text-[#065F46]">{collector.capacityLiter.toLocaleString('id-ID')} L</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Floating search bar – top center of map */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 z-[400]
              w-[90%] max-w-[440px] px-1">
              <FloatingSearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
            </div>

            {/* Map legend – bottom left */}
            <div className="absolute bottom-6 left-6 z-[400] hidden sm:block">
              <MapLegend />
            </div>

            {/* Map controls – bottom right (shifted left of panel on desktop) */}
            <div className="absolute bottom-6 right-4 lg:right-[412px] z-[400]">
              <MapControlButtons mapRef={mapInstance} />
            </div>
          </div>

          {/* Collector panel – overlay on desktop, static below map on mobile */}
          <div className="lg:absolute lg:top-6 lg:right-6 lg:bottom-6 lg:w-[381px] z-[500]
            flex flex-col">
            <CollectorPanel
              collectors={filteredCollectors}
              isLoading={isLoading}
              selectedCollectorId={selectedCollectorId}
              onCollectorSelect={setSelectedCollectorId}
              searchQuery={searchQuery}
            />
          </div>
        </div>

        {/* Legend for mobile (below map) */}
        <div className="sm:hidden px-4 py-4 bg-white border-t border-[#BEC9C3]/30">
          <p className="text-[#9CA3AF] text-[10px] font-bold uppercase tracking-widest mb-3">
            Tipe Lokasi
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGEND_ITEMS.map(({ color, label }) => (
              <div key={label} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
                <span className="text-[#051C37] text-xs font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <DashboardFooter />
      </div>
    </div>
  )
}
