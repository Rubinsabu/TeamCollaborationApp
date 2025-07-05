import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage'
import SignupPage from './features/auth/SignupPage'
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar'
import Dashboard from './pages/Dashboard'


function App() {
  const user = useSelector(state => state.auth.user);

  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/"/>} />
        <Route path="/register" element={!user ? <SignupPage /> : <Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
