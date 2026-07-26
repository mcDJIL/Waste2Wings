import { useLocation } from 'react-router-dom'

import LeftPanel from '../../components/auth/LeftPanel'
import LoginCard from '../../components/auth/LoginCard'
import RegisterCard from '../../components/auth/RegisterCard'

function PageFooter() {
    return (
        <footer className="w-full max-w-[400px] mx-auto px-2 sm:px-0 mt-4 sm:mt-6 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="flex flex-wrap items-center justify-center gap-3 text-center text-[10px] sm:text-xs text-black/40">
                <a href="#" className="hover:text-black/60 transition-colors">
                    Bantuan
                </a>
                <span>•</span>
                <a href="#" className="hover:text-black/60 transition-colors">
                    Kebijakan Privasi
                </a>
                <span>•</span>
                <div className="flex items-center gap-1 justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path
                            d="M5.00625 10C4.31875 10 3.67083 9.86875 3.0625 9.60625C2.45417 9.34375 1.92292 8.98542 1.46875 8.53125C1.01458 8.07708 0.65625 7.54583 0.39375 6.9375C0.13125 6.32917 0 5.68125 0 4.99375C0 4.30625 0.13125 3.66042 0.39375 3.05625C0.65625 2.45208 1.01458 1.92292 1.46875 1.46875C1.92292 1.01458 2.45417 0.65625 3.0625 0.39375C3.67083 0.13125 4.31875 0 5.00625 0C5.69375 0 6.33958 0.13125 6.94375 0.39375C7.54792 0.65625 8.07708 1.01458 8.53125 1.46875C8.98542 1.92292 9.34375 2.45208 9.60625 3.05625C9.86875 3.66042 10 4.30625 10 4.99375C10 5.68125 9.86875 6.32917 9.60625 6.9375C9.34375 7.54583 8.98542 8.07708 8.53125 8.53125C8.07708 8.98542 7.54792 9.34375 6.94375 9.60625C6.33958 9.86875 5.69375 10 5.00625 10ZM5 8.975C5.21667 8.675 5.40417 8.3625 5.5625 8.0375C5.72083 7.7125 5.85 7.36667 5.95 7H4.05C4.15 7.36667 4.27917 7.7125 4.4375 8.0375C4.59583 8.3625 4.78333 8.675 5 8.975ZM3.7 8.775C3.55 8.5 3.41875 8.21458 3.30625 7.91875C3.19375 7.62292 3.1 7.31667 3.025 7H1.55C1.79167 7.41667 2.09375 7.77917 2.45625 8.0875C2.81875 8.39583 3.23333 8.625 3.7 8.775ZM6.3 8.775C6.76667 8.625 7.18125 8.39583 7.54375 8.0875C7.90625 7.77917 8.20833 7.41667 8.45 7H6.975C6.9 7.31667 6.80625 7.62292 6.69375 7.91875C6.58125 8.21458 6.45 8.5 6.3 8.775ZM1.125 6H2.825C2.8 5.83333 2.78125 5.66875 2.76875 5.50625C2.75625 5.34375 2.75 5.175 2.75 5C2.75 4.825 2.75625 4.65625 2.76875 4.49375C2.78125 4.33125 2.8 4.16667 2.825 4H1.125C1.08333 4.16667 1.05208 4.33125 1.03125 4.49375C1.01042 4.65625 1 4.825 1 5C1 5.175 1.01042 5.34375 1.03125 5.50625C1.05208 5.66875 1.08333 5.83333 1.125 6ZM3.825 6H6.175C6.2 5.83333 6.21875 5.66875 6.23125 5.50625C6.24375 5.34375 6.25 5.175 6.25 5C6.25 4.825 6.24375 4.65625 6.23125 4.49375C6.21875 4.33125 6.2 4.16667 6.175 4H3.825C3.8 4.16667 3.78125 4.33125 3.76875 4.49375C3.75625 4.65625 3.75 4.825 3.75 5C3.75 5.175 3.75625 5.34375 3.76875 5.50625C3.78125 5.66875 3.8 5.83333 3.825 6ZM7.175 6H8.875C8.91667 5.83333 8.94792 5.66875 8.96875 5.50625C8.98958 5.34375 9 5.175 9 5C9 4.825 8.98958 4.65625 8.96875 4.49375C8.94792 4.33125 8.91667 4.16667 8.875 4H7.175C7.2 4.16667 7.21875 4.33125 7.23125 4.49375C7.24375 4.65625 7.25 4.825 7.25 5C7.25 5.175 7.24375 5.34375 7.23125 5.50625C7.21875 5.66875 7.2 5.83333 7.175 6ZM6.975 3H8.45C8.20833 2.58333 7.90625 2.22083 7.54375 1.9125C7.18125 1.60417 6.76667 1.375 6.3 1.225C6.45 1.5 6.58125 1.78542 6.69375 2.08125C6.80625 2.37708 6.9 2.68333 6.975 3ZM4.05 3H5.95C5.85 2.63333 5.72083 2.2875 5.5625 1.9625C5.40417 1.6375 5.21667 1.325 5 1.025C4.78333 1.325 4.59583 1.6375 4.4375 1.9625C4.27917 2.2875 4.15 2.63333 4.05 3ZM1.55 3H3.025C3.1 2.68333 3.19375 2.37708 3.30625 2.08125C3.41875 1.78542 3.55 1.5 3.7 1.225C3.23333 1.375 2.81875 1.60417 2.45625 1.9125C2.09375 2.22083 1.79167 2.58333 1.55 3Z"
                            fill="black"
                            fillOpacity="0.4"
                        />
                    </svg>
                    <span className="text-black/40 text-xs">ID (Indonesia)</span>
                </div>
                </div>
        </footer>
    )
}

export default function AuthPage() {
    const location = useLocation()
    const isRegister = location.pathname === '/register'

    return (
        <div className="flex min-h-screen">
            <LeftPanel />

            <div className="flex-1 flex flex-col items-center justify-center bg-white min-h-screen px-4 py-8 sm:px-6">
                <div className="w-full max-w-[400px] auth-card-viewport mx-auto px-2 sm:px-0 mb-4" style={{ perspective: '1200px' }}>
                    <div className={`auth-card-container ${isRegister ? 'flip-back' : 'flip-front'}`}>
                        <div className="auth-card-face face-front">
                            <LoginCard />
                        </div>
                        <div className="auth-card-face face-back">
                            <RegisterCard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
