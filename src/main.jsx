import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  useOutletContext,
} from 'react-router-dom'
import App, { ProtectedRoute } from './App'
import Login from './pages/Login'
import Registr from './pages/Registr'
import Dashboard from './pages/Dashboard'
import './index.css'

const DashboardRoute = () => {
  const { session, handleLogout } = useOutletContext()

  return (
    <ProtectedRoute isAuthenticated={Boolean(session)}>
      <Dashboard session={session} onLogout={handleLogout} />
    </ProtectedRoute>
  )

}



const RootLayout = () => <Outlet />

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Registr /> },
      { path: 'login', element: <Login /> },
      { path: 'dashboard', element: <DashboardRoute /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
  {
    element: <RootLayout />,
    children: [{ path: '*', element: <Navigate to="/" replace /> }],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
