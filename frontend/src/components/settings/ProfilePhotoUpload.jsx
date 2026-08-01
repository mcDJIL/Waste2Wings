import { useRef, useState } from 'react'

const CameraIcon = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
    <path d="M13 17.5C14.3807 17.5 15.5 16.3807 15.5 15C15.5 13.6193 14.3807 12.5 13 12.5C11.6193 12.5 10.5 13.6193 10.5 15C10.5 16.3807 11.6193 17.5 13 17.5Z" fill="white" />
    <path d="M9.5 7L7.87 9H5C3.9 9 3 9.9 3 11V21C3 22.1 3.9 23 5 23H21C22.1 23 23 22.1 23 21V11C23 9.9 22.1 9 21 9H18.13L16.5 7H9.5ZM13 20C10.79 20 9 18.21 9 16C9 13.79 10.79 12 13 12C15.21 12 17 13.79 17 16C17 18.21 15.21 20 13 20Z" fill="white" />
  </svg>
)

export default function ProfilePhotoUpload({ previewUrl, onFileChange }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFileSelect = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    if (file.size > 10 * 1024 * 1024) return
    onFileChange?.(file)
  }

  const handleInputChange = (e) => {
    handleFileSelect(e.target.files?.[0])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files?.[0])
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={[
          'relative w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-white',
          'shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]',
          'overflow-hidden bg-[#E8F0EC] cursor-pointer group transition-all duration-300',
          isDragging ? 'scale-105 border-[#81F9C1]' : '',
        ].join(' ')}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
        aria-label="Upload photo"
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Profile"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <CameraIcon />
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#004536]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <CameraIcon />
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      <p className="text-[#404945] text-[10px] sm:text-xs font-bold tracking-[1.2px] uppercase text-center">
        Besar file: maks. 10MB
      </p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="px-5 sm:px-6 py-2 rounded-full bg-[#002D22] text-white text-xs sm:text-sm font-semibold tracking-[0.7px] hover:bg-[#004536] active:scale-95 transition-all duration-200 shadow-sm"
      >
        Ganti Foto
      </button>
    </div>
  )
}
