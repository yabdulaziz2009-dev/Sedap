import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { clearSession, getSession, initializeAuth } from './services/auth'

export const ProtectedRoute = ({ isAuthenticated, children }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const App = () => {
  const [session, setSession] = useState(() => {
    initializeAuth()
    return getSession()
  })

  useEffect(() => {
    initializeAuth()

    const syncSession = () => {
      setSession(getSession())
    }

    window.addEventListener('storage', syncSession)
    window.addEventListener('auth-change', syncSession)

    return () => {
      window.removeEventListener('storage', syncSession)
      window.removeEventListener('auth-change', syncSession)
    }
  }, [])

  const handleLogout = () => {
    clearSession()
    setSession(null)
  }

  return <Outlet context={{ session, handleLogout }} />
}

export default App
