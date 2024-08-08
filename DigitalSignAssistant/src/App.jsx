import { useState } from 'react'
import './App.css'
import { Navbar } from './components/Navbar'
import { Dashboard } from './components/Dashboard/Index'

function App() { 

  return (
    <>
      <Navbar />
      <Dashboard />
    </>
  )
}

export default App
