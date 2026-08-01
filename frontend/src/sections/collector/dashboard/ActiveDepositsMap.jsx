import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../../../services/api'

// Fix Leaflet icon URLs broken by Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const createPin = (color, size = 24) => {
  return L.divIcon({
    className: '',
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size + 8],
    popupAnchor: [0, -(size + 10)],
    html: `<div style="filter:drop-shadow(0 2px 4px rgba(0,0,0,.25))">
      <svg width="${size}" height="${size + 8}" viewBox="0 0 32 42" fill="none">
        <path d="M16 2C10.48 2 6 6.48 6 12c0 9 10 22 10 22s10-13 10-22c0-5.52-4.48-10-10-10z"
          fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="12" r="4" fill="white"/>
      </svg>
    </div>`,
  })
}

const LocationIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
    <path d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z" fill="#C19A00" />
  </svg>
)

export default function ActiveDepositsMap() {
  const [mapData, setMapData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [mapReady, setMapReady] = useState(false)
  const [centerCoords, setCenterCoords] = useState([-6.2, 106.8])

  useEffect(() => {
    const t = setTimeout(() => setMapReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/collectors/me/map')
        const data = response.data?.data || response.data

        if (data) {
          setMapData(data)
          if (data.collector?.latitude && data.collector?.longitude) {
            setCenterCoords([data.collector.latitude, data.collector.longitude])
          }
        }
      } catch (error) {
        console.error('Failed to fetch map data:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMapData()
  }, [])

  const buildMapPoints = () => {
    const points = []

    if (mapData?.collector) {
      points.push({
        id: 'collector',
        icon: createPin('#004536'),
        pos: [mapData.collector.latitude, mapData.collector.longitude],
        popup: { name: mapData.collector.companyName, detail: mapData.collector.address },
      })
    }

    if (mapData?.henReceptionLocation) {
      points.push({
        id: 'hen',
        icon: createPin('#BA1A1A'),
        pos: [mapData.henReceptionLocation.latitude, mapData.henReceptionLocation.longitude],
        popup: { name: mapData.henReceptionLocation.name, detail: mapData.henReceptionLocation.address },
      })
    }

    if (mapData?.communityMarkers && Array.isArray(mapData.communityMarkers)) {
      mapData.communityMarkers.forEach((marker, idx) => {
        points.push({
          id: `community-${idx}`,
          icon: createPin('#81F9C1', 18),
          pos: [marker.latitude, marker.longitude],
          popup: { name: marker.name, detail: `${marker.totalCleanLiter} L` },
        })
      })
    }

    return points
  }

  const mapPoints = mapData ? buildMapPoints() : []

  return (
    <div className="flex flex-col p-6 rounded-2xl border border-[#E0DBDF] bg-white h-full collector-card-enter" style={{ animationDelay: '200ms' }}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <LocationIcon />
        <h3 className="text-[#1D1B1A] text-base font-bold font-poppins">
          Peta Lokasi Setoran Aktif
        </h3>
      </div>

      {/* Map container */}
      <div className="relative flex-1 rounded-xl overflow-hidden min-h-[220px] bg-[#F5F5F5]">
        {mapReady && !isLoading && mapData && (
          <MapContainer
            center={centerCoords}
            zoom={12}
            className="w-full h-full"
            style={{ minHeight: '100%' }}
            zoomControl={false}
            dragging={true}
            touchZoom={true}
          >
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {mapPoints.map((point) => (
              <Marker
                key={point.id}
                position={point.pos}
                icon={point.icon}
              >
                <Popup>
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <span className="font-bold text-[#051C37] text-xs">{point.popup.name}</span>
                    <span className="text-[#3F4945] text-[10px]">{point.popup.detail}</span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        )}

        {isLoading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin">
              <div className="w-6 h-6 border-3 border-[#E0DBDF] border-t-[#004536] rounded-full" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
