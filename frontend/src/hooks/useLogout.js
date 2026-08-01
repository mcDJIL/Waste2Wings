import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function useLogout() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  return () => {
    logout()
    navigate('/login')
  }
}
