import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { PasswordProtect } from './components'
import PhonogramSeal from './pages/PhonogramSeal'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route 
          path="/upload" 
          element={
            <PasswordProtect>
              <PhonogramSeal />
            </PasswordProtect>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App 