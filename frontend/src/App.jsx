import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Discover from './pages/Discover'
import AlbumDetail from './pages/AlbumDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

export default function App() {
  const [searchValue, setSearchValue] = useState('')
  const [userId, setUserId] = useState(localStorage.getItem('userId'))

  useEffect(() => {
    // Listen for custom event when user logs in
    const handleLogin = () => {
      setUserId(localStorage.getItem('userId'))
    }
    window.addEventListener('userLoggedIn', handleLogin)
    return () => window.removeEventListener('userLoggedIn', handleLogin)
  }, [])

  const isLoggedIn = Boolean(userId)

  return (
    <BrowserRouter>
      {isLoggedIn && <Navbar searchValue={searchValue} onSearchChange={setSearchValue} />}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={isLoggedIn ? <Discover searchValue={searchValue} /> : <Navigate to="/signup" />} />
        <Route path="/album/:id" element={isLoggedIn ? <AlbumDetail /> : <Navigate to="/signup" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/signup" />} />
      </Routes>
    </BrowserRouter>
  )
}