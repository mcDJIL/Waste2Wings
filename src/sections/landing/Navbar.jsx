import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../../assets/images/logo.png'
import { useScrollSpy } from '../../hooks/useScrollSpy'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

const navLinks = [
  { label: 'Tentang', href: '#tentang', id: 'tentang' },
  { label: 'Cara Kerja', href: '#cara-kerja', id: 'cara-kerja' },
  { label: 'Manfaat', href: '#manfaat', id: 'manfaat' },
  { label: 'Kontak', href: '#kontak', id: 'kontak' },
]

const scrollToSection = (e, sectionId) => {
  e.preventDefault()
  const element = document.getElementById(sectionId)
  if (element) {
    const offsetTop = element.offsetTop - 61
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    })
  }
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isVerifying, setIsVerifying] = useState(true)
  const sectionIds = navLinks.map(link => link.id)
  const activeId = useScrollSpy(sectionIds, { offset: 80 })
  const { user, token, login, logout } = useAuth()
  const navigate = useNavigate()

  const userLocal = localStorage.getItem('user')
  const role = userLocal ? JSON.parse(userLocal).role : null;

  useEffect(() => {
    const verifyAuth = async () => {
      if (token) {
        try {
          const response = await api.get('/auth/me')
          const { user: currentUser } = response.data
          login(token, currentUser)
        } catch (error) {
          console.error('Failed to verify user:', error)
          logout()
        }
      }
      setIsVerifying(false)
    }

    verifyAuth()
  }, [token])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[61px] flex items-center justify-between px-4 sm:px-8 lg:px-12 border-b border-[rgba(190,201,195,0.20)] bg-[rgba(249,249,255,0.80)] backdrop-blur-md shadow-[0_10px_15px_-3px_rgba(255,255,255,0.10)]">
      <div className="flex items-center gap-2 sm:gap-3">
        <img src={logo} alt="HEN Waste Oil Logo" className="w-8 h-8" />

        <span className="text-brand-dark font-bold text-base leading-6 shrink-0 min-w-0">
          HEN Waste Oil
        </span>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navLinks.map(({ label, id }) => (
          <a
            key={id}
            href={`#${id}`}
            onClick={(e) => scrollToSection(e, id)}
            className={`flex flex-col text-base leading-6 transition-colors cursor-pointer ${
              activeId === id
                ? 'text-brand-dark pb-1 border-b-2 border-brand-dark'
                : 'text-brand-text hover:text-brand-dark'
            }`}
          >
            {label}
          </a>
        ))}

          {role === 'COMMUNITY' ? (
            <a
              href={'/community/dashboard'}
              className={`flex flex-col text-base leading-6 transition-colors cursor-pointer`}
            >
              Dashboard
            </a>
          ) : role === 'COLLECTOR' ? (
            <a
              href={'/collector/dashboard'}
              className={`flex flex-col text-base leading-6 transition-colors cursor-pointer`}
            >
              Dashboard
            </a>
          ) : role === 'STAKEHOLDER' ? (
            <a
              href={'/stakeholder/dashboard'}
              className={`flex flex-col text-base leading-6 transition-colors cursor-pointer`}
            >
              Dashboard
            </a>
          ) : null}
      </div>

      <div className="hidden md:flex items-center gap-[18px]">
        {isVerifying ? (
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
        ) : user ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-brand-dark">{user.name}</span>
                <span className="text-xs text-brand-text capitalize">{user.role?.toLowerCase()}</span>
              </div>
            </div>
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="px-6 py-[10px] cursor-pointer rounded-full bg-red-500 text-white text-base leading-6 hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="px-4 py-2 cursor-pointer text-brand-dark text-base leading-6 hover:opacity-70 transition-opacity">
              Login
            </Link>
            <Link to="/register" className="px-6 py-[10px] cursor-pointer rounded-full bg-brand-dark text-white text-base leading-6 hover:bg-brand-green transition-colors">
              Daftar
            </Link>
          </>
        )}
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
          {navLinks.map(({ label, id }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`py-3 px-2 text-base border-b border-[rgba(190,201,195,0.15)] last:border-0 transition-colors cursor-pointer ${
                activeId === id ? 'text-brand-dark font-medium bg-[rgba(0,69,54,0.05)]' : 'text-brand-text hover:text-brand-dark'
              }`}
              onClick={(e) => {
                scrollToSection(e, id)
                setMenuOpen(false)
              }}
            >
              {label}
            </a>
          ))}

          <div className="border-t border-[rgba(190,201,195,0.15)] mt-3 pt-3">
            {isVerifying ? (
              <div className="w-full h-10 bg-gray-200 rounded animate-pulse" />
            ) : user ? (
              <>
                <div className="flex items-center gap-2 px-2 py-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col flex-1">
                    <span className="text-sm font-semibold text-brand-dark">{user.name}</span>
                    <span className="text-xs text-brand-text capitalize">{user.role?.toLowerCase()}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout()
                    navigate('/login')
                    setMenuOpen(false)
                  }}
                  className="w-full py-2.5 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 transition-colors font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 py-2.5 text-brand-dark border border-[rgba(0,69,54,0.20)] rounded-full text-sm hover:bg-[rgba(0,69,54,0.05)] transition-colors text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 py-2.5 bg-brand-dark text-white rounded-full text-sm hover:bg-brand-green transition-colors text-center"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
