import React from 'react'
import ReactDOM from 'react-dom/client'
import { Navigate, createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './Pages/Home'
import Foods from './Pages/Foods'
import FoodDetail from './Pages/FoodDetail'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store'
import CalendarPage from './Pages/CalendarPage'
import Xchat from './Pages/Xchat'
import Customer from './Pages/Customer'
import Login from './Pages/Login'
import Registr from './Pages/Registr'
import { getSession } from './auth'

const ProtectedRoute = ({ children }) => {
  const session = getSession()

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

const PublicOnlyRoute = ({ children }) => {
  const session = getSession()

  if (session) {
    return <Navigate to="/" replace />
  }

  return children
}

const router = createBrowserRouter([
  {
    path: '/register',
    element: (
      <PublicOnlyRoute>
        <Registr />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/login',
    element: (
      <PublicOnlyRoute>
        <Login />
      </PublicOnlyRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <App />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'foods',
        element: <Foods />,
      },
      {
        path: 'foods/:id',
        element: <FoodDetail />,
      },
      {
        path: 'calendar',
        element: <CalendarPage />,
      },
      {
        path: 'foods',
        element: <Foods />,
      },
      {
        path: 'foods/:id',
        element: <FoodDetail />,
      },
        {
        path: '/calendar',
        element: <CalendarPage />,
      },
      {
        path: '/xchat',
        element: <Xchat/>
      },
        {
        path: '/customers',
        element: <Customer/>
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)