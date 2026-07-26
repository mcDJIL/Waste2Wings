import { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'

const navLinks = [
  { label: 'Tentang', href: '#tentang', active: true },
  { label: 'Cara Kerja', href: '#cara-kerja' },
  { label: 'Manfaat', href: '#manfaat' },
  { label: 'Kontak', href: '#kontak' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[61px] flex items-center justify-between px-4 sm:px-8 lg:px-12 border-b border-[rgba(190,201,195,0.20)] bg-[rgba(249,249,255,0.80)] backdrop-blur-md shadow-[0_10px_15px_-3px_rgba(255,255,255,0.10)]">
      <div className="flex items-center gap-2 sm:gap-3">
        <img src={logo} alt="HEN Waste Oil Logo" className="w-8 h-8" />

        <span className="text-brand-dark font-bold text-base leading-6 shrink-0 min-w-0">
          HEN Waste Oil
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(({ label, href, active }) => (
          <a
            key={label}
            href={href}
            className={`flex flex-col text-base leading-6 transition-colors ${
              active
                ? 'text-brand-dark pb-1 border-b-2 border-brand-dark'
                : 'text-brand-text hover:text-brand-dark'
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="hidden md:flex items-center gap-[18px]">
        <Link to="/login" className="px-4 py-2 cursor-pointer text-brand-dark text-base leading-6 hover:opacity-70 transition-opacity">
          Login
        </Link>
        <Link to="/register" className="px-6 py-[10px] cursor-pointer rounded-full bg-brand-dark text-white text-base leading-6 hover:bg-brand-green transition-colors">
          Daftar
        </Link>
      </div>

      <button
        className="md:hidden p-2 text-brand-dark"
        aria-label="Toggle menu"
        onClick={() => setMenuOpen((prev) => !prev)}
      >
        {menuOpen ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {menuOpen && (
        <div className="absolute top-[61px] left-0 right-0 bg-[rgba(249,249,255,0.97)] backdrop-blur-md border-b border-[rgba(190,201,195,0.20)] flex flex-col px-4 py-4 gap-1 md:hidden shadow-lg">
          {navLinks.map(({ label, href, active }) => (
            <a
              key={label}
              href={href}
              className={`py-3 px-2 text-base border-b border-[rgba(190,201,195,0.15)] last:border-0 transition-colors ${
                active ? 'text-brand-dark font-medium' : 'text-brand-text hover:text-brand-dark'
              }`}
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </a>
          ))}
          <div className="flex gap-3 pt-3">
            <button className="flex-1 py-2.5 text-brand-dark border border-[rgba(0,69,54,0.20)] rounded-full text-sm hover:bg-[rgba(0,69,54,0.05)] transition-colors">
              Login
            </button>
            <button className="flex-1 py-2.5 bg-brand-dark text-white rounded-full text-sm hover:bg-brand-green transition-colors">
              Daftar
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
