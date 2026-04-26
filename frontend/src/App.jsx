import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom'
import Navbar from './components/Navbar'
import Discover from './pages/Discover'
import AlbumDetail from './pages/AlbumDetail'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'

// Landing page with Sign up and Log in options
function Landing() {
  return (
    <main style={{ padding: 40, textAlign: 'center' }}>
      <h1 style={{ fontSize: 48, marginBottom: 8 }}>Vynl</h1>
      <p style={{ fontSize: 18, marginBottom: 40 }}>Rate and compare your favorite albums</p>
      <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
        <Link to="/signup" style={{ padding: '16px 32px', background: '#000', color: '#fff', textDecoration: 'none', fontSize: 18, fontWeight: 'bold' }}>
          Sign up
        </Link>
        <Link to="/login" style={{ padding: '16px 32px', background: '#fff', color: '#000', border: '2px solid #000', textDecoration: 'none', fontSize: 18, fontWeight: 'bold' }}>
          Log in
        </Link>
      </div>
    </main>
  )
}

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
        <Route path="/" element={isLoggedIn ? <Discover searchValue={searchValue} /> : <Landing />} />
        <Route path="/album/:id" element={isLoggedIn ? <AlbumDetail /> : <Navigate to="/" />} />
        <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}