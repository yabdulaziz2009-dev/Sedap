import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Home from './Pages/Home'
import Foods from './Pages/Foods'
import FoodDetail from './Pages/FoodDetail'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
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
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
