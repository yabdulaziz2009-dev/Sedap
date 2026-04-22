import React from 'react'
import { useSelector } from 'react-redux'
import Layout from './Components/Layout'

const App = () => {
  const { mode } = useSelector((state) => state.theme)

  return (
    <div className={mode === 'dark' ? 'dark' : ''}>
      <Layout />
    </div>
  )
}

export default App
